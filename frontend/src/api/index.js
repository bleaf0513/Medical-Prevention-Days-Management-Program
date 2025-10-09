import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Request interceptor (attach token if available)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  // Auth / admin
  adminLogin: (payload) => api.post("/admin/login", payload),

  // Visitors
  registerVisitor: (payload) => api.post("/visitors/register", payload),
  getPrograms: () => api.get("/programs"),
  getDays: () => api.get("/days"),
  getAvailability: (dayId, typeId) =>
    api.get(`/availability?dayId=${dayId}&typeId=${typeId}`),
  createBooking: (payload) => api.post("/bookings", payload),

  // Admin endpoints
  getBookings: (params) => api.get("/admin/bookings", { params }),
  updateBooking: (id, payload) => api.put(`/admin/bookings/${id}`, payload),

  // notifications etc as needed
};
