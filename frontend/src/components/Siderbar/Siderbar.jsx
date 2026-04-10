import styles from "./Sidebar.module.css";
import { use, useContext, useEffect } from "react";
import { BoardContext } from "../../store/BoardContext";
import { useNavigate } from "react-router-dom";
import api from "../../Api.js";
import { set } from "react-hook-form";

export default function Sidebar() {
  const {
    canvases,
    profile,
    logoutHandler,
    setElementsHandler,
    changeCanvasIdHandler,
    canvasId,
  } = useContext(BoardContext);
  const navigate = useNavigate();

  useEffect(() => {
    setElementsHandler([]);
    changeCanvasIdHandler(null);
  }, []);

  const openCanvasHandler = async (id) => {
    try {
      // load canvas
      let canvas = await api.get(`/canvases/load/${id}`);
      canvas = canvas.data.data;

      // set elements
      setElementsHandler(canvas.elements);

      // change canvas id
      changeCanvasIdHandler(id);
      // navigate to board
      navigate(`/canvas/${id}`);
    } catch (error) {
      console.error("Error loading canvas:", error);
      setElementsHandler([]);

      // change canvas id
      changeCanvasIdHandler(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Your Canvases</h1>
        <div className={styles.buttonContainer}>
          <button className={styles.createBtn}>+ New Canvas</button>
          <button className={styles.logoutBtn} onClick={logoutHandler}>
            Log Out
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Updated On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(canvases) && canvases.length > 0 ? (
              canvases.map((canvas) => (
                <tr key={canvas._id}>
                  <td className={styles.name}>{canvas.name}</td>

                  <td>
                    {canvas.owner?.username || profile?.username || "You"}
                  </td>

                  <td>{new Date(canvas.createdAt).toLocaleDateString()}</td>

                  <td>{new Date(canvas.updatedAt).toLocaleDateString()}</td>

                  <td className={styles.buttonContainer}>
                    <button
                      className={styles.openBtn}
                      onClick={() => {
                        openCanvasHandler(canvas._id);
                      }}
                    >
                      Open
                    </button>
                    <button className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.empty}>
                  No canvases available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
