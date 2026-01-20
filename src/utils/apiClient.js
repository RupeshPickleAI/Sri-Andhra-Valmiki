// src/utils/apiClient.js
import axios from "axios";

const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Attach Bearer token automatically for ALL requests (except auth)
api.interceptors.request.use(
  (config) => {
    const url = String(config.url || "");
    const isAuthRoute = url.startsWith("/api/auth");

    const token = localStorage.getItem("token");

    // add token only if available and not auth endpoints
    if (!isAuthRoute && token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // ✅ If sending FormData, DO NOT force Content-Type (axios will set boundary)
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    config.headers = config.headers || {};

    if (isFormData) {
      // remove wrong content-type if someone set it earlier
      if (config.headers["Content-Type"]) delete config.headers["Content-Type"];
      if (config.headers["content-type"]) delete config.headers["content-type"];
    } else {
      // default JSON content-type
      if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// optional: if token expired, you can auto logout
api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    // if 401 -> you may clear token if you want
    // if (err?.response?.status === 401) localStorage.removeItem("token");
    return Promise.reject(err);
  }
);

export default api;
