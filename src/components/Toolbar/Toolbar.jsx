import React from "react";
import cx from "classnames";
import styles from "./Toolbar.module.css";
import { TOOLS } from "../../Constants";
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle, FaSlash, FaPen } from "react-icons/fa";
import { useContext } from "react";
import { BoardContext } from "@/store/BoardContext";
import { FaArrowRightLong } from "react-icons/fa6";

const Toolbar = () => {
  const { activeToolItem, handleToolItemChange } = useContext(BoardContext);
  return (
    <div className={styles.toolbarContainer}>
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
          [styles.active]: activeToolItem === TOOLS.RECTANGLE,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.RECTANGLE);
        }}
      >
        <RiRectangleLine />
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
          [styles.active]: activeToolItem === TOOLS.ARROW,
        })}
        onClick={() => {
          handleToolItemChange(TOOLS.ARROW);
        }}
      >
        <FaArrowRightLong />
      </div>
    </div>
  );
};

export default Toolbar;
