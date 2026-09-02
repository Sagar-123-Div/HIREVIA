import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Bookmark,
  ChevronDown,
  Clock,
  Building2,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Bell,
  Heart,
  LayoutDashboard,
  FileText,
  User,
  Settings,
} from "lucide-react";

// Filter Options
const jobTypes = ["Full Time", "Part Time", "Remote", "Contract", "Internship"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Lead / Manager"];
const departments = ["Engineering", "Design", "Product", "Marketing", "Data & Analytics"];

// Mock Job Data
const initialJobs = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    type: "Full Time",
    workplace: "Hybrid",
    experience: "Senior Level",
    salary: "$90k - $120k",
    posted: "1 day ago",
    department: "Engineering",
    tags: ["React", "Node.js", "TypeScript", "AWS"],
    logo: "T",
    logoBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    featured: true,
  },
  {
    id: 2,
    title: "Product UI/UX Designer",
    company: "Pixel Perfect Labs",
    location: "Delhi, India",
    type: "Full Time",
    workplace: "Remote",
    experience: "Mid Level",
    salary: "$65k - $85k",
    posted: "2 days ago",
    department: "Design",
    tags: ["Figma", "Design Systems", "Prototyping"],
    logo: "P",
    logoBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    featured: false,
  },
  {
    id: 3,
    title: "Backend Cloud Architect",
    company: "CodeCraft Systems",
    location: "Mumbai, India",
    type: "Contract",
    workplace: "Remote",
    experience: "Lead / Manager",
    salary: "$110k - $140k",
    posted: "3 days ago",
    department: "Engineering",
    tags: ["Go", "Kubernetes", "Microservices", "GCP"],
    logo: "C",
    logoBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    featured: true,
  },
  {
    id: 4,
    title: "Principal Product Manager",
    company: "InnovateX Corp",
    location: "Hyderabad, India",
    type: "Full Time",
    workplace: "On-site",
    experience: "Senior Level",
    salary: "$100k - $130k",
    posted: "3 days ago",
    department: "Product",
    tags: ["Roadmapping", "Agile", "SaaS", "Growth"],
    logo: "X",
    logoBg: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    featured: false,
  },
  {
    id: 5,
    title: "Data Science & AI Analyst",
    company: "DataWise Analytics",
    location: "Pune, India",
    type: "Full Time",
    workplace: "Hybrid",
    experience: "Entry Level",
    salary: "$50k - $70k",
    posted: "4 days ago",
    department: "Data & Analytics",
    tags: ["Python", "SQL", "Machine Learning", "Tableau"],
    logo: "D",
    logoBg: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    featured: false,
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, active: true, path: "/find-job" },
  { name: "My Applications", icon: FileText, active: false, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, active: false, path: "/saved-jobs" },
  { name: "Profile", icon: User, active: false, path: "/profile" },
  { name: "Settings", icon: Settings, active: false, path: "/settings" },
];

