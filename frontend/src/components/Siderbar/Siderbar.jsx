import { useState } from "react";
import styles from "./Sidebar.module.css";
import { useContext } from "react";
import { BoardContext } from "../../store/BoardContext";
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { profile } = useContext(BoardContext);
  console.log(profile);
  let name = profile?.username;
  //correct this
  name = name ? name[0].toUpperCase() + name.slice(1) : "User";

  return (
    <>
      <button className={styles.openBtn} onClick={() => setOpen(true)}>
        Menu
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      <div className={`${styles.sidebar} ${open ? styles.show : ""}`}>
        <div className={styles.header}>
          <h2>{"Hello, " + name}</h2>
          <button className={styles.close} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        <div className={styles.content}>
          <input placeholder="Username" />
          <input placeholder="Email" type="email" />
        </div>

        <div className={styles.footer}>
          <button className={styles.save}>Save changes</button>
        </div>
      </div>
    </>
  );
}
