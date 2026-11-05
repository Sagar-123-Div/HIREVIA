import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/applications`;

export const applyToJob = async (jobId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      message: "Please sign in before applying.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job: jobId }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Could not submit application.",
      };
    }

    return {
      success: true,
      message: data.message || "Application submitted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Could not submit application.",
    };
  }
};
