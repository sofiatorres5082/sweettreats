import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
