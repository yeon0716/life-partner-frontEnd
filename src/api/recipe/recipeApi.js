import api from "../axios";

// 레시피 등록
export const recipeAPI = {
  create: (data) => api.post("/api/recipes/edit", data),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/api/recipes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  list: (page, size, keyword, categoryId) =>
    api.get('/api/recipes', {
      params: {
        page,
        size,
        keyword,
        categoryId
      },
    }),

  getCategories: () =>
    api.get('/api/recipes/categories'), // 🔥 추가

  detail: (id) => api.get(`/api/recipes/${id}`),

  update: (id, data) => api.put(`/api/recipes/edit/${id}`, data),

  delete: (id) => api.delete(`/api/recipes/${id}`),

  bookmark: (id) => api.post(`/api/recipes/${id}/bookmark`),

  like: (id) => api.post(`/api/recipes/${id}/like`),
};