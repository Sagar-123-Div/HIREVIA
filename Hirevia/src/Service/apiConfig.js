const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://hirevia-backend-2.onrender.com"
).replace(/\/+$/, "");

export default API_BASE_URL;
