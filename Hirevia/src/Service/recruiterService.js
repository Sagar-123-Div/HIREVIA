import axios from "axios";
import API_BASE_URL from "./apiConfig";

const JOBS_URL = `${API_BASE_URL}/api/jobs`;
const APPLICATIONS_URL = `${API_BASE_URL}/api/applications/recruiter`;

function authConfig() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please sign in to access the recruiter dashboard.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

function getCollection(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  throw new Error(`Unexpected API response: expected an array in "${key}".`);
}

export async function getRecruiterJobs() {
  try {
    const { data } = await axios.get(JOBS_URL, authConfig());
    return getCollection(data, "jobs");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not load jobs."));
  }
}

export async function getRecruiterApplications() {
  try {
    const { data } = await axios.get(APPLICATIONS_URL, authConfig());
    return getCollection(data, "applications");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not load applications."));
  }
}

export async function createRecruiterJob(job) {
  try {
    const { data } = await axios.post(JOBS_URL, job, authConfig());
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not post this job."));
  }
}

export async function updateRecruiterJob(jobId, job) {
  try {
    const { data } = await axios.post(
      `${JOBS_URL}/${encodeURIComponent(jobId)}`,
      job,
      authConfig()
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not update this job."));
  }
}

export async function deleteRecruiterJob(jobId) {
  try {
    const { data } = await axios.delete(
      `${JOBS_URL}/${encodeURIComponent(jobId)}`,
      authConfig()
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not delete this job."));
  }
}

export async function updateRecruiterApplicationStatus(applicationId, status) {
  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/api/applications/${encodeURIComponent(applicationId)}/status`,
      { status },
      authConfig()
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not update this application."));
  }
}
