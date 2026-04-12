import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../Board/Board";
import Toolbar from "../Toolbar/Toolbar";
import Toolbox from "../Toolbox/Toolbox";
import Sidebar from "../Siderbar/Sidebar";
import { BoardContext } from "../../store/BoardContext";

function Dashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, authLoading } = useContext(BoardContext);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/");
    }
  }, [authLoading, isLoggedIn, navigate]);

  if (authLoading) return null;

  return (
    <>
      <Sidebar />
    </>
  );
}

export default Dashboard;
