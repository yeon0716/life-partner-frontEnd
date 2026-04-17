import api from "../axios";

export const memberAPI = {
  sendEmail: (email) =>
    api.post(`/api/member/send-email?email=${email}`),

  verify: (email, code) =>
    api.post(`/api/member/verify?email=${email}&code=${code}`),

  signup: (data) =>
    api.post("/api/member/signup", data),

  login: (data) =>
    api.post("/api/member/login", data),

  me: (memberId) =>
    api.get(`/api/member/me?memberId=${memberId}`),

  update: (data) =>
    api.put("/api/member/update", data),

  delete: (memberId) =>
    api.delete(`/api/member/delete?memberId=${memberId}`)
};