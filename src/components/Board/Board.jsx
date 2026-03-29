import React, { useContext, useLayoutEffect } from "react";
import { BoardContext } from "@/store/BoardContext";
import rough from "roughjs";
import { TOOLS } from "@/Constants";

const Board = () => {
  const boardCanvasRef = React.useRef();
  const {
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    elements,
  } = useContext(BoardContext);

  // Set the canvas size once on mount
  useLayoutEffect(() => {
    const canvas = boardCanvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // Redraw all elements every time the elements array updates
  useLayoutEffect(() => {
    const canvas = boardCanvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      switch (element.type) {
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

  return (
    <div>
      <canvas
        ref={boardCanvasRef}
        style={{
          touchAction: "none",
          background: "white",
          display: "block",
        }}
        onPointerDown={boardMouseDownHandler}
        onPointerMove={boardMouseMoveHandler}
        onPointerUp={boardMouseUpHandler}
      ></canvas>
    </div>
  );
};

export default Board;
