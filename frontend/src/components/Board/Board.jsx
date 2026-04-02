import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { BoardContext } from "@/store/BoardContext";
import rough from "roughjs";
import { TOOLS, BOARD_ACTION_TYPE } from "@/Constants";
import styles from "./Board.module.css";

const Board = () => {
  const textAreaRef = useRef();
  const boardCanvasRef = useRef();
  const {
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    elements,
    boardActionType,
    boardRedoHandler,
    boardUndoHandler,
  } = useContext(BoardContext);

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

    elements.forEach((element) => {
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
          roughCanvas.draw(element.roughElement);
          break;
        case TOOLS.PEN:
          ctx.fillStyle = element.stroke;
          ctx.fill(element.path);
          break;
        default:
          break;
      }
    });
  }, [elements]);

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

  const lastElement = elements[elements.length - 1];

  return (
    <>
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
    </>
  );
};

export default Board;
