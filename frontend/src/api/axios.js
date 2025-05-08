import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response?.data?.message || "Error de conexión"
    );
  }
);

export default instance;