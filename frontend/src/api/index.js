import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (attach token if available)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token") || localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default {
  // User Auth
  register: (payload) => api.post("/register", payload),
  login: (payload) => api.post("/login", payload),

  // Appointments & Bookings
  getAppointments: () => api.get("/appointments"),
  getAvailableSlots: () => api.get("/appointments"),
  bookAppointment: (payload) => api.post("/book", payload),
  getMyBookings: () => api.get("/bookings"),
  getAppointmentTypes: () => api.get("/appointment-types"),

  // Admin Auth
  adminLogin: (payload) => api.post("/admin/login", payload),
  adminRegister: (payload) => api.post("/admin/register", payload),

  // Admin endpoints
  getAdminAppointmentTypes: () => api.get("/admin/appointment-types"),
  createAppointmentType: (payload) => api.post("/admin/appointment-types", payload),
  updateAppointmentType: (id, payload) => api.put(`/admin/appointment-types/${id}`, payload),
  deleteAppointmentType: (id) => api.delete(`/admin/appointment-types/${id}`),
  
  getAdministrators: () => api.get("/admin/list"),
  updateAdministrator: (id, payload) => api.put(`/admin/${id}`, payload),
  deleteAdministrator: (id) => api.delete(`/admin/${id}`),
  
  getSpecialistSpecialties: () => api.get("/admin/specialist-specialties"),
  getSpecialists: () => api.get("/admin/specialists"),
  createSpecialist: (payload) => api.post("/admin/specialists", payload),
  updateSpecialist: (id, payload) => api.put(`/admin/specialists/${id}`, payload),
  deleteSpecialist: (id) => api.delete(`/admin/specialists/${id}`),
  
  getSpecialistSlots: () => api.get("/admin/specialist-slots"),
  createSpecialistSlots: (payload) => api.post("/admin/specialist-slots", payload),
  updateSpecialistSlotAvailability: (id, payload) => api.put(`/admin/specialist-slots/${id}/availability`, payload),
  
  getAdminDays: () => api.get("/admin/days"),
  getAdminDay: (id) => api.get(`/admin/days/${id}`),
  createDay: (payload) => api.post("/admin/days", payload),
  updateDay: (id, payload) => api.put(`/admin/days/${id}`, payload),
  deleteDay: (id) => api.delete(`/admin/days/${id}`),
  generateSlots: (dayId) => api.post(`/admin/generate-slots/${dayId}`),
  getAdminBookings: (params) => api.get("/admin/bookings", { params }),
  markAttendance: (id, payload) => api.put(`/admin/bookings/${id}/attendance`, payload),
  cancelBooking: (id) => api.delete(`/admin/bookings/${id}`),
  getUsers: () => api.get("/admin/users"),
  getUser: (id) => api.get(`/admin/users/${id}`),
};
