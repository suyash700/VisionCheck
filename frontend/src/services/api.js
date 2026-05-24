import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const saveResults = async (payload) => {
  const response = await api.post("/save-results", payload);
  return response.data;
};

export const fetchResults = async () => {
  const response = await api.get("/results");
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export default api;
