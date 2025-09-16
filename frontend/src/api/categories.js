import axios from "./axios";

export const getCategoriesRequest = (page = 0, size = 10) =>
  axios.get("/api/categories", { params: { page, size } });

export const getCategoryRequest = (id) =>
  axios.get(`/api/categories/${id}`);