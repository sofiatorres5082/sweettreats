import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, checkAuthRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const login = async (userData) => {
    try {
      await loginRequest(userData);
      const res = await checkAuthRequest();
      setUser(res.data);
      setIsAuth(true);
      return res;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setErrors(err.response?.data?.message || "Error de autenticación");
      setIsAuth(false);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerRequest(userData);
      return res;
    } catch (err) {
      setErrors(err.response?.data?.message || "Error al registrarse");
      throw err;
    }
  };

  const checkAuth = async () => {
    try {
      const res = await checkAuthRequest(); // usa axios conCredentials!
      setUser(res.data);
      setIsAuth(true);
    } catch (err) {
      setIsAuth(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      Cookies.remove("jwt");
      setUser(null);
      setIsAuth(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        errors,
        login,
        register,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
