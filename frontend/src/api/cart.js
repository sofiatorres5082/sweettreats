import axios from "./axios"; 

export const getCartRequest = () => axios.get("/api/cart"); 
export const addCartItemRequest = (item) => axios.post("/api/cart", item); 
export const updateCartItemRequest = (item) => axios.put("/api/cart", item); 
export const removeCartItemRequest = (productId) => axios.delete(`/api/cart/${productId}`); 
export const clearCartRequest = () => axios.delete("/api/cart/clear");