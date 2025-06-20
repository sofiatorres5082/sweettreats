import axios from "./axios";

export const createOrderRequest = (order) => axios.post("/api/orders", order);

export const getUserOrdersRequest = () => axios.get("/api/orders");

export const cancelOrderRequest = (orderId) =>
  axios.put(`/api/orders/${orderId}/cancel`);

export const getOrderDetailRequest = (orderId) =>
  axios.get(`/api/orders/${orderId}`);