export default function FindJobsPage() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([1]);
  const [selectedTypes, setSelectedTypes] = useState(["Full Time"]);
  const [selectedExp, setSelectedExp] = useState([]);
  const [selectedDept, setSelectedDept] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleSave = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFilter = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      <div className="flex min-h-screen">
        {/* ===================================================
            SIDEBAR (Standardized with Dashboard)
        ==================================================== */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">
          {/* Logo */}
          <div className="mb-10 px-4">
            <h1 className="text-[26px] font-black tracking-tight text-[#00e5ff] drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]">
              HIREVIA
            </h1>
            <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">
              Find Your Dream Job
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`group flex h-12 items-center gap-4 rounded-xl px-4 text-left text-[15px] font-medium transition-all duration-200 ${
                    item.active
                      ? "border border-cyan-500/20 bg-cyan-500/10 text-[#00e5ff] shadow-[inset_0_0_12px_rgba(0,229,255,0.08)]"
                      : "text-slate-400 hover:bg-[#131f37] hover:text-slate-200"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={item.active ? 2.2 : 1.8}
                    className={item.active ? "text-[#00e5ff]" : "text-slate-400 group-hover:text-slate-200"}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ===================================================
            MAIN CONTENT AREA
        ==================================================== */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 backdrop-blur-md sm:px-10">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-white">Find Jobs</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e5ff]">
                1,420 Active Openings
              </span>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300 transition hover:border-cyan-500/40 hover:text-[#00e5ff]">
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
              </button>

              <div className="hidden h-6 w-px bg-[#1a2740] sm:block" />

              <button className="flex items-center gap-3 rounded-xl border border-[#1a2740] bg-[#101b30] py-1.5 pl-2 pr-3 transition hover:border-cyan-500/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-[#00e5ff]">
                  AV
                </div>
                <span className="hidden text-xs font-semibold text-slate-200 sm:inline-block">
                  Aman Verma
                </span>
                <ChevronDown size={15} className="text-slate-400" />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            {/* Search Filter Bar */}
            <div className="mb-8 rounded-2xl border border-[#1d2d4a] bg-gradient-to-b from-[#101a2e] to-[#0c1424] p-4 shadow-xl">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1.2fr_auto]">
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400 focus-within:border-cyan-500/50">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full border-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400 focus-within:border-cyan-500/50">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder="City, state, zip or 'Remote'"
                    className="w-full border-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="flex h-12 items-center gap-2 rounded-xl border border-[#1e2f4e] bg-[#101b30] px-4 text-sm font-medium text-slate-300 transition hover:border-cyan-500/40 lg:hidden"
                  >
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Search filters applied')}
                    className="h-12 w-full flex-1 rounded-xl bg-[#00e5ff] px-6 text-sm font-bold text-[#080d1a] shadow-[0_0_20px_rgba(0,229,255,0.3)] transition hover:bg-[#33ebff] active:scale-[0.98] md:w-auto"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Layout Grid: Filters + Job Cards */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
              {/* Desktop Filters Sidebar */}
              <aside className="hidden space-y-6 rounded-2xl border border-[#162238] bg-[#0c1424] p-5 lg:block">
                <div className="flex items-center justify-between border-b border-[#162238] pb-4">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Filter size={18} className="text-[#00e5ff]" />
                    <span>Filter Jobs</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedExp([]);
                      setSelectedDept([]);
                    }}
                    className="text-xs font-semibold text-slate-400 transition hover:text-[#00e5ff]"
                  >
                    Reset All
                  </button>
                </div>

                {/* Job Type */}
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Employment Type
                  </h3>
                  <div className="space-y-2.5">
                    {jobTypes.map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center justify-between text-sm text-slate-300 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                            className="h-4 w-4 rounded border-[#1e2f4e] bg-[#090f1d] text-cyan-500 accent-[#00e5ff] focus:ring-0"
                          />
                          <span>{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="border-t border-[#162238] pt-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Experience Level
                  </h3>
                  <div className="space-y-2.5">
                    {experienceLevels.map((exp) => (
                      <label
                        key={exp}
                        className="flex cursor-pointer items-center justify-between text-sm text-slate-300 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedExp.includes(exp)}
                            onChange={() => toggleFilter(selectedExp, setSelectedExp, exp)}
                            className="h-4 w-4 rounded border-[#1e2f4e] bg-[#090f1d] accent-[#00e5ff] focus:ring-0"
                          />
                          <span>{exp}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Department */}
                <div className="border-t border-[#162238] pt-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </h3>
                  <div className="space-y-2.5">
                    {departments.map((dept) => (
                      <label
                        key={dept}
                        className="flex cursor-pointer items-center justify-between text-sm text-slate-300 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedDept.includes(dept)}
                            onChange={() => toggleFilter(selectedDept, setSelectedDept, dept)}
                            className="h-4 w-4 rounded border-[#1e2f4e] bg-[#090f1d] accent-[#00e5ff] focus:ring-0"
                          />
                          <span>{dept}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Job Results List */}
              <div className="space-y-4">
                {/* Result Controls Header */}
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-semibold text-white">{initialJobs.length}</span> jobs matching your preferences
                  </p>
                  <div className="flex items-center gap-2 self-end text-xs sm:self-auto">
                    <span className="text-slate-400">Sort by:</span>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#162238] bg-[#0c1424] px-3 py-1.5 font-medium text-slate-200">
                      <span>Most Relevant</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Job Cards */}
                {initialJobs.map((job) => {
                  const isSaved = savedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className={`group relative rounded-2xl border transition-all duration-200 ${
                        job.featured
                          ? "border-cyan-500/30 bg-[#0d1729] shadow-[0_4px_20px_rgba(0,229,255,0.04)]"
                          : "border-[#162238] bg-[#0c1424] hover:border-slate-700"
                      } p-6`}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        {/* Job Details Left */}
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-base font-bold shadow-inner ${job.logoBg}`}
                          >
                            {job.logo}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-base font-semibold text-white transition group-hover:text-[#00e5ff]">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00e5ff]">
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                              <span className="font-medium text-slate-300">{job.company}</span>
                              <span className="mx-2 text-slate-600">•</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={13} className="text-slate-500" />
                                {job.location} ({job.workplace})
                              </span>
                              <span className="mx-2 text-slate-600">•</span>
                              <span className="flex items-center gap-1">
                                <DollarSign size={13} className="text-slate-500" />
                                {job.salary}
                              </span>
                            </div>

                            {/* Tags */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <span className="rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                                {job.type}
                              </span>
                              <span className="rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                                {job.experience}
                              </span>
                              {job.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-[#131f36] px-2.5 py-1 text-[11px] font-medium text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Right */}
                        <div className="flex items-center gap-3 border-t border-[#162238] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                          <button
                            onClick={() => toggleSave(job.id)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                              isSaved
                                ? "border-cyan-500/40 bg-cyan-500/10 text-[#00e5ff]"
                                : "border-[#1e2f4e] bg-[#090f1d] text-slate-400 hover:text-white"
                            }`}
                          >
                            <Bookmark size={17} strokeWidth={isSaved ? 2.5 : 1.8} fill={isSaved ? "currentColor" : "none"} />
                          </button>

                          <button
                            type="button"
                            onClick={() => alert('Application started for ' + job.title)}
                            className="h-9 w-full flex-1 rounded-lg bg-[#00e5ff] px-5 text-xs font-bold text-[#080d1a] shadow-[0_0_15px_rgba(0,229,255,0.2)] transition hover:bg-[#33ebff] active:scale-[0.98] sm:w-auto sm:flex-initial"
                          >
                            Apply Now
                          </button>

                          <span className="hidden items-center gap-1 text-[11px] text-slate-500 sm:flex">
                            <Clock size={12} />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}