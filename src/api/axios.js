import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// 🔐 요청 인터셉터 (토큰 자동 첨부)
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("accessToken");

  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

// 🔐 401 처리 (로그인 만료)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;