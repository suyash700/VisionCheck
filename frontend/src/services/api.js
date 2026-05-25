import axios from "axios";
import { getAdminToken } from "../utils/adminAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const saveResults = async (payload) => {
  const response = await api.post("/save-results", payload);
  return response.data;
};

export const fetchResults = async (params = {}) => {
  const response = await api.get("/results", { params });
  return response.data;
};

export const fetchDashboardStats = async (params = {}) => {
  const response = await api.get("/dashboard/stats", { params });
  return response.data;
};

export const loginAdmin = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  return response.data;
};

export const fetchAdminDashboard = async (params = {}) => {
  const response = await api.get("/admin/dashboard", { params });
  return response.data;
};

export const fetchAdminResponses = async (params = {}) => {
  const response = await api.get("/admin/responses", { params });
  return response.data;
};

export const fetchAdminStatistics = async (params = {}) => {
  const response = await api.get("/admin/statistics", { params });
  return response.data;
};

export const exportAdminCsv = async (params = {}) => {
  const response = await api.get("/admin/export", {
    params,
    responseType: "blob"
  });
  return response.data;
};

export default api;
