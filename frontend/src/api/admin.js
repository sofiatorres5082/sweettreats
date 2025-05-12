import axios from "./axios";

export const getAllOrdersRequest = () => axios.get("/api/orders");

export const getOrderByIdRequest  = (id) => axios.get(`/api/orders/${id}`);