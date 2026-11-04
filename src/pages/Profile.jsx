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
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Edit3,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
} from "../Service/profileService";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, path: "/find-job" },
  { name: "My Applications", icon: FileText, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, path: "/saved-jobs" },
  { name: "Profile", icon: User, path: "/profile" },
];

const emptyProfile = {
  name: "",
  email: "",
  headline: "",
  location: "",
  phone: "",
  about: "",
  resume: "",
  skills: [],
  experience: [],
  education: [],
  jobPreferences: {},
};

function getInitials(name) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [profileStrength, setProfileStrength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyProfile);

  const loadProfile = async () => {
    setLoading(true);

    const result = await getMyProfile();

    if (!result.success) {
      setMessage(result.message);

      if (result.message.toLowerCase().includes("token")) {
        navigate("/login");
      }

      setLoading(false);
      return;
    }

    setProfile(result.user);
    setProfileStrength(result.profileStrength);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEditor = () => {
    setForm({
      ...profile,
      skillsText: (profile.skills || []).join(", "),
    });

    setIsEditing(true);
    setMessage("");
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    const updates = {
      name: form.name,
      email: form.email,
      headline: form.headline,
      location: form.location,
      phone: form.phone,
      about: form.about,
      resume: form.resume,
      skills: (form.skillsText || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    const result = await updateMyProfile(updates);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setMessage("Profile updated successfully.");
    setIsEditing(false);

    await loadProfile();
  };

  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  const education = Array.isArray(profile.education)
    ? profile.education
    : [];

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080d1a] text-cyan-400">
        Loading profile...
      </div>
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

            <p className="mt-1 text-xs text-slate-400">
              Find Your Dream Job
            </p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.name === "Profile";

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex h-12 items-center gap-4 rounded-xl px-4 text-left text-[15px] font-medium transition ${
                    active
                      ? "border border-cyan-500/20 bg-cyan-500/10 text-[#00e5ff]"
                      : "text-slate-400 hover:bg-[#131f37] hover:text-slate-200"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[84px] items-center justify-between border-b border-[#162238] bg-[#0c1424]/60 px-6 sm:px-10">
            <h2 className="text-xl font-bold text-white">My Profile</h2>

            <div className="flex items-center gap-5">
              <Bell size={19} className="text-slate-300" />

              <button
                type="button"
                onClick={openEditor}
                className="flex h-10 items-center gap-2 rounded-xl bg-[#00e5ff] px-4 text-xs font-bold text-[#080d1a]"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10">
            {message && (
              <p className="mb-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-200">
                {message}
              </p>
            )}

            <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#1d2d4a] bg-[#0c1424] shadow-xl">
              <div className="h-36 bg-gradient-to-r from-cyan-950/60 via-[#0e213b] to-indigo-950/50" />

              <div className="relative px-6 pb-6 sm:px-8">
                <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-[#0c1424] bg-cyan-500/20 text-3xl font-bold text-[#00e5ff]">
                      {getInitials(profile.name)}
                    </div>

                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        {profile.name || "Your Name"}
                      </h1>

                      <p className="text-sm text-[#00e5ff]">
                        {profile.headline || "Add a professional headline"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {profile.location || "Add location"}
                        </span>

                        <span className="mx-2 text-slate-600">•</span>

                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {profile.email}
                        </span>

                        <span className="mx-2 text-slate-600">•</span>

                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {profile.phone || "Add phone"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {profile.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center gap-2 rounded-xl border border-[#1d2d4a] bg-[#101a2e] px-4 text-xs font-semibold text-slate-200 hover:border-cyan-500/40"
                    >
                      <ExternalLink size={15} />
                      Open Resume
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr]">
              <div className="space-y-8">
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <h3 className="mb-4 text-base font-semibold text-white">
                    About Me
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-400">
                    {profile.about || "Add information about yourself."}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <h3 className="mb-5 text-base font-semibold text-white">
                    Work Experience
                  </h3>

                  {experience.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No work experience added yet.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {experience.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 border-b border-[#162238] pb-6 last:border-0"
                        >
                          <Briefcase className="mt-1 text-[#00e5ff]" size={18} />

                          <div>
                            <h4 className="text-sm font-semibold text-white">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-400">
                              {item.company}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
                  <h3 className="mb-5 text-base font-semibold text-white">
                    Education
                  </h3>

                  {education.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No education added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {education.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <GraduationCap
                            className="mt-1 text-teal-400"
                            size={18}
                          />

                          <div>
                            <h4 className="text-sm font-semibold text-white">
                              {item.degree}
                            </h4>

                            <p className="text-xs text-slate-400">
                              {item.institution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-[#0c1424] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#00e5ff]">
                      <Sparkles size={14} />
                      Profile Strength
                    </span>

                    <span className="text-xs font-bold text-white">
                      {profileStrength}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#18263f]">
                    <div
                      className="h-full rounded-full bg-[#00e5ff]"
                      style={{ width: `${profileStrength}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-5">
                  <h3 className="mb-4 text-sm font-semibold text-white">
                    Skills & Technologies
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        Add your skills from Edit Profile.
                      </p>
                    ) : (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-[#1e2f4e] bg-[#090f1d] px-3 py-1.5 text-xs text-slate-300"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
          <form
            onSubmit={saveProfile}
            className="mx-auto my-8 w-full max-w-2xl rounded-2xl border border-[#1e2f4e] bg-[#0c1424] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                name="name"
                value={form.name || ""}
                onChange={updateField}
                placeholder="Full name"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />

              <input
                name="email"
                value={form.email || ""}
                onChange={updateField}
                placeholder="Email"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />

              <input
                name="headline"
                value={form.headline || ""}
                onChange={updateField}
                placeholder="Professional headline"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />

              <input
                name="location"
                value={form.location || ""}
                onChange={updateField}
                placeholder="Location"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />

              <input
                name="phone"
                value={form.phone || ""}
                onChange={updateField}
                placeholder="Phone"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />

              <input
                name="resume"
                value={form.resume || ""}
                onChange={updateField}
                placeholder="Resume link"
                className="rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
              />
            </div>

            <textarea
              name="about"
              value={form.about || ""}
              onChange={updateField}
              placeholder="About yourself"
              className="mt-4 min-h-28 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
            />

            <input
              name="skillsText"
              value={form.skillsText || ""}
              onChange={updateField}
              placeholder="Skills separated by commas: React, Node.js, MongoDB"
              className="mt-4 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] p-3 text-sm outline-none"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-[#1e2f4e] px-5 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#00e5ff] px-5 py-2 text-sm font-bold text-[#080d1a]"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}