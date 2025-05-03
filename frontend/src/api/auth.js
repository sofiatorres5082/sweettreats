import axios from "./axios";

export const loginRequest = (user) => axios.post("/log-in", user);

export const registerRequest = (user) => axios.post("/sign-up", user);