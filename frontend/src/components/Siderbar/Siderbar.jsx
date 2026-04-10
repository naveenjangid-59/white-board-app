import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import api from "../../Api";
import { BoardContext } from "../../store/BoardContext";
import { useCallback } from "react";
import { set } from "react-hook-form";
function Siderbar() {
  const navigate = useNavigate();
  const { logoutHandler, setElementsHandler, changeCanvasIdHandler, profile } =
    useContext(BoardContext);

  const [canvases, setCanvases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCanvases = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await api.get("/canvases");
      setCanvases(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch canvases");
      setCanvases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCanvases();
  }, [fetchCanvases]);

  const tableRows = useMemo(() => {
    return canvases.map((canvas) => ({
      id: canvas?._id,
      name: canvas?.name || "Untitled Canvas",
      createdBy:
        canvas?.owner?.username || canvas?.owner?.email || profile?.username,
      createdOn: canvas?.createdAt,
      updatedOn: canvas?.updatedAt,
    }));
  }, [canvases, profile?.username]);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateCanvas = async () => {
    const name = window.prompt("Enter canvas name");
    if (!name?.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");
      const res = await api.post("/canvases/create-canvas", {
        name: name.trim(),
      });

      const createdCanvasId = res?.data?.data?._id;
      if (createdCanvasId) {
        changeCanvasIdHandler(createdCanvasId);
        setElementsHandler([]);
        navigate(`/canvas/${createdCanvasId}`);
        return;
      }

      await fetchCanvases();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create canvas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCanvas = async (canvasId) => {
    try {
      setIsSubmitting(true);
      setError("");

      const res = await api.get(`/canvases/load/${canvasId}`);
      const canvasData = res?.data?.data;
      changeCanvasIdHandler(canvasId);
      setElementsHandler(canvasData?.elements || []);

      navigate(`/canvas/${canvasId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to open canvas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCanvas = async (canvasId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this canvas?",
    );
    if (!isConfirmed) return;

    try {
      setIsSubmitting(true);
      setError("");
      await api.delete(`/canvases/delete/${canvasId}`);
      setCanvases((prev) => prev.filter((canvas) => canvas?._id !== canvasId));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete canvas");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setElementsHandler([]);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Canvases</h1>
          <p className={styles.subtitle}>
            Manage, open, and continue your whiteboards.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.logoutBtn}
            type="button"
            onClick={logoutHandler}
            disabled={isSubmitting}
          >
            Logout
          </button>
          <button
            className={styles.newBtn}
            type="button"
            onClick={handleCreateCanvas}
            disabled={isSubmitting}
          >
            New Canvas
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {isLoading ? (
          <div className={styles.empty}>Loading canvases...</div>
        ) : tableRows.length === 0 ? (
          <div className={styles.empty}>
            No canvases found. Create one to start.
          </div>
        ) : (
          <div className={styles.tableWrap}>
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
                {tableRows.map((canvas) => (
                  <tr key={canvas.id}>
                    <td className={styles.name}>{canvas.name}</td>
                    <td>{canvas.createdBy || "—"}</td>
                    <td>{formatDate(canvas.createdOn)}</td>
                    <td>{formatDate(canvas.updatedOn)}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.openBtn}
                          type="button"
                          onClick={() => handleOpenCanvas(canvas.id)}
                          disabled={isSubmitting}
                        >
                          Open
                        </button>
                        <button
                          className={styles.deleteBtn}
                          type="button"
                          onClick={() => handleDeleteCanvas(canvas.id)}
                          disabled={isSubmitting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Siderbar;
