import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/dashboard`;

export const getDashboardData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You are not logged in");
  }

  const { data } = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
