import axios from "./axios";

export const loginRequest = (user) => axios.post("/auth/log-in", user);

export const registerRequest = (user) => axios.post("/auth/sign-up", user);

export const checkAuthRequest = () => axios.get("/auth/me"); 

export const verifySessionRequest = () => axios.get("/auth/verify-session");
