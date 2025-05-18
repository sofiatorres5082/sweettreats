import axios from "./axios";

// Orders
export const getAllOrdersRequest = (page = 0, size = 10) =>
  axios.get("/api/orders/admin/all", { params: { page, size } });
export const updateOrderStatusRequest = (id, body) =>
  axios.put(`/api/orders/admin/${id}`, body);
export const getOrderAdminByIdRequest = (id) =>
  axios.get(`/api/orders/admin/${id}`);

// Users
export const getUsersRequest = (page = 0, size = 10) =>
  axios.get("/api/users", { params: { page, size } });
export const getUserRequest = (id) => axios.get(`/api/users/${id}`);
export const updateUserRequest = (id, data) =>
  axios.put(`/api/users/${id}`, data);
export const deleteUserRequest = (id) => axios.delete(`/api/users/${id}`);

// Products
export const getProductsRequest = (page = 0, size = 10) =>
  axios.get("/api/products", { params: { page, size } });
export const getProductRequest = (id) => axios.get(`/api/products/${id}`);
export function createProductRequest(formData) {
  return axios.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateProductRequest(id, formData) {
  return axios.put(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const deleteProductRequest = (id) => axios.delete(`/api/products/${id}`);
