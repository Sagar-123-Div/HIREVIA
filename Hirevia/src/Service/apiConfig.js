const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://hirevia-job-backend.onrender.com"
).replace(/\/+$/, "");

export default API_BASE_URL;
