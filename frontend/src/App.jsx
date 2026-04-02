import React from "react";
import Board from "./components/Board/Board";
import Toolbar from "./components/Toolbar/Toolbar";
import Toolbox from "./components/Toolbox/Toolbox";
import { BoardContextProvider } from "./store/BoardContext";
import { ToolboxContextProvider } from "./store/ToolboxContext";

const App = () => {
  return (
    <ToolboxContextProvider>
      <BoardContextProvider>
        <Board />
        <Toolbar />
        <Toolbox />
      </BoardContextProvider>
    </ToolboxContextProvider>
  );
};

export default App;
