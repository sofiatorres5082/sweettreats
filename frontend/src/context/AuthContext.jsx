import { createContext, useContext } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const loginRequest  = async (credentials) => {
    try {
      const res = await axios.post("/log-in", credentials);
      return { status: 200, data: res.data };
    } catch (err) {
      return { status: 401, response: err.response?.data || "Error" };
    }
  };

  return (
    <AuthContext.Provider value={{ loginRequest  }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
