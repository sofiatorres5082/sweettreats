import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicRoute />}>
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute roles={["USER"]} fallback="/log-in" />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route
          element={<ProtectedRoute roles={["ADMIN"]} fallback="/not-found" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
