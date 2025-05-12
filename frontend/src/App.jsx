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
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          classNames: {
            toast:
              "bg-[#67463B] text-[#FCF8EC] font-[Comic_Neue] font-semibold rounded-3xl shadow-lg px-6 py-4",
            title: "text-[#FCF8EC] font-bold text-base",
            description: "!text-[#FCF8EC] text-sm",
            closeButton: "text-[#FCF8EC] hover:text-pink-200",
          },
          style: {
            background: "#67463B",
            color: "#FCF8EC",
            borderRadius: "2rem",
            fontFamily: "Comic Neue, cursive",
            fontWeight: 600,
            border: "none",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.15)",
            padding: "1rem 1.5rem",
          },
          duration: 2500,
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicRoute />}>
          <Route path="/log-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/catalogo" element={<Catalog />} />
        </Route>

        <Route element={<ProtectedRoute roles={["USER"]} fallback="/log-in" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mis-pedidos" element={<MyOrders />} /> 
          <Route path="/perfil" element={<Profile />} /> 
        </Route>

        <Route
          element={<ProtectedRoute roles={["ADMIN"]} fallback="/not-found" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
