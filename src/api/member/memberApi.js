import api from "../axios";

export const memberAPI = {
  sendEmail: (email) =>
    api.post(`/member/send-email?email=${email}`),

  verify: (email, code) =>
    api.post(`/member/verify?email=${email}&code=${code}`),

  signup: (data) =>
    api.post("/member/signup", data),

  login: (data) =>
    api.post("/member/login", data),

  me: (memberId) =>
    api.get(`/member/me?memberId=${memberId}`),

  update: (data) =>
    api.put("/member/update", data),

  delete: (memberId) =>
    api.delete(`/member/delete?memberId=${memberId}`)
};