import React, { useContext } from "react";
import styles from "./Toolbox.module.css";
import { COLORS, TOOLS } from "@/Constants";
import cx from "classnames";
import { BoardContext } from "@/store/BoardContext";
import { ToolboxContext } from "@/store/ToolboxContext";
import { GiCrossMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FILL_ITEMS } from "@/Constants";

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  const {
    toolboxState,
    changeStrokeColorHandler,
    changeFillColorHandler,
    chageStrokeSizeHandler,
  } = useContext(ToolboxContext);
  return (
    activeToolItem !== TOOLS.ERASER && (
      <div className={styles.toolbox}>
        <div className={styles.section}>
          <div className={styles.title}>Stroke Color</div>
          <div className={styles.colorContainer}>
            <input
              type="color"
              id="favcolor"
              name="favcolor"
              className={cx(styles.colorBox, styles.activePreview)}
              // style={{
              //   backgroundColor: toolboxState[activeToolItem]?.stroke,
              // }}
              value={toolboxState[activeToolItem]?.stroke}
              onChange={(e) => {
                changeStrokeColorHandler(activeToolItem, e.target.value);
              }}
            />
            {Object.keys(COLORS).map((key) => {
              if (COLORS[key] === "") return;
              return (
                <div
                  key={key}
                  className={cx(styles.colorBox, {
                    [styles.active]:
                      COLORS[key] === toolboxState[activeToolItem]?.stroke,
                  })}
                  style={{ backgroundColor: COLORS[key] }}
                  onClick={() => {
                    changeStrokeColorHandler(activeToolItem, key);
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {FILL_ITEMS.includes(activeToolItem) && (
          <div className={styles.section}>
            <div className={styles.title}>Fill Color</div>
            <div className={styles.colorContainer}>
              {toolboxState[activeToolItem]?.fill === "" ? (
                <div
                  className={cx(styles.colorBox, styles.activePreview)}
                  style={{
                    backgroundColor: toolboxState[activeToolItem]?.fill,
                  }}
                  onClick={() =>
                    changeFillColorHandler(activeToolItem, "BLACK")
                  }
                >
                  <GiCrossMark />
                </div>
              ) : (
                <input
                  type="color"
                  id="favcolor"
                  name="favcolor"
                  className={cx(styles.colorBox, styles.activePreview)}
                  style={{
                    backgroundColor: toolboxState[activeToolItem]?.fill,
                  }}
                  value={toolboxState[activeToolItem]?.fill}
                  onChange={(e) => {
                    changeFillColorHandler(activeToolItem, e.target.value);
                  }}
                />
              )}

              {Object.keys(COLORS).map((key) => {
                const colorValue = COLORS[key];
                const isNone = colorValue === "";

                return (
                  <div
                    key={key}
                    className={cx(styles.colorBox, {
                      [styles.active]:
                        colorValue === toolboxState[activeToolItem]?.fill,
                    })}
                    style={{
                      backgroundColor: isNone ? "transparent" : colorValue,
                    }}
                    onClick={() => {
                      changeFillColorHandler(activeToolItem, isNone ? "" : key);
                    }}
                  >
                    {isNone && <GiCrossMark />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {
          <div className={styles.section}>
            <div className={styles.title}>
              Size : {toolboxState[activeToolItem]?.size}
            </div>
            <input
              type="range"
              min={`${activeToolItem === TOOLS.TEXT ? 12 : 1}`}
              max={`${activeToolItem === TOOLS.TEXT ? 32 : 5}`}
              step="0.1" //makes it smooth
              value={toolboxState[activeToolItem].size}
              onChange={(e) => {
                chageStrokeSizeHandler(activeToolItem, e.target.value);
              }}
              className={styles.slider}
            />
          </div>
        }
      </div>
    )
  );
};

export default Toolbox;
