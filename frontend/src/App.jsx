import React from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { BoardContextProvider } from "./store/BoardContext.jsx";
import { ToolboxContextProvider } from "./store/ToolboxContext.jsx";
const App = () => {
  return (
    <BrowserRouter>
      <ToolboxContextProvider>
        <BoardContextProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BoardContextProvider>
      </ToolboxContextProvider>
    </BrowserRouter>
  );
};

export default App;
