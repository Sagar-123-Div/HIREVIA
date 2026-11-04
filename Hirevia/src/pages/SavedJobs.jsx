import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Heart,
  User,
  Bell,
  MapPin,
  IndianRupee,
  Clock,
  Trash2,
  Bookmark,
} from "lucide-react";
import {
  getSavedJobs,
  removeSavedJob,
} from "../Service/savedJobService";
import { formatSalary } from "../utils/formatSalary";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, path: "/find-job" },
  { name: "My Applications", icon: FileText, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, path: "/saved-jobs" },
  { name: "Profile", icon: User, path: "/profile" },
];

function getInitial(title = "") {
  return title.trim().charAt(0).toUpperCase() || "J";
}

function formatDate(date) {
  if (!date) return "Saved recently";

  return `Saved ${new Date(date).toLocaleDateString()}`;
}

export default function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    loadSavedJobs();
  }, []);

  async function loadSavedJobs() {
    setLoading(true);

    const result = await getSavedJobs();

    if (result.success) {
      setSavedJobs(result.savedJobs);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  }

  async function handleRemove(jobId) {
    setRemovingId(jobId);
    setMessage("");

    const result = await removeSavedJob(jobId);

    if (result.success) {
      setSavedJobs((currentJobs) =>
        currentJobs.filter((item) => item.job._id !== jobId)
      );
    } else {
      setMessage(result.message);
    }

    setRemovingId("");
  }

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">
          <div className="mb-10 px-4">
            <h1 className="text-[26px] font-black tracking-tight text-[#00e5ff]">
              HIREVIA
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Find Your Dream Job
            </p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.name === "Saved Jobs";

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`group flex h-12 items-center gap-4 rounded-xl px-4 text-left text-[15px] font-medium ${
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
              <h2 className="text-xl font-bold text-white">Saved Jobs</h2>

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e5ff]">
                {savedJobs.length} Bookmarked
              </span>
            </div>

            <div className="flex items-center gap-5">
              <Bell size={19} className="text-slate-300" />

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-[#00e5ff]"
              >
                Profile
              </button>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            {message && (
              <p className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {message}
              </p>
            )}

            {loading && (
              <p className="text-slate-300">Loading saved jobs...</p>
            )}

            {!loading && savedJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e2f4e] bg-[#0c1424]/50 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]">
                  <Bookmark size={28} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-white">
                  No saved jobs yet
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Go to Find Jobs and click the bookmark icon to save a job.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/find-job")}
                  className="mt-5 rounded-lg bg-[#00e5ff] px-5 py-2 text-sm font-bold text-[#080d1a]"
                >
                  Find Jobs
                </button>
              </div>
            )}

            {!loading && savedJobs.length > 0 && (
              <div className="space-y-4">
                {savedJobs.map((item) => {
                  const job = item.job;
                  const company = job.postedBy?.name || "Hirevia Recruiter";

                  return (
                    <article
                      key={job._id}
                      className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 transition hover:border-[#1e2f4e] hover:bg-[#101b30]"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-base font-bold text-[#00e5ff]">
                            {getInitial(job.title)}
                          </div>

                          <div>
                            <h3 className="text-base font-semibold text-white">
                              {job.title}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                              <span className="font-medium text-slate-300">
                                {company}
                              </span>

                              <span className="mx-2 text-slate-600">•</span>

                              <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {job.location || "Location not specified"}
                              </span>

                              <span className="mx-2 text-slate-600">•</span>

                              <span className="flex items-center gap-1">
                                <IndianRupee size={13} />
                                {formatSalary(job.salary)}
                              </span>
                            </div>

                            {job.description && (
                              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                                {job.description}
                              </p>
                            )}

                            <div className="mt-4">
                              <span className="rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                                {job.jobType || "Job"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-[#162238] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleRemove(job._id)}
                            disabled={removingId === job._id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                            title="Remove from saved jobs"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate("/find-job")}
                            className="h-9 rounded-lg bg-[#00e5ff] px-5 text-xs font-bold text-[#080d1a]"
                          >
                            View Jobs
                          </button>

                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock size={12} />
                            {formatDate(item.savedAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}