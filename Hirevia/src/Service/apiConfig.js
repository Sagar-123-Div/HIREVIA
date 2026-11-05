const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultBaseURL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://hirevia-job-backend.onrender.com";

const API_BASE_URL = (configuredBaseURL || defaultBaseURL).replace(/\/+$/, "");

export default API_BASE_URL;
