import { createContext, useReducer } from "react";
import { COLORS } from "@/Constants";
import { TOOLS, TOOLBOX_ACTIONS } from "@/Constants";

const ToolboxContext = createContext();

const initialToolboxState = {
  [TOOLS.PEN]: {
    stroke: COLORS.BLACK,
  },
  [TOOLS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOLS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOLS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOLS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  // [TOOLS.TEXT]: {
  //   stroke: COLORS.BLACK,
  //   size: 32,
  // },
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

  const contextValue = {
    toolboxState,
    changeFillColorHandler,
    changeStrokeColorHandler,
  };

  return (
    <ToolboxContext.Provider value={contextValue}>
      {children}
    </ToolboxContext.Provider>
  );
};

export { ToolboxContextProvider, ToolboxContext };
