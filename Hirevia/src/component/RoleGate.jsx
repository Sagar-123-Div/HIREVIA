import { Navigate } from "react-router-dom";
import { getRoleGroup } from "../utils/authRole";

export default function RoleGate({ audience, children }) {
  const token = localStorage.getItem("token");
  const role = getRoleGroup();

  if (token && role && role !== audience) {
    return (
      <Navigate
        to={role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  if (token && !role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d1a] px-5 text-center text-slate-100">
        <p role="alert">
          Your account type could not be verified. Sign out and sign in again after your account role is configured.
        </p>
      </main>
    );
  }

  return children;
}
