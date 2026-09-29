import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update port if needed

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const { token, user, message } = response.data;

    // Optional: store authentication details
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, message, token, user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

