import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
})

/* =========================
   REQUEST
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* =========================
   REFRESH CONTROL
========================= */
let refreshPromise = null

api.interceptors.response.use(
  res => res,
  async err => {

    const originalRequest = err.config

    // 401만 처리
    if (err.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true

      try {

        // refresh 중복 방지
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/member/refresh`,
            {},
            { withCredentials: true }
          )
        }

        const res = await refreshPromise
        refreshPromise = null

        const newToken =
          res.data.accessToken ||
          res.data.token ||
          res.data.data?.accessToken

        localStorage.setItem("token", newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)

      } catch (e) {
        refreshPromise = null
        localStorage.clear()
        window.location.href = "/login"
      }
    }

    return Promise.reject(err)
  }
)

export default api