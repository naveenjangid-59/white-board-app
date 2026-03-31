import { createContext, useReducer } from "react";
import { COLORS } from "@/Constants";
import { TOOLS, TOOLBOX_ACTIONS } from "@/Constants";

const ToolboxContext = createContext();

const initialToolboxState = {
  [TOOLS.PEN]: {
    stroke: COLORS.BLACK,
    size: 3,
  },
  [TOOLS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOLS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: "",
    size: 1,
  },
  [TOOLS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: "",
    size: 1,
  },
  [TOOLS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOLS.ERASER]: { size: 1 },
  [TOOLS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 16,
  },
};

function toolboxReducer(state, action) {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      const { tool, color } = action.payload;
      return {
        ...state,
        [tool]: {
          ...state[tool],
          stroke: COLORS[color],
        },
      };
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      const { tool, color } = action.payload;
      return {
        ...state,
        [tool]: {
          ...state[tool],
          fill: COLORS[color],
        },
      };
    }
    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      const { tool, newSize } = action.payload;
      return {
        ...state,
        [tool]: {
          ...state[tool],
          size: newSize,
        },
      };
    }
    default:
      return state;
  }
}

const ToolboxContextProvider = ({ children }) => {
  const [toolboxState, dispatchToolBoxAction] = useReducer(
    toolboxReducer,
    initialToolboxState,
  );

  const changeStrokeColorHandler = (activeToolItem, color) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: { tool: activeToolItem, color: color },
    });
  };

  const changeFillColorHandler = (activeToolItem, color) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: { tool: activeToolItem, color: color },
    });
  };

  const chageStrokeSizeHandler = (activeToolItem, newSize) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: { tool: activeToolItem, newSize: parseFloat(newSize) },
    });
  };

  const contextValue = {
    toolboxState,
    changeFillColorHandler,
    changeStrokeColorHandler,
    chageStrokeSizeHandler,
  };

  return (
    <ToolboxContext.Provider value={contextValue}>
      {children}
    </ToolboxContext.Provider>
  );
};

export { ToolboxContextProvider, ToolboxContext };
