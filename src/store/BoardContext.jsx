import { createContext, useReducer } from "react";
import { TOOLS, BOARD_ACTIONS } from "../Constants.js";
import { getElement, getLastElement } from "@/utils/Element.js";
import { ToolboxContext } from "./ToolboxContext.jsx";
import { useContext } from "react";
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
      console.log("selected item : ", action.payload);
      return { ...state, activeToolItem: action.payload };
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      console.log("insider reducer");
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const id = state.elements.length;
      const x1 = clientX;
      const y1 = clientY;
      const x2 = clientX;
      const y2 = clientY;

      const newElement = getElement(id, x1, y1, x2, y2, {
        activeToolItem: state.activeToolItem,
        stroke,
        fill,
        size,
      });
      console.log("MOUSE_DOWN", newElement);
      return {
        ...state,
        isDown: true,
        elements: [...state.elements, newElement],
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      if (!state.isDown || state.elements.length === 0) return state;
      const { clientX, clientY } = action.payload;
      const elementsCopy = [...state.elements];
      const lastIndex = elementsCopy.length - 1;
      const lastEl = { ...elementsCopy[lastIndex] };
      const newLastEl = getLastElement(lastEl, clientX, clientY, {
        activeToolItem: state.activeToolItem,
      });

      elementsCopy[lastIndex] = newLastEl;
      console.log("MOUSE_MOVE", newLastEl);
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
  const { toolboxState } = useContext(ToolboxContext);
  const handleToolItemChange = (toolItem) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: toolItem });
  };

  const boardMouseDownHandler = (event) => {
    console.log(1);
    if (event.pointerType === "mouse" && event.buttons !== 1) return;
    console.log(2);
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
        stroke: toolboxState[state.activeToolItem].stroke,
        fill: toolboxState[state.activeToolItem].fill,
        size: toolboxState[state.activeToolItem].size,
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
