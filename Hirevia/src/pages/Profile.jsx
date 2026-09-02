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
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Plus,
  Edit3,
  ExternalLink,
  Download,
  Globe,
  Sparkles,
  Camera,
  BadgeCheck,
  BriefcaseBusiness,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, active: false, path: "/find-job" },
  { name: "My Applications", icon: FileText, active: false, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, active: false, path: "/saved-jobs" },
  { name: "Profile", icon: User, active: true, path: "/profile" },
  { name: "Settings", icon: Settings, active: false, path: "/settings" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [skills] = useState([
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "GraphQL",
    "UI/UX Design",
    "REST APIs",
    "Git / GitHub",
  ]);

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
            <h2 className="text-xl font-bold tracking-tight text-white">My Profile</h2>
            <div className="flex items-center gap-5">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#1a2740] bg-[#101b30] text-slate-300 transition hover:border-cyan-500/40 hover:text-[#00e5ff]">
                <Bell size={19} strokeWidth={1.8} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
              </button>
              <button className="flex h-10 items-center gap-2 rounded-xl bg-[#00e5ff] px-4 text-xs font-bold text-[#080d1a] shadow-[0_0_20px_rgba(0,229,255,0.25)] transition hover:bg-[#33ebff]">
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            {/* Top Profile Banner Card */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#1d2d4a] bg-[#0c1424] shadow-xl">
              <div className="h-36 w-full bg-gradient-to-r from-cyan-950/60 via-[#0e213b] to-indigo-950/50" />
              <div className="relative px-6 pb-6 pt-0 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="relative h-28 w-28 shrink-0 rounded-2xl border-4 border-[#0c1424] bg-cyan-500/20 text-3xl font-bold text-[#00e5ff] shadow-xl flex items-center justify-center">
                      AV
                      <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#00e5ff] text-[#080d1a] shadow-md hover:bg-[#33ebff]">
                        <Camera size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Aman Verma</h1>
                      <p className="text-sm text-[#00e5ff]">Frontend Engineer & UI Specialist</p>
                      <div className="mt-2 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-500" /> Bangalore, India</span>
                        <span className="mx-2 text-slate-600">•</span>
                        <span className="flex items-center gap-1"><Mail size={14} className="text-slate-500" /> aman.verma@example.com</span>
                        <span className="mx-2 text-slate-600">•</span>
                        <span className="flex items-center gap-1"><Phone size={14} className="text-slate-500" /> +91 98765 43210</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex h-10 items-center gap-2 rounded-xl border border-[#1d2d4a] bg-[#101a2e] px-4 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40">
                      <Download size={15} /> Resume (PDF)
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1d2d4a] bg-[#101a2e] text-slate-400 hover:text-[#00e5ff]">
                      <BadgeCheck size={18} />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1d2d4a] bg-[#101a2e] text-slate-400 hover:text-[#00e5ff]">
                      <BriefcaseBusiness size={18} />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1d2d4a] bg-[#101a2e] text-slate-400 hover:text-[#00e5ff]">
                      <Globe size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid: Details */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-8">
                {/* About Me */}
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">About Me</h3>
                    <button className="text-xs font-semibold text-[#00e5ff] hover:underline">Edit</button>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Passionate Frontend Developer with 3+ years of experience crafting high-performance, accessible, and scalable web interfaces. Specialized in React, Tailwind CSS, and Next.js architectures with a strong background in modern design systems.
                  </p>
                </div>

                {/* Experience */}
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">Work Experience</h3>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#00e5ff] hover:underline">
                      <Plus size={14} /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4 border-b border-[#162238] pb-6 last:border-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">Senior Frontend Engineer</h4>
                        <p className="text-xs text-slate-400">TechNova Labs • Full-time • Jan 2024 - Present</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          Spearheaded migration to Next.js 14 app router, boosting core web vitals by 38%. Designed and maintained atomic component libraries used across 5 internal products.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-[#162238] pb-6 last:border-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">Frontend Developer</h4>
                        <p className="text-xs text-slate-400">PixelCraft Studio • Full-time • Jun 2022 - Dec 2023</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          Built dynamic dashboard templates, interactive animations, and optimized checkout funnels converting 150k+ daily users.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">Education</h3>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#00e5ff] hover:underline">
                      <Plus size={14} /> Add Education
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-400">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">B.Tech in Computer Science & Engineering</h4>
                      <p className="text-xs text-slate-400">National Institute of Technology • 2018 - 2022</p>
                      <p className="mt-1 text-xs text-slate-400">CGPA: 8.8 / 10.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Skills & Quick Info */}
              <div className="space-y-6">
                {/* Profile Completion Widget */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-[#0c1424] p-5 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#00e5ff]">
                      <Sparkles size={14} /> Profile Strength
                    </span>
                    <span className="text-xs font-bold text-white">85%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#18263f]">
                    <div className="h-full w-[85%] rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Add 1 more work project to reach 100% and rank higher in recruiter searches.
                  </p>
                </div>

                {/* Skills */}
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Skills & Technologies</h3>
                    <button className="text-xs font-semibold text-[#00e5ff] hover:underline">Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-[#1e2f4e] bg-[#090f1d] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Roles */}
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5">
                  <h3 className="mb-3 text-sm font-semibold text-white">Job Preferences</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-[#162238] pb-2 text-slate-400">
                      <span>Preferred Roles</span>
                      <span className="font-medium text-slate-200">Frontend, Full Stack</span>
                    </div>
                    <div className="flex justify-between border-b border-[#162238] pb-2 text-slate-400">
                      <span>Work Availability</span>
                      <span className="font-medium text-[#00e5ff]">Immediate (2 weeks)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Location Preference</span>
                      <span className="font-medium text-slate-200">Remote / Hybrid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}