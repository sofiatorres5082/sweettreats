import axios from "./axios";

export const createOrderRequest = (order) => axios.post("/api/orders", order);

export const getUserOrdersRequest = () => axios.get("/api/orders");

