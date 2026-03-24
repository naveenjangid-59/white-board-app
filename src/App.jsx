import React from "react";
import Board from "./components/Board/Board";
import Toolbar from "./components/Toolbar/Toolbar";
import { BoardContextProvider } from "./store/boardContext";

const App = () => {
  return (
    <BoardContextProvider>
      <Board />
      <Toolbar />
    </BoardContextProvider>
  );
};

export default App;
