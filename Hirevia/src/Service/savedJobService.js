import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/saved-jobs`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET /api/saved-jobs
export const getSavedJobs = async () => {
  try {
    const response = await axios.get(API_URL, authConfig());

    return {
      success: true,
      savedJobs: response.data.savedJobs || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Could not load saved jobs",
    };
  }
};

// POST /api/saved-jobs/:jobId
export const saveJob = async (jobId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${jobId}`,
      {},
      authConfig()
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Could not save job",
    };
  }
};

// DELETE /api/saved-jobs/:jobId
export const removeSavedJob = async (jobId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${jobId}`,
      authConfig()
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Could not remove saved job",
    };
  }
};