import axios from "axios";

/**
 * Centralised axios instance.
 *
 * In development we use a relative `/api` baseURL because Vite proxies
 * `/api` requests to the FastAPI backend (see vite.config.ts).
 * In production, point VITE_API_URL at the deployed API.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: false,
  timeout: 60_000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface backend error messages cleanly
    const detail =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(detail));
  }
);

export default api;
