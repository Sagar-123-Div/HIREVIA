export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function getRoleGroup(user = getStoredUser()) {
  const role = String(user?.role || user?.userType || user?.accountType || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (["recruiter", "employer", "company"].includes(role)) return "recruiter";
  if (["candidate", "jobseeker", "user", "applicant"].includes(role)) return "candidate";
  return "";
}
