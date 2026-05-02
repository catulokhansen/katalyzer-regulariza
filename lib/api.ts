import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_KR_API_URL ?? "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[KR api]", err?.response?.status, err?.message);
    }
    return Promise.reject(err);
  },
);
