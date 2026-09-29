import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  ChevronDown,
  Clock,
  SlidersHorizontal,
  Bell,
  Heart,
  LayoutDashboard,
  FileText,
  User,
  Settings,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/jobs";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, path: "/find-job" },
  { name: "My Applications", icon: FileText, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, path: "/saved-jobs" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function formatSalary(salary) {
  if (salary === undefined || salary === null || salary === "") return "Salary not specified";
  return typeof salary === "number" ? `$${salary.toLocaleString()}` : salary;
}

export default function FindJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        if (!API_BASE_URL) {
          throw new Error("Set VITE_API_BASE_URL to your jobs API URL.");
        }

        const params = new URLSearchParams();
        if (keyword.trim()) params.set("keyword", keyword.trim());

        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/?${params.toString()}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load jobs.");
        }

        if (!ignore) {
          setJobs(Array.isArray(data) ? data : data.jobs || []);
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Could not load jobs.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      ignore = true;
    };
  }, [keyword]);

  const jobTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.jobType).filter(Boolean))],
    [jobs]
  );

  const visibleJobs = useMemo(() => {
    const locationQuery = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesLocation =
        !locationQuery ||
        String(job.location || "").toLowerCase().includes(locationQuery);

      const matchesType = !jobType || job.jobType === jobType;
      return matchesLocation && matchesType;
    });
  }, [jobs, location, jobType]);

  function toggleSave(id) {
    setSavedJobs((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

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
                  <SlidersHorizontal size={18} /> Filters
                </button>
              </div>

              <div className={`${isMobileFilterOpen ? "block" : "hidden"} mt-3 lg:block`}>
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
              Showing <span className="font-semibold text-white">{visibleJobs.length}</span> jobs
            </p>

            {loading && <p className="text-slate-300">Loading jobs…</p>}

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
                const id = job._id || job.id;
                const isSaved = savedJobs.includes(id);

                return (
                  <article
                    key={id}
                    className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6"
                  >
                    <div className="flex flex-col justify-between gap-5 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                          {job.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} /> {job.location || "Location not specified"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <DollarSign size={14} /> {formatSalary(job.salary)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Briefcase size={14} /> {job.jobType || "Job type not specified"}
                          </span>
                          {job.createdAt && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <button
                          type="button"
                          onClick={() => toggleSave(id)}
                          aria-label={isSaved ? "Unsave job" : "Save job"}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                            isSaved
                              ? "border-cyan-500/40 bg-cyan-500/10 text-[#00e5ff]"
                              : "border-[#1e2f4e] bg-[#090f1d] text-slate-400"
                          }`}
                        >
                          <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/jobs/${id}`)}
                          className="h-9 rounded-lg bg-[#00e5ff] px-5 text-xs font-bold text-[#080d1a]"
                        >
                          View Job
                        </button>
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