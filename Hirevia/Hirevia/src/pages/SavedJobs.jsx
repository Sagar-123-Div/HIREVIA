import React, { useState } from "react";
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
  DollarSign,
  Clock,
  Trash2,
  Bookmark,
  Share2,
} from "lucide-react";

const initialSavedJobs = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    type: "Full Time",
    salary: "$90k - $120k",
    savedDate: "Saved 2 days ago",
    tags: ["React", "Node.js", "TypeScript", "AWS"],
    logo: "T",
    logoBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: 2,
    title: "Backend Cloud Architect",
    company: "CodeCraft Systems",
    location: "Mumbai, India (Remote)",
    type: "Contract",
    salary: "$110k - $140k",
    savedDate: "Saved 4 days ago",
    tags: ["Go", "Kubernetes", "Microservices"],
    logo: "C",
    logoBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: 3,
    title: "Lead UI Designer",
    company: "Pixel Perfect Labs",
    location: "Delhi, India",
    type: "Full Time",
    salary: "$75k - $95k",
    savedDate: "Saved 1 week ago",
    tags: ["Figma", "Design Systems", "Prototyping"],
    logo: "P",
    logoBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, active: false, path: "/find-job" },
  { name: "My Applications", icon: FileText, active: false, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, active: true, path: "/saved-jobs" },
  { name: "Profile", icon: User, active: false, path: "/profile" },
  { name: "Settings", icon: Settings, active: false, path: "/settings" },
];

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs);

  const removeSavedJob = (id) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">
          <div className="mb-10 px-4">
            <h1 className="text-[26px] font-black tracking-tight text-[#00e5ff] drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]">
              HIREVIA
            </h1>
            <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">
              Find Your Dream Job
            </p>
          </div>

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

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 backdrop-blur-md sm:px-10">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-white">Saved Jobs</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e5ff]">
                {savedJobs.length} Bookmarked
              </span>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300 transition hover:border-cyan-500/40 hover:text-[#00e5ff]">
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-[#00e5ff]">
                AV
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            {savedJobs.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e2f4e] bg-[#0c1424]/50 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]">
                  <Bookmark size={28} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">No saved jobs yet</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Bookmark jobs you're interested in while browsing to view them later.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group rounded-2xl border border-[#162238] bg-[#0c1424] p-6 transition-all duration-200 hover:border-[#1e2f4e] hover:bg-[#101b30]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-base font-bold shadow-inner ${job.logoBg}`}
                        >
                          {job.logo}
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white transition group-hover:text-[#00e5ff]">
                            {job.title}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                            <span className="font-medium text-slate-300">{job.company}</span>
                            <span className="mx-2 text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={13} className="text-slate-500" />
                              {job.location}
                            </span>
                            <span className="mx-2 text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={13} className="text-slate-500" />
                              {job.salary}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                              {job.type}
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

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-3 border-t border-[#162238] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2f4e] bg-[#090f1d] text-slate-400 hover:text-white">
                            <Share2 size={16} />
                          </button>
                          <button
                            onClick={() => removeSavedJob(job.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                            title="Remove from saved"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <button className="h-9 w-full flex-1 rounded-lg bg-[#00e5ff] px-5 text-xs font-bold text-[#080d1a] shadow-[0_0_15px_rgba(0,229,255,0.2)] transition hover:bg-[#33ebff] active:scale-[0.98] sm:w-auto sm:flex-initial">
                          Apply Now
                        </button>

                        <span className="hidden items-center gap-1 text-[11px] text-slate-500 sm:flex">
                          <Clock size={12} />
                          {job.savedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}