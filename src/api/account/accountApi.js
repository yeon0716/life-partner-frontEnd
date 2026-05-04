import api from "../axios";

export const accountAPI = {

  // 📅 캘린더 데이터 (날짜별)
  getCalendar: (memberId, month) =>
    api.get(`/api/account/calendar`, {
      params: { memberId, month }
    }),

  // 💰 월 요약 (수입/지출)
  getSummary: (memberId, month) =>
    api.get(`/api/account/summary`, {
      params: { memberId, month }
    }),

  // 🥧 카테고리 비율
  getCategory: (memberId, month) =>
    api.get(`/api/account/category`, {
      params: { memberId, month }
    }),

  // 🔥 전월 비교 (핵심)
  getCompare: (memberId, month) =>
    api.get(`/api/account/compare`, {
      params: { memberId, month }
    }),

  // ➕ 등록
  insert: (data) =>
    api.post(`/api/account`, data),

  // ❌ 삭제
  delete: (accountId) =>
    api.delete(`/api/account/${accountId}`)
};