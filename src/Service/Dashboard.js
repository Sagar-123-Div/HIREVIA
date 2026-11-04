import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

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
