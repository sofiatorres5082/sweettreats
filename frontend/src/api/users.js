import axios from "./axios";

export const getUsersRequest   = () => axios.get("/api/users");
export const getUserRequest    = (id) => axios.get(`/api/users/${id}`);
export const updateUserRequest = (id, data) => axios.put(`/api/users/${id}`, data);
export const deleteUserRequest = (id) => axios.delete(`/api/users/${id}`);
