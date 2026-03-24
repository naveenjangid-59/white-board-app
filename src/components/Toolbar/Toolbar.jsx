import React from "react";
import cx from "classnames";
import styles from "./Toolbar.module.css";
import { TOOLS } from "../../Constants";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle, FaSlash, FaPen } from "react-icons/fa";
import { useContext } from "react";
import { BoardContext } from "@/store/boardContext";

const Toolbar = () => {
  const { activeToolItem, handleToolItemChange } = useContext(BoardContext);
  return (
    <div className={styles.toolbarContainer}>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeToolItem === TOOLS.RECTANGLE,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.RECTANGLE);
        }}
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeToolItem === TOOLS.CIRCLE,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.CIRCLE);
        }}
      >
        <FaRegCircle />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeToolItem === TOOLS.LINE,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.LINE);
        }}
      >
        <FaSlash />
      </div>
      <div
        className={cx(styles.toolItem, {
          [styles.active]: activeToolItem === TOOLS.PEN,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.PEN);
        }}
      >
        <FaPen />
      </div>
    </div>
  );
};

export default Toolbar;
