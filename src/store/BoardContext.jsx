import { createContext, useReducer } from "react";
import { TOOLS, BOARD_ACTIONS } from "../Constants.js";

export const BoardContext = createContext({
  activeToolItem: "",
  handleToolItemChange: () => {},
});

function boardReducer(state, action) {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: {
      return { ...state, activeToolItem: action.payload };
    }
    default: {
      return state;
    }
  }
}

const initialBoardState = {
  activeToolItem: TOOLS.LINE,
};
function BoardContextProvider({ children }) {
  const [state, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState,
  );

  const handleToolItemChange = (toolItem) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: toolItem });
  };

  const contextValue = {
    activeToolItem: state.activeToolItem,
    handleToolItemChange,
  };
  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}
export { BoardContextProvider };
