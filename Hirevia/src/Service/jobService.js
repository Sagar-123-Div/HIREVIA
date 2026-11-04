import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

export const getAllJobs = async (keyword = "") => {
  try {
    const response = await axios.get(API_URL, {
      params: keyword ? { keyword } : {},
    });

    return {
      success: true,
      jobs: response.data.jobs || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Could not load jobs",
      jobs: [],
    };
  }
};