import axios from "./axios"; 

export const createPaymentIntent = (amount) =>
  axios.post("/api/payments/create-payment-intent", { amount });

export const getAllPaymentMethodsRequest = () =>
  axios.get("/api/payment-methods/all");