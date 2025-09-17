import axios from "axios";

// dev uses localhost, prod uses the same origin via relative "/api"
const BASE_URL =
  (typeof window !== "undefined" && window.location.hostname === "localhost")
    ? "http://localhost:5001/api"
    : "/api";

const api = axios.create({ baseURL: BASE_URL });
export default api;
