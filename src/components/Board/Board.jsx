import React, { useContext, useLayoutEffect } from "react";
import { BoardContext } from "@/store/boardContext";
import rough from "roughjs";

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
      roughCanvas.draw(element.roughElement);
    });
  }, [elements]);

  return (
    <div>
      <canvas
        ref={boardCanvasRef}
        style={{ touchAction: "none" }}
        onPointerDown={boardMouseDownHandler}
        onPointerMove={boardMouseMoveHandler}
        onPointerUp={boardMouseUpHandler}
      ></canvas>
    </div>
  );
};

export default Board;
