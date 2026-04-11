import React from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { BoardContextProvider } from "./store/BoardContext.jsx";
import { ToolboxContextProvider } from "./store/ToolboxContext.jsx";
import Canvas from "./components/Canvas/Canvas.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <BrowserRouter>
      <ToolboxContextProvider>
        <BoardContextProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/canvas/:id" element={<Canvas />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} />
        </BoardContextProvider>
      </ToolboxContextProvider>
    </BrowserRouter>
  );
};

export default App;
