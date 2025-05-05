import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setError(null);
      const { data } = await axios.post("/log-in", credentials);
  
      if (data.token) {
        Cookies.set("jwt", data.token, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });
      }
  
      const user = await checkAuth(); // retorna formattedUser
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Error de autenticación");
      setIsAuth(false);
      throw err;
    }
  };


  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/me");
  
      const formattedUser = {
        ...data,
        roles: data.roles.map((r) => r.roleEnum.toUpperCase()),
      };
      
      setUser(formattedUser);
      setIsAuth(true);
      return formattedUser;
    } catch (err) {
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
    const verifyToken = async () => {
      const token = Cookies.get("jwt");
      if (!token) {
        setLoading(false);
        return;
      }
      await checkAuth();
    };
    verifyToken();
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
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
