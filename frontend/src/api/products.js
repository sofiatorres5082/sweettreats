import axios from "./axios";

export const getProductsRequest = () => axios.get("/api/products");