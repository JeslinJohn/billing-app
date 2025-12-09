import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

const getAuthToken = () => sessionStorage.getItem("authToken");

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      status: error?.response?.status || 0,
      message:
        error?.response?.data?.message || "An unexpected error occurred.",
      data: error?.response?.data || null
    };
    return Promise.reject(normalized);
  }
);

export default api;
