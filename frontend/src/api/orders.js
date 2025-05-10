import axios from "./axios";

export const getAllOrdersRequest = () => axios.get("/api/orders");

export const createOrderRequest = (order) => axios.post("/api/orders", order);