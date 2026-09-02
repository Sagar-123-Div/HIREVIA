import React from "react";
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
  Bookmark,
  ChevronRight,
  Briefcase,
} from "lucide-react";

const recommendedJobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    location: "Bangalore, India",
    type: "Full Time",
    posted: "2d ago",
    logo: "T",
    color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  },
  {
    title: "UI/UX Designer",
    company: "Pixel Perfect",
    location: "Delhi, India",
    type: "Full Time",
    posted: "3d ago",
    logo: "P",
    color: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  },
  {
    title: "Backend Developer",
    company: "CodeCraft",
    location: "Mumbai, India",
    type: "Full Time",
    posted: "4d ago",
    logo: "C",
    color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  {
    title: "Product Manager",
    company: "InnovateX",
    location: "Hyderabad, India",
    type: "Full Time",
    posted: "5d ago",
    logo: "X",
    color: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  },
  {
    title: "Data Analyst",
    company: "DataWise",
    location: "Pune, India",
    type: "Full Time",
    posted: "6d ago",
    logo: "D",
    color: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  },
];

const applications = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    status: "Under Review",
    statusStyle: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    date: "May 31, 2025",
    logo: "T",
    color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  },
  {
    title: "UI/UX Designer",
    company: "Pixel Perfect",
    status: "Shortlisted",
    statusStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    date: "May 30, 2025",
    logo: "P",
    color: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  },
  {
    title: "Backend Developer",
    company: "CodeCraft",
    status: "Applied",
    statusStyle: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    date: "May 30, 2025",
    logo: "C",
    color: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
];

const navItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
    path: "/dashboard",
  },
  {
    name: "Find Jobs",
    icon: Search,
    path: "/find-job",
  },
  {
    name: "My Applications",
    icon: FileText,
    path: "/my-applications",
  },
  {
    name: "Saved Jobs",
    icon: Heart,
    path: "/saved-jobs",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function CompanyLogo({ letter, color }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-inner ${color}`}
    >
      {letter}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">

      {/* =====================================================
          DESKTOP LAYOUT
      ====================================================== */}
      <div className="flex min-h-screen">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">

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
                      ? "bg-cyan-500/10 text-[#00e5ff] shadow-[inset_0_0_12px_rgba(0,229,255,0.08)] border border-cyan-500/20"
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

          {/* Profile Completion Card */}
          <div className="mt-auto rounded-2xl border border-[#1d2d4a] bg-[#101a2e]/80 p-5 text-center shadow-lg backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-[#00e5ff] ring-1 ring-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Briefcase size={22} strokeWidth={2} />
            </div>

            <h3 className="mb-1.5 text-sm font-semibold text-white">
              Complete your profile
            </h3>

            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Increase your visibility to top recruiters hiring now.
            </p>

            <button
              type="button"
              onClick={() => navigate('/find-job')}
              className="h-9 w-full rounded-lg bg-[#00e5ff] text-xs font-bold text-[#080d1a] shadow-[0_0_20px_rgba(0,229,255,0.25)] transition hover:bg-[#33ebff] active:scale-[0.98]"
            >
              Complete Profile
            </button>

            <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
              <span>Profile Strength</span>
              <span className="text-[#00e5ff]">60%</span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#18263f]">
              <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-cyan-500 to-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            </div>
          </div>
        </aside>

        {/* ===================================================
            MAIN
        ==================================================== */}
        <main className="min-w-0 flex-1">

          {/* =================================================
              HEADER
          ================================================== */}
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 backdrop-blur-md sm:px-10">

            {/* Search */}
            <div className="flex h-11 w-full max-w-[560px] items-center gap-3 rounded-xl border border-[#1c2a44] bg-[#090f1d] px-4 text-slate-400 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40 transition">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                className="w-full border-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Header Actions */}
            <div className="ml-6 hidden items-center gap-5 sm:flex">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300 transition hover:border-cyan-500/40 hover:text-[#00e5ff]">
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300 transition hover:border-cyan-500/40 hover:text-[#00e5ff]">
                <Heart size={19} strokeWidth={1.8} />
              </button>

              <div className="h-6 w-px bg-[#1a2740]" />

              {/* User */}
              <button className="flex items-center gap-3 rounded-xl border border-[#1a2740] bg-[#101b30] py-1.5 pl-2 pr-3 transition hover:border-cyan-500/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-[#00e5ff]">
                  AV
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Aman Verma
                </span>
                <ChevronDown size={15} className="text-slate-400" />
              </button>
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================== */}
          <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 sm:px-10">

            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back, Aman! <span className="inline-block animate-pulse">👋</span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Hirevia connects you with companies hiring right now.
              </p>
            </div>

            {/* =================================================
                JOB SEARCH HERO BOX
            ================================================== */}
            <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#1d2d4a] bg-gradient-to-b from-[#101a2e] to-[#0c1424] p-6 shadow-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

              <h2 className="mb-5 text-base font-semibold text-slate-100">
                Find your next opportunity
              </h2>

              <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.35fr_1fr_180px_160px]">
                {/* Job Search */}
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400 focus-within:border-cyan-500/50 transition">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Job title, skills or company"
                    className="w-full border-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                {/* Location */}
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400 focus-within:border-cyan-500/50 transition">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder="Location or Remote"
                    className="w-full border-none bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                {/* Job Type */}
                <button className="flex h-12 items-center justify-between rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-300 transition hover:border-slate-600">
                  <span>Job Type</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </button>

                {/* Search Button */}
                <button className="h-12 rounded-xl bg-[#00e5ff] text-sm font-bold text-[#080d1a] shadow-[0_0_25px_rgba(0,229,255,0.3)] transition-all duration-200 hover:bg-[#33ebff] active:scale-[0.98]">
                  Search Jobs
                </button>
              </div>
            </section>

            {/* =================================================
                RECOMMENDED JOBS
            ================================================== */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-[#162238] bg-[#0c1424]">

              {/* Section Header */}
              <div className="flex h-14 items-center justify-between border-b border-[#162238] px-6">
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Recommended Jobs for You
                </h2>
                <button className="text-xs font-semibold text-[#00e5ff] transition hover:text-[#66efff]">
                  View All
                </button>
              </div>

              {/* Jobs */}
              <div className="divide-y divide-[#162238]">
                {recommendedJobs.map((job, index) => (
                  <div
                    key={index}
                    className="group flex min-h-[72px] items-center justify-between px-6 py-3.5 transition-colors duration-150 hover:bg-[#101b30]"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <CompanyLogo letter={job.logo} color={job.color} />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-[#00e5ff] transition-colors">
                          {job.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {job.company}
                          <span className="mx-2 text-slate-600">•</span>
                          {job.location}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-6">
                      <span className="hidden rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] font-medium text-slate-300 sm:inline-block">
                        {job.type}
                      </span>
                      <span className="hidden text-xs text-slate-500 sm:inline-block">
                        {job.posted}
                      </span>
                      <button className="text-slate-500 transition hover:text-[#00e5ff]">
                        <Bookmark size={19} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                RECENT APPLICATIONS
            ================================================== */}
            <section className="overflow-hidden rounded-2xl border border-[#162238] bg-[#0c1424]">

              {/* Header */}
              <div className="flex h-14 items-center justify-between border-b border-[#162238] px-6">
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Recent Applications
                </h2>
                <button className="text-xs font-semibold text-[#00e5ff] transition hover:text-[#66efff]">
                  View All
                </button>
              </div>

              {/* Applications */}
              <div className="divide-y divide-[#162238]">
                {applications.map((application, index) => (
                  <div
                    key={index}
                    className="group grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 transition-colors duration-150 hover:bg-[#101b30] sm:grid-cols-[1.5fr_1fr_1.1fr_1.2fr_24px]"
                  >
                    {/* Job */}
                    <div className="flex items-center gap-4">
                      <CompanyLogo letter={application.logo} color={application.color} />
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-[#00e5ff] transition-colors">
                        {application.title}
                      </h3>
                    </div>

                    {/* Company */}
                    <div className="hidden text-xs text-slate-400 sm:block">
                      {application.company}
                    </div>

                    {/* Status */}
                    <span
                      className={`hidden w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold sm:block ${application.statusStyle}`}
                    >
                      {application.status}
                    </span>

                    {/* Date */}
                    <div className="hidden text-xs text-slate-500 sm:block">
                      Applied on {application.date}
                    </div>

                    {/* Arrow */}
                    <button className="text-slate-500 transition hover:text-[#00e5ff]">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </main>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ====================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#162238] bg-[#0c1424]/95 px-2 backdrop-blur-lg lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                item.active ? "text-[#00e5ff]" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={19} strokeWidth={item.active ? 2.2 : 1.8} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}