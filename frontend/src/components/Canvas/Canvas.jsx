import React from "react";
import Board from "../Board/Board.jsx";
import Toolbar from "../Toolbar/Toolbar.jsx";
import Toolbox from "../Toolbox/Toolbox.jsx";
import styles from "./Canvas.module.css";

function Canvas() {
  return (
    <>
      <Toolbar />
      <Toolbox />
      <Board />
    </>
  );
}

export default Canvas;
