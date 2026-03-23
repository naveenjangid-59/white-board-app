import React from "react";
import cx from "classnames";
import styles from "./Toolbar.module.css";
import { TOOLS } from "../../Constants";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle, FaSlash, FaPen } from "react-icons/fa";

const Toolbar = () => {
  const [activeTool, setActiveTool] = React.useState(TOOLS.RECTANGLE);
  return (
    <div className={styles.toolbarContainer}>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeTool === TOOLS.RECTANGLE,
        })}
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeTool === TOOLS.CIRCLE,
        })}
      >
        <FaRegCircle />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeTool === TOOLS.LINE,
        })}
      >
        <FaSlash />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeTool === TOOLS.PEN,
        })}
      >
        <FaPen />
      </div>
    </div>
  );
};

export default Toolbar;
