import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Heart,
  User,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Eye,
  Shield,
  CreditCard,
  Trash2,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
  { name: "Find Jobs", icon: Search, active: false, path: "/find-job" },
  { name: "My Applications", icon: FileText, active: false, path: "/my-applications" },
  { name: "Saved Jobs", icon: Heart, active: false, path: "/saved-jobs" },
  { name: "Profile", icon: User, active: false, path: "/profile" },
  { name: "Settings", icon: SettingsIcon, active: true, path: "/settings" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // Toggle states
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    marketingEmails: false,
    publicProfile: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <h2 className="text-xl font-bold tracking-tight text-white">Account Settings</h2>
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

          <section className="mx-auto max-w-[1200px] px-6 py-8 sm:px-10">
            {/* Tabs */}
            <div className="mb-8 flex flex-wrap gap-2 border-b border-[#162238] pb-4">
              {[
                { id: "account", label: "General & Account", icon: User },
                { id: "security", label: "Security & Password", icon: Lock },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "privacy", label: "Privacy & Visibility", icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                      activeTab === tab.id
                        ? "border border-cyan-500/30 bg-cyan-500/10 text-[#00e5ff]"
                        : "text-slate-400 hover:bg-[#0c1424] hover:text-slate-200"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Account Settings Content */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 sm:p-8">
                  <h3 className="text-base font-semibold text-white">Personal Information</h3>
                  <p className="mt-1 text-xs text-slate-400">Update your personal and contact details.</p>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Aman Verma"
                        className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        defaultValue="aman.verma@example.com"
                        className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">Current Location</label>
                      <input
                        type="text"
                        defaultValue="Bangalore, Karnataka, India"
                        className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button className="h-10 rounded-xl bg-[#00e5ff] px-6 text-xs font-bold text-[#080d1a] shadow-[0_0_20px_rgba(0,229,255,0.25)] transition hover:bg-[#33ebff]">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8">
                  <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Permanently delete your account and all associated application history.
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400">This action is irreversible.</span>
                    <button className="flex h-10 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-xs font-bold text-red-400 transition hover:bg-red-500/20">
                      <Trash2 size={15} /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 sm:p-8">
                <h3 className="text-base font-semibold text-white">Change Password</h3>
                <p className="mt-1 text-xs text-slate-400">Ensure your account is protected with a strong password.</p>

                <div className="mt-6 max-w-md space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-300">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-300">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="h-11 w-full rounded-xl border border-[#1e2f4e] bg-[#090f1d] px-4 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button className="h-10 rounded-xl bg-[#00e5ff] px-6 text-xs font-bold text-[#080d1a] shadow-[0_0_20px_rgba(0,229,255,0.25)] transition hover:bg-[#33ebff]">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 sm:p-8">
                <h3 className="text-base font-semibold text-white">Notification Preferences</h3>
                <p className="mt-1 text-xs text-slate-400">Choose how and when Hirevia contacts you.</p>

                <div className="mt-6 divide-y divide-[#162238]">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Recommended Job Alerts</h4>
                      <p className="text-xs text-slate-400">Receive daily emails with curated jobs matching your skills.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("jobAlerts")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.jobAlerts ? "bg-[#00e5ff]" : "bg-[#1e2f4e]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-[#080d1a] transition-transform ${
                          notifications.jobAlerts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Application Status Updates</h4>
                      <p className="text-xs text-slate-400">Get notified when a recruiter reviews or responds to your application.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("applicationUpdates")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.applicationUpdates ? "bg-[#00e5ff]" : "bg-[#1e2f4e]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-[#080d1a] transition-transform ${
                          notifications.applicationUpdates ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Product Updates & Marketing</h4>
                      <p className="text-xs text-slate-400">News about feature drops and career growth tips.</p>
                    </div>
                    <button
                      onClick={() => toggleNotification("marketingEmails")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.marketingEmails ? "bg-[#00e5ff]" : "bg-[#1e2f4e]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-[#080d1a] transition-transform ${
                          notifications.marketingEmails ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6 sm:p-8">
                <h3 className="text-base font-semibold text-white">Profile Visibility</h3>
                <p className="mt-1 text-xs text-slate-400">Manage how recruiters discover your profile.</p>

                <div className="mt-6 flex items-center justify-between border-b border-[#162238] pb-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Public Recruiter Search</h4>
                    <p className="text-xs text-slate-400">Allow verified companies to view your profile and contact you directly.</p>
                  </div>
                  <button
                    onClick={() => toggleNotification("publicProfile")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.publicProfile ? "bg-[#00e5ff]" : "bg-[#1e2f4e]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#080d1a] transition-transform ${
                        notifications.publicProfile ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}