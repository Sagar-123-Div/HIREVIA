import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  ChevronDown,
  Clock,
  SlidersHorizontal,
  Bell,
  Heart,
  LayoutDashboard,
  FileText,
  User,
  IndianRupee,
} from "lucide-react";
import {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} from "../Service/savedJobService";
import { applyToJob } from "../Service/applicationService";
import { formatSalary } from "../utils/formatSalary";
import API_BASE_URL from "../Service/apiConfig";

const API_URL = `${API_BASE_URL}/api/jobs`;

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

export default function FindJobsPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load all jobs from backend
  useEffect(() => {
    let ignore = false;

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (keyword.trim()) {
          params.set("keyword", keyword.trim());
        }

        const response = await fetch(
          `${API_URL}?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load jobs");
        }

        if (!ignore) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Could not load jobs");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      ignore = true;
    };
  }, [keyword]);

  // Load bookmarked job IDs from backend
  useEffect(() => {
    async function loadSavedJobIds() {
      const result = await getSavedJobs();

      if (result.success) {
        const savedIds = result.savedJobs.map(
          (item) => item.job._id
        );

        setSavedJobs(savedIds);
      }
    }

    loadSavedJobIds();
  }, []);

  const jobTypes = useMemo(() => {
    return [...new Set(jobs.map((job) => job.jobType).filter(Boolean))];
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    const locationQuery = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesLocation =
        !locationQuery ||
        String(job.location || "")
          .toLowerCase()
          .includes(locationQuery);

      const matchesType = !jobType || job.jobType === jobType;

      return matchesLocation && matchesType;
    });
  }, [jobs, location, jobType]);

  // Save or remove job from MongoDB
  async function toggleSave(jobId) {
    const isAlreadySaved = savedJobs.includes(jobId);

    const result = isAlreadySaved
      ? await removeSavedJob(jobId)
      : await saveJob(jobId);

    if (!result.success) {
      alert(result.message);
      return;
    }

    setSavedJobs((current) =>
      isAlreadySaved
        ? current.filter((savedId) => savedId !== jobId)
        : [...current, jobId]
    );
  }

  async function handleApply(jobId) {
    if (applyingJobId || appliedJobs.includes(jobId)) {
      return;
    }

    setApplyingJobId(jobId);
    setApplicationMessage("");
    setApplicationError("");

    try {
      const result = await applyToJob(jobId);

      if (result.success) {
        setAppliedJobs((current) => [...current, jobId]);
        setApplicationMessage(result.message);
      } else {
        setApplicationError(result.message);
      }
    } catch (error) {
      setApplicationError(error.message || "Could not submit application.");
    } finally {
      setApplyingJobId("");
    }
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
              const active = item.name === "Find Jobs";

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
              <h2 className="text-xl font-bold text-white">Find Jobs</h2>

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-[#00e5ff]">
                {jobs.length} Openings
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Bell size={19} className="text-slate-300" />

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 rounded-xl border border-[#1a2740] bg-[#101b30] px-3 py-2 text-xs font-semibold text-slate-200"
              >
                Profile <ChevronDown size={15} />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            <div className="mb-8 rounded-2xl border border-[#1d2d4a] bg-[#101a2e] p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1.2fr_auto]">
                <label className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400">
                  <Search size={18} />

                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Search job titles"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </label>

                <label className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400">
                  <MapPin size={18} />

                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Filter by location"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen((open) => !open)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#1e2f4e] bg-[#101b30] px-4 text-sm text-slate-300 lg:hidden"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
              </div>

              <div
                className={`${
                  isMobileFilterOpen ? "block" : "hidden"
                } mt-3 lg:block`}
              >
                <select
                  value={jobType}
                  onChange={(event) => setJobType(event.target.value)}
                  className="h-11 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200"
                >
                  <option value="">All job types</option>

                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {visibleJobs.length}
              </span>{" "}
              jobs
            </p>

            {applicationMessage && (
              <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {applicationMessage}
              </p>
            )}

            {applicationError && (
              <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                {applicationError}
              </p>
            )}

            {loading && (
              <p className="text-slate-300">Loading jobs...</p>
            )}

            {!loading && error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </p>
            )}

            {!loading && !error && visibleJobs.length === 0 && (
              <p className="rounded-xl border border-[#162238] bg-[#0c1424] p-6 text-slate-400">
                No jobs found.
              </p>
            )}

            <div className="space-y-4">
              {visibleJobs.map((job) => {
                const jobId = job._id;
                const isSaved = savedJobs.includes(jobId);
                const isApplied = appliedJobs.includes(jobId);
                const isApplying = applyingJobId === jobId;
                const company = job.postedBy?.name || "Hirevia Recruiter";

                return (
                  <article
                    key={jobId}
                    className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 transition hover:border-[#1e2f4e] hover:bg-[#101b30]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-base font-bold text-[#00e5ff]">
                          {getInitial(job.title)}
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${encodeURIComponent(jobId)}`, { state: { job } })}
                            className="text-left text-base font-semibold text-white transition hover:text-[#00e5ff]"
                          >
                            {job.title}
                          </button>

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

                          <p className="mt-3 max-w-2xl text-sm text-slate-400">
                            {job.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                              <Briefcase
                                size={12}
                                className="mr-1 inline"
                              />
                              {job.jobType || "Job"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 border-t border-[#162238] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => toggleSave(jobId)}
                          aria-label={
                            isSaved ? "Remove saved job" : "Save job"
                          }
                          title={isSaved ? "Remove saved job" : "Save job"}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                            isSaved
                              ? "border-cyan-500/40 bg-cyan-500/10 text-[#00e5ff]"
                              : "border-[#1e2f4e] bg-[#090f1d] text-slate-400 hover:text-[#00e5ff]"
                          }`}
                        >
                          <Bookmark
                            size={18}
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApply(jobId)}
                          disabled={isApplied || Boolean(applyingJobId)}
                          className="h-9 rounded-lg bg-[#00e5ff] px-5 text-xs font-bold text-[#080d1a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isApplied
                            ? "Applied"
                            : isApplying
                              ? "Applying..."
                              : "Apply Now"}
                        </button>

                        {job.createdAt && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock size={12} />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}