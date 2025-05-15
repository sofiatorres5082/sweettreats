import axios from "./axios";

// Orders
export const getAllOrdersRequest = () => axios.get("/api/orders");
export const getOrderByIdRequest  = (id) => axios.get(`/api/orders/${id}`);

// Users 
export const getUsersRequest   = (page = 0, size = 10) =>
  axios.get("/api/users", { params: { page, size } });
export const getUserRequest    = (id) => axios.get(`/api/users/${id}`);
export const updateUserRequest = (id, data) => axios.put(`/api/users/${id}`, data);
export const deleteUserRequest = (id) => axios.delete(`/api/users/${id}`);


