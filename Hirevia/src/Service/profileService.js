import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/profile`;

const getToken = () => localStorage.getItem("token");

export const getMyProfile = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return {
      success: true,
      user: response.data.user,
      profileStrength: response.data.profileStrength,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Could not load profile",
    };
  }
};

export const updateMyProfile = async (updates) => {
  try {
    const response = await axios.patch(API_URL, updates, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return {
      success: true,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Could not update profile",
    };
  }
};