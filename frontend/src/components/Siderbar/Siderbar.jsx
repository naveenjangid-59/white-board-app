import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import api from "../../Api";
import { BoardContext } from "../../store/BoardContext";
import { toast } from "react-toastify";

function Siderbar() {
  const navigate = useNavigate();

  const {
    logoutHandler,
    setElementsHandler,
    changeCanvasIdHandler,
    profile,
    canvases,
    setCanvasesHandler,
  } = useContext(BoardContext);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // create ,delete , share
  const [inputValue, setInputValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCanvases = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await api.get("/canvases");
      setCanvasesHandler(res?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch canvases");
      setCanvasesHandler([]);
    } finally {
      setIsLoading(false);
    }
  }, [setCanvasesHandler]);

  useEffect(() => {
    fetchCanvases();
  }, []);

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

  // ================= HANDLERS =================

  const handleCreateCanvas = () => {
    setModalType("create");
    setInputValue("");
    setShowModal(true);
  };

  const handleDeleteCanvas = (canvasId) => {
    setModalType("delete");
    setSelectedId(canvasId);
    setShowModal(true);
  };

  const handleShareCanvas = (canvasId) => {
    setModalType("share");
    setSelectedId(canvasId);
    setInputValue("");
    setShowModal(true);
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

  // ================= CONFIRM LOGIC =================

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // CREATE
      if (modalType === "create") {
        if (!inputValue.trim()) return;

        const res = await api.post("/canvases/create-canvas", {
          name: inputValue.trim(),
        });
        if (!res?.data?.success) {
          toast.error("Failed to create canvas");
          return;
        }
        const id = res?.data?.data?._id;

        if (id) {
          changeCanvasIdHandler(id);
          setElementsHandler([]);
          navigate(`/canvas/${id}`);
          toast.success("Canvas created successfully");
        }

        // close modal
        setShowModal(false);
        setInputValue("");
      }

      // DELETE
      if (modalType === "delete") {
        const res = await api.delete(`/canvases/delete/${selectedId}`);
        const success = res?.data?.success;
        if (!success) {
          toast.error("Failed to delete canvas");
          return;
        }
        setCanvasesHandler(canvases.filter((c) => c._id !== selectedId));
        toast.success("Canvas deleted successfully");
        setShowModal(false);
        setSelectedId(null);
      }

      // SHARE
      if (modalType === "share") {
        if (!inputValue.trim()) return;
        console.log("Sharing canvas", selectedId, "with", inputValue.trim());
        const res = await api.put("/canvases/share", {
          canvasId: selectedId,
          email: inputValue.trim(),
        });
        console.log("Share response:", res);
        if (!res?.data?.success) {
          toast.error("Failed to share canvas");
          return;
        }

        // success message
        toast.success("Canvas shared successfully");

        setShowModal(false);
        setInputValue("");
        setSelectedId(null);
      }
    } catch (err) {
      toast.error(err?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Canvases</h1>
          <p className={styles.subtitle}>
            {`Heyy ${profile?.username || "there"} ! Manage, open, and continue your whiteboards.`}
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.logoutBtn}
            onClick={logoutHandler}
            disabled={isSubmitting}
          >
            Logout
          </button>

          <button
            className={styles.newBtn}
            onClick={handleCreateCanvas}
            disabled={isSubmitting}
          >
            + New Canvas
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
                          onClick={() => handleOpenCanvas(canvas.id)}
                          disabled={isSubmitting}
                        >
                          Open
                        </button>

                        {canvas.createdBy === profile?.username && (
                          <>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteCanvas(canvas.id)}
                              disabled={isSubmitting}
                            >
                              Delete
                            </button>
                            <button
                              className={styles.shareBtn}
                              onClick={() => handleShareCanvas(canvas.id)}
                              disabled={isSubmitting}
                            >
                              Share
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>
              {modalType === "create"
                ? "Create Canvas"
                : modalType === "delete"
                  ? "Delete Canvas"
                  : "Share Canvas"}
            </h3>

            {/* INPUT */}
            {(modalType === "create" || modalType === "share") && (
              <input
                type={modalType === "share" ? "email" : "text"}
                placeholder={
                  modalType === "share"
                    ? "Enter user email"
                    : "Enter canvas name"
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.input}
              />
            )}

            {/* DELETE TEXT */}
            {modalType === "delete" && (
              <p>Are you sure you want to delete this canvas?</p>
            )}

            {/* ERROR */}
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button onClick={handleConfirm} disabled={isSubmitting}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Siderbar;
