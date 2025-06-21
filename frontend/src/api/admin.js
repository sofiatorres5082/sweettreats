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

export const getProductsByStatusRequest = (status, page = 0, size = 10) =>
  axios.get("/api/products/status", { params: { status, page, size } });

export const reactivateProductRequest = (id) =>
  axios.put(`/api/products/${id}/activate`);


// Reports
export const salesRequest = (period) =>
  axios.get(`/api/reports/sales?period=${period}`);

export const salesTrendRequest = (period) =>
  axios.get(`/api/reports/sales-trend?period=${period}`);

export const ticketAverageRequest = (period) =>
  axios.get(`/api/reports/ticket-average?period=${period}`);

export const salesGrowthRequest = (period) =>
  axios.get(`/api/reports/sales-growth?period=${period}`);

export const topProductsRequest = () =>
  axios.get(`/api/reports/top-products`);

export const lowStockRequest = () =>
  axios.get(`/api/reports/low-stock`);

export const noSalesRequest = (sinceDays) =>
  axios.get(`/api/reports/no-sales?sinceDays=${sinceDays}`);
