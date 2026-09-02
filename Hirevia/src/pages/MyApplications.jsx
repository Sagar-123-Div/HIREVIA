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
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  Filter,
  ArrowUpRight,
} from "lucide-react";

const initialApplications = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    type: "Full Time",
    appliedDate: "May 31, 2025",
    status: "Interview Scheduled",
    statusStyle: "bg-cyan-500/10 text-[#00e5ff] border border-cyan-500/30",
    nextStep: "Technical Round 2 on June 5, 2025",
    logo: "T",
    logoColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  },
  {
    id: 2,
    title: "UI/UX Product Designer",
    company: "Pixel Perfect Labs",
    location: "Delhi, India (Remote)",
    type: "Full Time",
    appliedDate: "May 28, 2025",
    status: "Shortlisted",
    statusStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    nextStep: "Recruiter screening call pending",
    logo: "P",
    logoColor: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  },
  {
    id: 3,
    title: "Backend Cloud Developer",
    company: "CodeCraft Systems",
    location: "Mumbai, India",
    type: "Full Time",
    appliedDate: "May 24, 2025",
    status: "Under Review",
    statusStyle: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    nextStep: "Application viewed by hiring manager",
    logo: "C",
    logoColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  {
    id: 4,
    title: "Full Stack Engineer",
    company: "InnovateX Corp",
    location: "Hyderabad, India",
    type: "Contract",
    appliedDate: "May 15, 2025",
    status: "Applied",
    statusStyle: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
    nextStep: "Submitted successfully",
    logo: "X",
    logoColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "DataWise Analytics",
    location: "Pune, India",
    type: "Full Time",
    appliedDate: "May 10, 2025",
    status: "Not Selected",
    statusStyle: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    nextStep: "Position filled by another candidate",
    logo: "D",
    logoColor: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  },
];

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, active: false, path: "/find-job" },
  { name: "My Applications", icon: FileText, active: true, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, active: false, path: "/saved-jobs" },
  { name: "Profile", icon: User, active: false, path: "/profile" },
  { name: "Settings", icon: Settings, active: false, path: "/settings" },
];

export default function MyApplications() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredApps =
    filterStatus === "All"
      ? initialApplications
      : initialApplications.filter((app) => app.status.toLowerCase().includes(filterStatus.toLowerCase()));

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
              <h2 className="text-xl font-bold tracking-tight text-white">My Applications</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e5ff]">
                {initialApplications.length} Total
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
            {/* Quick Stats Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5">
                <p className="text-xs font-medium text-slate-400">Total Applied</p>
                <h3 className="mt-2 text-2xl font-bold text-white">12</h3>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5">
                <p className="text-xs font-medium text-[#00e5ff]">In Review / Interview</p>
                <h3 className="mt-2 text-2xl font-bold text-[#00e5ff]">4</h3>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
                <p className="text-xs font-medium text-emerald-400">Shortlisted</p>
                <h3 className="mt-2 text-2xl font-bold text-emerald-400">2</h3>
              </div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5">
                <p className="text-xs font-medium text-rose-400">Rejected</p>
                <h3 className="mt-2 text-2xl font-bold text-rose-400">1</h3>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#162238] pb-4">
              <div className="flex flex-wrap gap-2">
                {["All", "Interview", "Shortlisted", "Under Review", "Applied", "Not Selected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      filterStatus === tab
                        ? "border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]"
                        : "text-slate-400 hover:bg-[#0c1424] hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex h-10 items-center gap-2.5 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-3.5 text-xs text-slate-400">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Filter by company or role..."
                  className="w-48 border-none bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="group rounded-2xl border border-[#162238] bg-[#0c1424] p-5 transition-all duration-200 hover:border-[#1e2f4e] hover:bg-[#101b30]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left info */}
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold ${app.logoColor}`}>
                        {app.logo}
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white transition group-hover:text-[#00e5ff]">
                          {app.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                          <span className="font-medium text-slate-300">{app.company}</span>
                          <span className="mx-2 text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-500" />
                            {app.location}
                          </span>
                          <span className="mx-2 text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-slate-500" />
                            Applied {app.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Status + Action */}
                    <div className="flex items-center justify-between gap-4 border-t border-[#162238] pt-3 sm:border-0 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${app.statusStyle}`}>
                          {app.status}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-400">{app.nextStep}</p>
                      </div>

                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e2f4e] bg-[#090f1d] text-slate-400 transition hover:border-cyan-500/50 hover:text-[#00e5ff]">
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}