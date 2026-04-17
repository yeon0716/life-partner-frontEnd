import api from "../axios";

// 레시피 등록
export const recipeAPI = {
  create: (data) => api.post("/api/recipes", data),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/api/recipes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

list: (page, size, keyword) =>
  api.get(`/api/recipes?page=${page}&size=${size}&keyword=${keyword}`),

  detail: (id) => api.get(`/api/recipes/${id}`),

  update: (id, data) => api.put(`/api/recipes/${id}`, data),

  delete: (id) => api.delete(`/api/recipes/${id}`)
};