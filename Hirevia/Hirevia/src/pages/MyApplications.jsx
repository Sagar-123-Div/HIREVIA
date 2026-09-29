import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Heart,
  User,
  Settings,
  Bell,
  MapPin,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/applications";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, path: "/find-job" },
  { name: "My Applications", icon: FileText, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, path: "/saved-jobs" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function getToken() {
  // Use the storage key your login code uses.
  return localStorage.getItem("token");
}

function getStatusStyle(status = "pending") {
  const normalized = status.toLowerCase();

  if (normalized === "accepted") {
    return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }
  if (normalized === "rejected") {
    return "border border-rose-500/30 bg-rose-500/10 text-rose-400";
  }
  return "border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]";
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [applicationSummary, setApplicationSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [jobId, setJobId] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function fetchApplications() {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Please sign in to view your applications.");
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not load applications.");
      }

      const applicationList = Array.isArray(data) ? data : data.applications;
      if (!Array.isArray(applicationList)) {
        const hasSummary = ["total", "pending", "accepted", "rejected"].every(
          (key) => typeof data?.[key] === "number"
        );
        if (hasSummary) {
          setApplications([]);
          setApplicationSummary(data);
          return;
        }
        throw new Error("The applications response was not in the expected format.");
      }

      setApplications(applicationList);
      setApplicationSummary(null);
    } catch (err) {
      setError(err.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function handleApply(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Please sign in before applying.");
      }
      if (!jobId.trim() || !resume.trim()) {
        throw new Error("Enter both a job ID and a resume link.");
      }

      setSubmitting(true);
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job: jobId.trim(),
          resume: resume.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not submit application.");
      }

      setNotice(data.message || "Application submitted successfully.");
      setJobId("");
      setResume("");
      await fetchApplications();
    } catch (err) {
      setError(err.message || "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const status = application.status || "pending";
      const job = application.job || {};
      const matchesStatus =
        filterStatus === "All" ||
        status.toLowerCase().includes(filterStatus.toLowerCase());
      const query = searchText.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${job.title || ""} ${job.location || ""} ${job.jobType || ""}`
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applications, filterStatus, searchText]);

  const totalCount = applicationSummary?.total ?? applications.length;
  const pendingCount = applicationSummary?.pending ?? applications.filter(
    (app) => (app.status || "pending").toLowerCase() === "pending"
  ).length;
  const acceptedCount = applicationSummary?.accepted ?? applications.filter(
    (app) => (app.status || "").toLowerCase() === "accepted"
  ).length;
  const rejectedCount = applicationSummary?.rejected ?? applications.filter(
    (app) => (app.status || "").toLowerCase() === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">
          <div className="mb-10 px-4">
            <h1 className="text-[26px] font-black tracking-tight text-[#00e5ff]">
              HIREVIA
            </h1>
            <p className="mt-1 text-xs text-slate-400">Find Your Dream Job</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.name === "My Applications";

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex h-12 items-center gap-4 rounded-xl px-4 text-left text-sm ${
                    active
                      ? "border border-cyan-500/20 bg-cyan-500/10 text-[#00e5ff]"
                      : "text-slate-400 hover:bg-[#131f37] hover:text-slate-200"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">My Applications</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e5ff]">
                {totalCount} Total
              </span>
            </div>
            <Bell size={19} className="text-slate-300" />
          </header>

          <section className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Total Applied", totalCount, "text-white"],
                ["Pending", pendingCount, "text-[#00e5ff]"],
                ["Accepted", acceptedCount, "text-emerald-400"],
                ["Rejected", rejectedCount, "text-rose-400"],
              ].map(([label, count, color]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5"
                >
                  <p className="text-xs text-slate-400">{label}</p>
                  <h3 className={`mt-2 text-2xl font-bold ${color}`}>{count}</h3>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleApply}
              className="mb-8 grid gap-3 rounded-2xl border border-[#162238] bg-[#0c1424] p-5 md:grid-cols-[1fr_1fr_auto]"
            >
              <input
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
                placeholder="Job ID from GET /api/jobs"
                className="h-11 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-white outline-none"
              />
              <input
                value={resume}
                onChange={(event) => setResume(event.target.value)}
                placeholder="Resume URL"
                type="url"
                className="h-11 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-white outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-xl bg-[#00e5ff] px-5 text-sm font-bold text-[#080d1a] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Apply"}
              </button>
            </form>

            {notice && (
              <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                {notice}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#162238] pb-4">
              <div className="flex flex-wrap gap-2">
                {["All", "pending", "accepted", "rejected"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold ${
                      filterStatus === status
                        ? "border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]"
                        : "text-slate-400 hover:bg-[#0c1424]"
                    }`}
                  >
                    {status === "All"
                      ? status
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex h-10 items-center gap-2 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-3">
                <Search size={15} className="text-slate-400" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Filter by role or location"
                  className="w-52 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {loading && <p className="text-slate-300">Loading applications…</p>}

            {!loading && !error && filteredApplications.length === 0 && (
              <p className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 text-slate-400">
                {totalCount > 0
                  ? "Application totals are available, but the API did not return application details to display."
                  : "No applications found."}
              </p>
            )}

            <div className="space-y-4">
              {!loading &&
                filteredApplications.map((application) => {
                  const job = application.job || {};
                  const status = application.status || "pending";

                  return (
                    <article
                      key={application._id}
                      className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {job.title || "Job details unavailable"}
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin size={13} /> {job.location || "Location not specified"}
                            </span>
                            <span>{job.jobType || "Job type not specified"}</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={13} />
                              Applied{" "}
                              {application.createdAt
                                ? new Date(application.createdAt).toLocaleDateString()
                                : "date unavailable"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={`rounded-md px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Open submitted resume"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2f4e] bg-[#090f1d] text-slate-400 hover:text-[#00e5ff]"
                            >
                              <ArrowUpRight size={17} />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}