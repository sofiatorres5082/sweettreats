import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import Cookies from "js-cookie";
import { checkAuthRequest, loginRequest, registerRequest } from "@/api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    try {
      setError(null);
      const { data } = await registerRequest(userData);
  
      const formattedUser = {
        ...data,
        roles: data?.roles?.map((r) => r.roleEnum?.toUpperCase()) || [], 
      };
  
      setUser(formattedUser);
      setIsAuth(true);
      return formattedUser;
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
      setIsAuth(false);
      throw err;
    }
  };
  
  const login = async (userData) => {
    try {
      setError(null);
      const { data } = await loginRequest(userData);
  
      const user = await checkAuth();
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Error de autenticación");
      setIsAuth(false);
      throw err;
    }
  };


  const checkAuth = async () => {
    try {
      const { data } = await checkAuthRequest();
  
      const formattedUser = {
        ...data,
        roles: data.roles.map((r) => r.roleEnum.toUpperCase()),
      };
      
      setUser(formattedUser);
      setIsAuth(true);
      return formattedUser;
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 403 && status !== 401) {
        console.error("Error inesperado en checkAuth:", err);
      }
      Cookies.remove("jwt");
      setUser(null);
      setIsAuth(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/log-out");
      Cookies.remove("jwt");
      setUser(null);
      setIsAuth(false);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
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
        error,
        login,
        logout,
        checkAuth,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
