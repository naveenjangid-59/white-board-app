import React, { useContext } from "react";
import styles from "./Toolbox.module.css";
import { COLORS } from "@/Constants";
import cx from "classnames";
import { BoardContext } from "@/store/BoardContext";
import { ToolboxContext } from "@/store/ToolboxContext";

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  const { toolboxState, changeStrokeColorHandler, changeFillColorHandler } =
    useContext(ToolboxContext);
  return (
    <div className={styles.toolbox}>
      <div className={styles.section}>
        <div className={styles.title}>Stroke Color</div>
        <div className={styles.colorContainer}>
          {Object.keys(COLORS).map((key) => {
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

      <div className={styles.section}>
        <div className={styles.title}>Fill Color</div>
        <div className={styles.colorContainer}>
          {Object.keys(COLORS).map((key) => {
            return (
              <div
                key={key}
                className={cx(styles.colorBox, {
                  [styles.active]:
                    COLORS[key] === toolboxState[activeToolItem]?.fill,
                })}
                style={{ backgroundColor: COLORS[key] }}
                onClick={() => {
                  changeFillColorHandler(activeToolItem, key);
                }}
              ></div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Size</div>
        <input type="range" min={1} max={7} step={1} className="slider" />
      </div>
    </div>
  );
};

export default Toolbox;
