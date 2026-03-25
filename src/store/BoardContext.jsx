import { createContext, useReducer } from "react";
import { TOOLS, BOARD_ACTIONS } from "../Constants.js";
import rough from "roughjs";
const generator = rough.generator();
export const BoardContext = createContext({
  activeToolItem: "",
  elements: [],
  handleToolItemChange: () => {},
  boardMouseDownHandler: () => {},
  boardMouseUpHandler: () => {},
  boardMouseMoveHandler: () => {},
});

function boardReducer(state, action) {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: {
      return { ...state, activeToolItem: action.payload };
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      const { clientX, clientY } = action.payload;
      const newElement = {
        id: state.elements.length,
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        roughElement: generator.line(clientX, clientY, clientX, clientY),
      };
      console.log("MOUSE_DOWN", newElement);
      return {
        ...state,
        isDown: true,
        elements: [...state.elements, newElement],
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const elementsCopy = [...state.elements];
      const lastIndex = elementsCopy.length - 1;
      const lastEl = { ...elementsCopy[lastIndex] };
      lastEl.x2 = clientX;
      lastEl.y2 = clientY;
      lastEl.roughElement = generator.line(
        lastEl.x1,
        lastEl.y1,
        lastEl.x2,
        lastEl.y2,
      );
      elementsCopy[lastIndex] = lastEl;
      console.log("MOUSE_MOVE", lastEl);
      return { ...state, elements: elementsCopy };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      return { ...state, isDown: false };
    }
    default: {
      return state;
    }
  }
}

const initialBoardState = {
  activeToolItem: TOOLS.LINE,
  elements: [],
  isDown: false,
};
function BoardContextProvider({ children }) {
  const [state, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState,
  );

  const handleToolItemChange = (toolItem) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: toolItem });
  };

  const boardMouseDownHandler = (event) => {
    if (event.pointerType === "mouse" && event.buttons !== 1) return;

    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    if (!state.isDown) return state;
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_MOVE,
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
      },
    });
  };

  const boardMouseUpHandler = (event) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
  };

  const contextValue = {
    activeToolItem: state.activeToolItem,
    elements: state.elements,
    handleToolItemChange,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
  };
  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}
export { BoardContextProvider };
