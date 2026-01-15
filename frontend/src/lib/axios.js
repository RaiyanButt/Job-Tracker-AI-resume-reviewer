import axios from "axios";

const BASE_URL =
  (typeof window !== "undefined" && window.location.hostname === "localhost")
    ? "http://localhost:5001/api"
    : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;


