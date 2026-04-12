import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BoardContext } from "@/store/BoardContext";
import rough from "roughjs";
import { useParams, useNavigate } from "react-router-dom";
import { TOOLS, BOARD_ACTION_TYPE } from "@/Constants";
import styles from "./Board.module.css";
import api from "../../Api";
import { io } from "socket.io-client";
import { hydrateElement } from "@/utils/Element";

const Board = () => {
  const textAreaRef = useRef();
  const boardCanvasRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    elements,
    boardActionType,
    boardRedoHandler,
    boardUndoHandler,
    setElementsHandler,
  } = useContext(BoardContext);

  const safeElements = Array.isArray(elements) ? elements : [];
  const { id } = useParams();
  const socketRef = useRef(null);
  const isRemoteUpdateRef = useRef(false);
  const skipSaveRef = useRef(false);

  // fetch canvas data on mount and when id changes
  useEffect(() => {
    async function fetchCanvas() {
      if (!id) return;

      try {
        const res = await api.get(`/canvases/load/${id}`);
        const canvasData = res?.data?.data;

        const hydratedElements = Array.isArray(canvasData?.elements)
          ? canvasData.elements.map(hydrateElement)
          : [];

        // Hydrating from DB should not trigger an immediate save.
        skipSaveRef.current = true;
        setElementsHandler(hydratedElements);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch canvas");
      }
    }

    fetchCanvas();
  }, [id]);

  // establish socket connection for real-time updates + join canvas room
  useEffect(() => {
    if (!id) return;

    const socket = io("http://localhost:3030", {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.emit("joinCanvas", id); // joins room

    return () => socket.disconnect();
  }, [id]);

  // when i draw on canvas, emmit event with new elements
  useEffect(() => {
    if (!socketRef.current || !isLoaded || !id) return;

    // Prevent re-broadcasting updates that originated from another user.
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    socketRef.current.emit("draw", {
      canvasId: id,
      senderId: socketRef.current.id,
      elements: safeElements,
    });
  }, [safeElements, id, isLoaded]);

  const drawBoard = useCallback(() => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    //css size (layout size)
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    //internal pixel buffer size (for sharp rendering)
    const nextWidth = Math.floor(displayWidth * dpr);
    const nextHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const roughCanvas = rough.canvas(canvas);

    safeElements.forEach((element) => {
      switch (element.type) {
        case TOOLS.TEXT: {
          ctx.textBaseline = "top";
          const fontSize =
            element.options?.strokeWidth ?? element.options?.size ?? 16;
          ctx.font = `400 ${fontSize}px "Raleway", sans-serif`;
          ctx.fillStyle = element.options?.stroke ?? "#000";
          ctx.fillText(element.text || "", element.x1, element.y1);
          break;
        }
        case TOOLS.LINE:
        case TOOLS.RECTANGLE:
        case TOOLS.CIRCLE:
        case TOOLS.ARROW:
          if (element?.roughElement) {
            roughCanvas.draw(element.roughElement);
          }
          break;
        case TOOLS.PEN:
          ctx.fillStyle = element.stroke;
          ctx.fill(element.path);
          break;
        default:
          break;
      }
    });
  }, [safeElements]);

  // when other users draw, update canvas
  useEffect(() => {
    if (!socketRef.current) return;

    const handler = (data) => {
      const { senderId, elements } = data;
      if (senderId === socketRef.current.id) return; // ignore own events

      isRemoteUpdateRef.current = true;
      // Remote updates should not trigger autosave on this client.
      skipSaveRef.current = true;
      const hydrated = Array.isArray(elements)
        ? elements.map(hydrateElement)
        : [];
      setElementsHandler(hydrated);
    };
    socketRef.current.on("draw", handler);
    return () => {
      socketRef.current.off("draw", handler);
    };
  }, [id, setElementsHandler]);

  //draw on mount+when elements change
  useLayoutEffect(() => {
    drawBoard();
  }, [drawBoard]);

  useLayoutEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        boardUndoHandler();
      } else if (event.ctrlKey && event.key === "y") {
        boardRedoHandler();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [boardUndoHandler, boardRedoHandler]);

  //redraw on viewport resize
  useEffect(() => {
    const onResize = () => drawBoard();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawBoard]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (boardActionType === BOARD_ACTION_TYPE.WRITING) {
      setTimeout(() => {
        textArea?.focus();
      }, 0);
    }
  }, [boardActionType]);

  const lastElement = safeElements[safeElements.length - 1];

  useEffect(() => {
    if (!id || !isLoaded) return;

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        await api.put("/canvases/update", {
          canvasId: id,
          elements: safeElements,
        });
        console.log("Canvas saved");
        setIsSaving(false);
      } catch (error) {
        console.error("Failed to save canvas");
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [safeElements, id, isLoaded]);
  const navigate = useNavigate();
  return (
    <>
      <p className={styles.saveStatus}>{isSaving ? "Saving..." : "Saved"}</p>
      {boardActionType === BOARD_ACTION_TYPE.WRITING && (
        <textarea
          name="textarea"
          className={styles.textElementBox}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: `${lastElement?.y1}px`,
            left: `${lastElement?.x1}px`,
            zIndex: 2,

            fontSize: `${
              lastElement?.options?.strokeWidth ??
              lastElement?.options?.size ??
              16
            }px`,
            fontFamily: `"Raleway", sans-serif`,
            lineHeight: 1,
            color: lastElement?.options?.stroke,

            padding: 0,
            margin: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            resize: "none",
            overflow: "hidden",
          }}
          ref={textAreaRef}
          onBlur={() => {
            textAreaBlurHandler(textAreaRef.current.value);
          }}
        />
      )}
      <canvas
        ref={boardCanvasRef}
        style={{
          touchAction: "none",
          background: "white",
          display: "block",
        }}
        id="canvas"
        onPointerDown={boardMouseDownHandler}
        onPointerMove={boardMouseMoveHandler}
        onPointerUp={boardMouseUpHandler}
      ></canvas>
      <button
        className={styles.dashboardBtn}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Go to Dashboard
      </button>
    </>
  );
};

export default Board;
