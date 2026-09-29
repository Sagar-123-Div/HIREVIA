import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, FileText, Heart, User, Settings, Bell,
  MapPin, ChevronDown, Bookmark, ChevronRight, Briefcase,
} from "lucide-react";
import { getDashboardData } from "../Service/Dashboard";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, path: "/find-job" },
  { name: "My Applications", icon: FileText, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, path: "/saved-jobs" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const logoStyles = [
  "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "bg-teal-500/20 text-teal-400 border border-teal-500/30",
];

const statusStyles = {
  Applied: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
  "Under Review": "bg-sky-500/10 text-sky-400 border border-sky-500/30",
  Shortlisted: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric",
}) : "Recently";

function CompanyLogo({ letter, color }) {
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-inner ${color}`}>
      {letter}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");
        setDashboard(await getDashboardData());
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recommendedJobs = dashboard?.recommendedJobs || [];
  const applications = dashboard?.recentApplications || [];
  const user = dashboard?.user;

  return (
    <div className="min-h-screen bg-[#080d1a] font-sans text-slate-100 antialiased">
      <div className="flex min-h-screen">
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-[#162238] bg-[#0c1424] px-5 py-7 lg:flex">
          <div className="mb-10 px-4">
            <h1 className="text-[26px] font-black tracking-tight text-[#00e5ff]">HIREVIA</h1>
            <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">Find Your Dream Job</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.name} type="button" onClick={() => navigate(item.path)}
                  className={`group flex h-12 items-center gap-4 rounded-xl px-4 text-left text-[15px] font-medium transition-all ${item.active ? "border border-cyan-500/20 bg-cyan-500/10 text-[#00e5ff]" : "text-slate-400 hover:bg-[#131f37] hover:text-slate-200"}`}>
                  <Icon size={20} strokeWidth={item.active ? 2.2 : 1.8} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#1d2d4a] bg-[#101a2e]/80 p-5 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-[#00e5ff] ring-1 ring-cyan-500/30"><Briefcase size={22} /></div>
            <h3 className="mb-1.5 text-sm font-semibold text-white">Complete your profile</h3>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">Increase your visibility to top recruiters hiring now.</p>
            <button type="button" onClick={() => navigate("/profile")} className="h-9 w-full rounded-lg bg-[#00e5ff] text-xs font-bold text-[#080d1a] transition hover:bg-[#33ebff]">Complete Profile</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 sm:px-10">
            <div className="flex h-11 w-full max-w-[560px] items-center gap-3 rounded-xl border border-[#1c2a44] bg-[#090f1d] px-4 text-slate-400">
              <Search size={18} />
              <input type="text" placeholder="Search jobs, companies, skills..." className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" />
            </div>
            <div className="ml-6 hidden items-center gap-5 sm:flex">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00e5ff]" /></button>
              <div className="h-6 w-px bg-[#1a2740]" />
              <button className="flex items-center gap-3 rounded-xl border border-[#1a2740] bg-[#101b30] py-1.5 pl-2 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-[#00e5ff]">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                <span className="text-xs font-semibold text-slate-200">{user?.name || "User"}</span><ChevronDown size={15} className="text-slate-400" />
              </button>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 sm:px-10">
            {loading && <p className="py-10 text-center text-cyan-400">Loading dashboard...</p>}
            {error && <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

            {!loading && !error && <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back, {user?.name || "there"}! <span className="inline-block animate-pulse">👋</span></h1>
                <p className="mt-1 text-sm text-slate-400">Hirevia connects you with companies hiring right now.</p>
              </div>

              <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#1d2d4a] bg-gradient-to-b from-[#101a2e] to-[#0c1424] p-6 shadow-xl">
                <h2 className="mb-5 text-base font-semibold text-slate-100">Find your next opportunity</h2>
                <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.35fr_1fr_180px_160px]">
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400"><Search size={18} /><input type="text" placeholder="Job title, skills or company" className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" /></div>
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-slate-400"><MapPin size={18} /><input type="text" placeholder="Location or Remote" className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" /></div>
                  <button className="flex h-12 items-center justify-between rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-300"><span>Job Type</span><ChevronDown size={16} /></button>
                  <button onClick={() => navigate("/find-job")} className="h-12 rounded-xl bg-[#00e5ff] text-sm font-bold text-[#080d1a] transition hover:bg-[#33ebff]">Search Jobs</button>
                </div>
              </section>

              <section className="mb-8 overflow-hidden rounded-2xl border border-[#162238] bg-[#0c1424]">
                <div className="flex h-14 items-center justify-between border-b border-[#162238] px-6"><h2 className="text-sm font-semibold tracking-wide text-white">Recommended Jobs for You</h2><button onClick={() => navigate("/find-job")} className="text-xs font-semibold text-[#00e5ff]">View All</button></div>
                <div className="divide-y divide-[#162238]">
                  {recommendedJobs.length === 0 && <p className="p-6 text-sm text-slate-400">No jobs available yet.</p>}
                  {recommendedJobs.map((job, index) => (
                    <div key={job.id || index} className="group flex min-h-[72px] items-center justify-between px-6 py-3.5 hover:bg-[#101b30]">
                      <div className="flex items-center gap-4"><CompanyLogo letter={job.logo || job.company?.charAt(0) || "J"} color={logoStyles[index % logoStyles.length]} /><div><h3 className="text-sm font-semibold text-slate-100 group-hover:text-[#00e5ff]">{job.title}</h3><p className="mt-0.5 text-xs text-slate-400">{job.company}<span className="mx-2 text-slate-600">•</span>{job.location || "Remote"}</p></div></div>
                      <div className="flex items-center gap-6"><span className="hidden rounded-md border border-[#1e2f4e] bg-[#080d1a] px-2.5 py-1 text-[11px] text-slate-300 sm:inline-block">{job.type || "Full Time"}</span><span className="hidden text-xs text-slate-500 sm:inline-block">{formatDate(job.postedAt)}</span><button className="text-slate-500 hover:text-[#00e5ff]"><Bookmark size={19} /></button></div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-[#162238] bg-[#0c1424]">
                <div className="flex h-14 items-center justify-between border-b border-[#162238] px-6"><h2 className="text-sm font-semibold tracking-wide text-white">Recent Applications</h2><button onClick={() => navigate("/my-applications")} className="text-xs font-semibold text-[#00e5ff]">View All</button></div>
                <div className="divide-y divide-[#162238]">
                  {applications.length === 0 && <p className="p-6 text-sm text-slate-400">You have not applied to any jobs yet.</p>}
                  {applications.map((application, index) => {
                    const company = application.job?.postedBy?.name || "Recruiter";
                    const status = application.status || "Applied";
                    return <div key={application._id || index} className="group grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-4 px-6 py-3.5 hover:bg-[#101b30] sm:grid-cols-[1.5fr_1fr_1.1fr_1.2fr_24px]"><div className="flex items-center gap-4"><CompanyLogo letter={company.charAt(0).toUpperCase()} color={logoStyles[index % logoStyles.length]} /><h3 className="text-sm font-semibold text-slate-100 group-hover:text-[#00e5ff]">{application.job?.title || "Job"}</h3></div><div className="hidden text-xs text-slate-400 sm:block">{company}</div><span className={`hidden w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold sm:block ${statusStyles[status] || statusStyles.Applied}`}>{status}</span><div className="hidden text-xs text-slate-500 sm:block">Applied on {formatDate(application.createdAt)}</div><button className="text-slate-500 hover:text-[#00e5ff]"><ChevronRight size={18} /></button></div>;
                  })}
                </div>
              </section>
            </>}
          </section>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#162238] bg-[#0c1424]/95 px-2 lg:hidden">
        {navItems.slice(0, 5).map((item) => { const Icon = item.icon; return <button key={item.name} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1 text-[10px] ${item.active ? "text-[#00e5ff]" : "text-slate-400"}`}><Icon size={19} /><span>{item.name}</span></button>; })}
      </div>
    </div>
  );
}
