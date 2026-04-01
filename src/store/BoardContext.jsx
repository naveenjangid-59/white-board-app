import { createContext, useReducer } from "react";
import { TOOLS, BOARD_ACTIONS, BOARD_ACTION_TYPE } from "../Constants.js";
import { getElement, getLastElement } from "@/utils/Element.js";
import { ToolboxContext } from "./ToolboxContext.jsx";
import { useContext } from "react";
import { isPointNearElement } from "@/utils/Math.js";
import rough from "roughjs";

const generator = rough.generator();

export const BoardContext = createContext({
  activeToolItem: "",
  elements: [],
  handleToolItemChange: () => {},
  boardMouseDownHandler: () => {},
  boardMouseUpHandler: () => {},
  boardMouseMoveHandler: () => {},
  textAreaBlurHandler: () => {},
  boardActionType: "",
  history: [[]],
  index: 0,
  boardUndoHandler: () => {},
  boardRedoHandler: () => {},
  boardMouseDownHandler: () => {},
});

function boardReducer(state, action) {
  switch (action.type) {
    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state;
      const newIndex = state.index - 1;
      return {
        ...state,
        elements: state.history[newIndex],
        index: newIndex,
      };
    }
    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;
      const newIndex = state.index + 1;
      return {
        ...state,
        elements: state.history[newIndex],
        index: newIndex,
      };
    }
    case BOARD_ACTIONS.HISTORY_PUSH: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(elementsCopy);
      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const elementsCopy = [...state.elements];
      const lastIndex = elementsCopy.length - 1;
      const lastEl = { ...elementsCopy[lastIndex] };
      lastEl.text = action.payload.text;
      elementsCopy[lastIndex] = lastEl;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(elementsCopy);
      return {
        ...state,
        elements: elementsCopy,
        history: newHistory,
        index: state.index + 1,
        boardActionType: BOARD_ACTION_TYPE.NONE,
      };
    }
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let elementsCopy = [...state.elements];
      elementsCopy = elementsCopy.filter((element) => {
        return !isPointNearElement(element, clientX, clientY);
      });
      return {
        ...state,
        boardActionType: BOARD_ACTION_TYPE.ERASING,
        elements: elementsCopy,
      };
    }
    case BOARD_ACTIONS.CHANGE_TOOL: {
      console.log("selected item : ", action.payload);
      return { ...state, activeToolItem: action.payload };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      const { actionType } = action.payload;
      return { ...state, boardActionType: actionType };
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      // console.log("insider reducer");
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
      // console.log("MOUSE_DOWN", newElement);
      return {
        ...state,
        boardActionType:
          state.activeToolItem === TOOLS.TEXT
            ? BOARD_ACTION_TYPE.WRITING
            : BOARD_ACTION_TYPE.DRAWING,
        elements: [...state.elements, newElement],
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      if (
        state.boardActionType === BOARD_ACTION_TYPE.NONE ||
        state.elements.length === 0
      )
        return state;
      const { clientX, clientY } = action.payload;
      const elementsCopy = [...state.elements];
      const lastIndex = elementsCopy.length - 1;
      const lastEl = { ...elementsCopy[lastIndex] };
      const newLastEl = getLastElement(lastEl, clientX, clientY, {
        activeToolItem: state.activeToolItem,
      });

      elementsCopy[lastIndex] = newLastEl;
      // console.log("MOUSE_MOVE", newLastEl);
      return { ...state, elements: elementsCopy };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      return { ...state, boardActionType: BOARD_ACTION_TYPE.NONE };
    }
    case BOARD_ACTIONS.DOWNLOAD: {
      const canvas = document.getElementById("canvas");
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportCtx = exportCanvas.getContext("2d");
      const bg = getComputedStyle(canvas).backgroundColor || "#ffffff";
      exportCtx.fillStyle = bg;
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      exportCtx.drawImage(canvas, 0, 0);

      const data = exportCanvas.toDataURL("image/png");
      const anchor = document.createElement("a");
      anchor.href = data;
      anchor.download = `whiteboard-${Date.now()}.png`;
      anchor.click();
    }
    default: {
      return state;
    }
  }
}

const initialBoardState = {
  activeToolItem: TOOLS.PEN,
  elements: [],
  history: [[]],
  index: 0,
  boardActionType: BOARD_ACTION_TYPE.NONE,
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

  const textAreaBlurHandler = (text) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: { text: text },
    });
  };

  const boardMouseDownHandler = (event) => {
    if (state.boardActionType === BOARD_ACTION_TYPE.WRITING) return;
    if (event.pointerType === "mouse" && event.buttons !== 1) return;

    if (state.activeToolItem === TOOLS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: { actionType: BOARD_ACTION_TYPE.ERASING },
      });
      return;
    }

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
    if (state.boardActionType === BOARD_ACTION_TYPE.WRITING) return;
    if (
      state.boardActionType === BOARD_ACTION_TYPE.DRAWING ||
      state.boardActionType === BOARD_ACTION_TYPE.ERASING ||
      state.elements.length !== 0
    ) {
      if (state.boardActionType === BOARD_ACTION_TYPE.ERASING) {
        const { clientX, clientY } = event;
        dispatchBoardAction({
          type: BOARD_ACTIONS.ERASE,
          payload: { clientX, clientY },
        });
      } else if (state.boardActionType === BOARD_ACTION_TYPE.DRAWING) {
        dispatchBoardAction({
          type: BOARD_ACTIONS.DRAW_MOVE,
          payload: {
            clientX: event.clientX,
            clientY: event.clientY,
          },
        });
      }
    }
  };

  const boardMouseUpHandler = (event) => {
    if (state.boardActionType === BOARD_ACTION_TYPE.WRITING) return;
    if (state.boardActionType === BOARD_ACTION_TYPE.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.HISTORY_PUSH,
      });
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
  };

  const boardUndoHandler = () => {
    dispatchBoardAction({ type: BOARD_ACTIONS.UNDO });
  };

  const boardRedoHandler = () => {
    dispatchBoardAction({ type: BOARD_ACTIONS.REDO });
  };

  const boardDownloadHandler = () => {
    dispatchBoardAction({ type: BOARD_ACTIONS.DOWNLOAD });
  };

  const contextValue = {
    activeToolItem: state.activeToolItem,
    elements: state.elements,
    boardActionType: state.boardActionType,
    handleToolItemChange,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    boardUndoHandler,
    boardRedoHandler,
    boardDownloadHandler,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}
export { BoardContextProvider };
