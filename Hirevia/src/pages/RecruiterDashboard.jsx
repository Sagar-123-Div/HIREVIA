import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Check,
  ChevronLeft,
  ClipboardList,
  Edit3,
  Eye,
  LogOut,
  MapPin,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { loginUser } from "../Service/Login";
import {
  createRecruiterJob,
  deleteRecruiterJob,
  getRecruiterApplications,
  getRecruiterJobs,
  updateRecruiterJob,
  updateRecruiterApplicationStatus,
} from "../Service/recruiterService";
import { getRoleGroup, getStoredUser } from "../utils/authRole";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  jobType: "",
  salary: "",
  experience: "",
  openings: "",
  description: "",
  requirements: "",
  benefits: "",
};

const jobTypes = ["Full Time", "Part Time", "Internship", "Contract", "Remote"];

function getId(value) {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return String(value._id || value.id || "");
}

function toJobForm(job) {
  return {
    title: job.title || "",
    company: typeof job.company === "string" ? job.company : job.company?.name || "",
    location: job.location || "",
    jobType: job.jobType || job.type || "",
    salary: job.salary ?? "",
    experience: job.experience || "",
    openings: job.openings ?? "",
    description: job.description || "",
    requirements: Array.isArray(job.requirements)
      ? job.requirements.join("\n")
      : job.requirements || job.qualifications || "",
    benefits: Array.isArray(job.benefits)
      ? job.benefits.join("\n")
      : job.benefits || "",
  };
}

function toJobPayload(form) {
  return {
    ...form,
    salary: form.salary === "" ? "" : Number(form.salary),
    openings: form.openings === "" ? undefined : Number(form.openings),
    requirements: form.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    benefits: form.benefits
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function getApplicationApplicant(application) {
  const applicant = application.applicant || application.user || application.candidate;
  return typeof applicant === "string"
    ? applicant
    : applicant?.name || applicant?.fullName || applicant?.email || "Applicant";
}

function getApplicationJob(application) {
  const job = application.job || application.jobId;
  return typeof job === "string" ? job : job?.title || "Job";
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem("token")) && getRoleGroup() === "recruiter"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [user, setUser] = useState(getStoredUser);
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [applicationsLoading, setApplicationsLoading] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [jobsError, setJobsError] = useState("");
  const [applicationsError, setApplicationsError] = useState("");
  const [form, setForm] = useState(emptyJob);
  const [editingJobId, setEditingJobId] = useState("");
  const [savingJob, setSavingJob] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState("");
  const [updatingApplicationId, setUpdatingApplicationId] = useState("");
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  async function loadJobs() {
    setJobsLoading(true);
    setJobsError("");
    try {
      setJobs(await getRecruiterJobs());
    } catch (error) {
      setJobsError(error.message);
    } finally {
      setJobsLoading(false);
    }
  }

  async function loadApplications() {
    setApplicationsLoading(true);
    setApplicationsError("");
    try {
      setApplications(await getRecruiterApplications());
    } catch (error) {
      setApplicationsError(error.message);
    } finally {
      setApplicationsLoading(false);
    }
  }

  useEffect(() => {
    if (!authenticated) return;

    let ignore = false;
    getRecruiterJobs()
      .then((items) => {
        if (!ignore) {
          setJobs(items);
          setJobsError("");
        }
      })
      .catch((error) => {
        if (!ignore) setJobsError(error.message);
      })
      .finally(() => {
        if (!ignore) setJobsLoading(false);
      });

    getRecruiterApplications()
      .then((items) => {
        if (!ignore) {
          setApplications(items);
          setApplicationsError("");
        }
      })
      .catch((error) => {
        if (!ignore) setApplicationsError(error.message);
      })
      .finally(() => {
        if (!ignore) setApplicationsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [authenticated]);

  useEffect(() => {
    if (localStorage.getItem("token") && getRoleGroup() === "candidate") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const result = await loginUser(email, password);
    if (!result.success) {
      setLoginError(result.message);
      setLoginLoading(false);
      return;
    }
    if (!result.token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoginError("The login response did not include an authentication token.");
      setLoginLoading(false);
      return;
    }
    if (getRoleGroup(result.user) !== "recruiter") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoginError("This is not a recruiter account. Please use the job seeker sign in.");
      setLoginLoading(false);
      return;
    }

    setUser(result.user || null);
    setJobsLoading(true);
    setApplicationsLoading(true);
    setAuthenticated(true);
    setPassword("");
    setLoginLoading(false);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthenticated(false);
    setUser(null);
    setJobs([]);
    setApplications([]);
    setNotice("");
    setActionError("");
  }

  function startCreate() {
    setEditingJobId("");
    setForm({ ...emptyJob });
    setNotice("");
    setActionError("");
    setActiveTab("jobs");
    document.getElementById("job-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function startEdit(job) {
    setEditingJobId(getId(job));
    setForm(toJobForm(job));
    setNotice("");
    setActionError("");
    document.getElementById("job-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleJobSubmit(event) {
    event.preventDefault();
    setSavingJob(true);
    setNotice("");
    setActionError("");

    try {
      const payload = toJobPayload(form);
      if (editingJobId) {
        await updateRecruiterJob(editingJobId, payload);
        setNotice("Job updated successfully.");
      } else {
        await createRecruiterJob(payload);
        setNotice("Job posted successfully.");
      }
      setForm({ ...emptyJob });
      setEditingJobId("");
      await loadJobs();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setSavingJob(false);
    }
  }

  async function handleApplicationStatus(application, status) {
    const applicationId = getId(application);
    if (!applicationId) {
      setActionError("This application does not include an ID and cannot be updated.");
      return;
    }

    setUpdatingApplicationId(applicationId);
    setNotice("");
    setActionError("");
    try {
      const updated = await updateRecruiterApplicationStatus(applicationId, status);
      const updatedApplication = {
        ...application,
        ...(updated?.application || updated),
        status,
      };
      setApplications((current) =>
        current.map((item) =>
          getId(item) === applicationId
            ? updatedApplication
            : item
        )
      );
      setSelectedApplication(updatedApplication);
      setNotice(status === "considered" ? "Applicant marked as considered." : "Application rejected.");
    } catch (error) {
      setActionError(error.message);
    } finally {
      setUpdatingApplicationId("");
    }
  }

  async function handleDelete(job) {
    const jobId = getId(job);
    if (!jobId || !window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingJobId(jobId);
    setNotice("");
    setActionError("");
    try {
      await deleteRecruiterJob(jobId);
      setJobs((current) => current.filter((item) => getId(item) !== jobId));
      if (editingJobId === jobId) {
        setEditingJobId("");
        setForm({ ...emptyJob });
      }
      setNotice("Job deleted successfully.");
    } catch (error) {
      setActionError(error.message);
    } finally {
      setDeletingJobId("");
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d1a] px-4 py-10 text-slate-100">
        <section className="w-full max-w-md rounded-3xl border border-[#1d2d4a] bg-[#0c1424] p-7 shadow-2xl shadow-cyan-950/20 sm:p-9">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
          >
            <ChevronLeft size={17} /> Back to Hirevia
          </button>
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            <Building2 size={23} />
          </div>
          <h1 className="text-2xl font-bold text-white">Recruiter sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in with the recruiter credentials configured by your Hirevia administrator.
          </p>

          {loginError && (
            <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300" role="alert">
              {loginError}
            </p>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-300" htmlFor="recruiter-email">
              Email
              <input
                id="recruiter-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#1e2f4e] bg-[#080f1d] px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="recruiter@company.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300" htmlFor="recruiter-password">
              Password
              <input
                id="recruiter-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#1e2f4e] bg-[#080f1d] px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="Enter your password"
              />
            </label>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-[#080d1a] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginLoading ? "Signing in..." : "Sign in to recruiter portal"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Looking for work?{" "}
            <button type="button" onClick={() => navigate("/login")} className="font-semibold text-cyan-300 hover:text-cyan-200">
              Job seeker sign in
            </button>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d1a] font-sans text-slate-100">
      <header className="border-b border-[#162238] bg-[#0c1424]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-white">HIREVIA</p>
              <p className="text-xs text-slate-400">Recruiter portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm text-slate-400 sm:inline">
              {user?.name || user?.email || "Recruiter"}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1e2f4e] px-3 py-2 text-sm text-slate-300 transition hover:border-rose-500/40 hover:text-rose-300"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Employer workspace</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Recruiter dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Publish roles and keep track of the people applying.</p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#080d1a] transition hover:bg-cyan-300"
          >
            <Plus size={18} /> Post a job
          </button>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Your job listings</p>
              <Briefcase className="text-cyan-300" size={19} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{jobs.length}</p>
          </div>
          <div className="rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Applications received</p>
              <Users className="text-cyan-300" size={19} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{applications.length}</p>
          </div>
        </div>

        {(notice || actionError) && (
          <div
            className={`mb-6 flex items-start gap-2 rounded-xl border p-4 text-sm ${
              actionError
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
            role={actionError ? "alert" : "status"}
          >
            {actionError ? <X size={17} /> : <Check size={17} />}
            {actionError || notice}
          </div>
        )}

        <div className="mb-5 flex gap-2 border-b border-[#162238]">
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "jobs" ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase size={16} /> Jobs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "applications" ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardList size={16} /> Applications
          </button>
        </div>

        {activeTab === "jobs" && (
          <section className="space-y-4">
            {jobsLoading && <p className="py-6 text-sm text-slate-400">Loading jobs...</p>}
            {!jobsLoading && jobsError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300" role="alert">
                {jobsError}
                <button type="button" onClick={loadJobs} className="ml-3 font-semibold underline">Try again</button>
              </div>
            )}
            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#263958] bg-[#0c1424] px-6 py-10 text-center">
                <Briefcase className="mx-auto mb-3 text-slate-500" size={25} />
                <p className="font-semibold text-white">No jobs posted yet</p>
                <p className="mt-1 text-sm text-slate-400">Create your first listing to start receiving applications.</p>
              </div>
            )}
            {!jobsLoading && jobs.map((job) => {
              const jobId = getId(job);
              return (
                <article key={jobId || job.title} className="rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-white">{job.title || "Untitled job"}</h2>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                        {(job.company?.name || job.company || job.postedBy?.name) && (
                          <span className="inline-flex items-center gap-2"><Building2 size={15} />{job.company?.name || job.company || job.postedBy?.name}</span>
                        )}
                        {job.location && <span className="inline-flex items-center gap-2"><MapPin size={15} />{job.location}</span>}
                        {(job.jobType || job.type) && <span>{job.jobType || job.type}</span>}
                      </div>
                      {job.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">{job.description}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/25 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                      >
                        <Eye size={14} /> View job
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(job)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#263958] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job)}
                        disabled={deletingJobId === jobId}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> {deletingJobId === jobId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {activeTab === "applications" && (
          <section className="space-y-3">
            {applicationsLoading && <p className="py-6 text-sm text-slate-400">Loading applications...</p>}
            {!applicationsLoading && applicationsError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300" role="alert">
                {applicationsError}
                <button type="button" onClick={loadApplications} className="ml-3 font-semibold underline">Try again</button>
              </div>
            )}
            {!applicationsLoading && !applicationsError && applications.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#263958] bg-[#0c1424] px-6 py-10 text-center">
                <Users className="mx-auto mb-3 text-slate-500" size={25} />
                <p className="font-semibold text-white">No applications yet</p>
                <p className="mt-1 text-sm text-slate-400">Applications for your job listings will appear here.</p>
              </div>
            )}
            {!applicationsLoading && applications.map((application, index) => {
              const applicationId = getId(application);
              const status = String(application.status || "pending").toLowerCase();
              const isUpdating = updatingApplicationId === applicationId;
              return (
              <article
                key={applicationId || `${getApplicationJob(application)}-${index}`}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{getApplicationApplicant(application)}</p>
                  <p className="mt-1 text-sm text-slate-400">Applied for {getApplicationJob(application)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(application)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/25 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                  >
                    <Eye size={14} /> View application
                  </button>
                  {application.createdAt && (
                    <span className="text-xs text-slate-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                    status === "rejected"
                      ? "border-rose-500/25 bg-rose-500/10 text-rose-300"
                      : status === "considered"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                        : "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
                  }`}>
                    {status}
                  </span>
                  {status !== "considered" && status !== "rejected" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApplicationStatus(application, "considered")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        <ThumbsUp size={14} /> {isUpdating ? "Saving..." : "Consider"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplicationStatus(application, "rejected")}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                      >
                        <ThumbsDown size={14} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
            })}
          </section>
        )}

        {activeTab === "jobs" && (
          <section id="job-form" className="mt-10 rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{editingJobId ? "Update listing" : "New listing"}</p>
                <h2 className="mt-1 text-xl font-bold text-white">{editingJobId ? "Edit job details" : "Post a job"}</h2>
              </div>
              {editingJobId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingJobId("");
                    setForm({ ...emptyJob });
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-[#15213a] hover:text-white"
                  aria-label="Cancel editing"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleJobSubmit} className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "title", label: "Job title", required: true },
                { name: "company", label: "Company name" },
                { name: "location", label: "Location", required: true },
                { name: "jobType", label: "Job type", required: true, placeholder: "Full-time, contract, remote..." },
                { name: "salary", label: "Salary", type: "number", min: "0" },
                { name: "experience", label: "Experience" },
                { name: "openings", label: "Openings", type: "number", min: "1" },
              ].map((field) => (
                <label key={field.name} className="text-sm font-medium text-slate-300" htmlFor={`job-${field.name}`}>
                  {field.label}{field.required && <span className="text-cyan-300"> *</span>}
                  {field.name === "jobType" ? (
                    <select
                      id={`job-${field.name}`}
                      name={field.name}
                      required={field.required}
                      value={form[field.name]}
                      onChange={updateField}
                      className="mt-2 w-full rounded-xl border border-[#1e2f4e] bg-[#080f1d] px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    >
                      <option value="" disabled>Select a job type</option>
                      {jobTypes.map((jobType) => (
                        <option key={jobType} value={jobType} className="bg-[#080f1d]">
                          {jobType}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`job-${field.name}`}
                      name={field.name}
                      type={field.type || "text"}
                      min={field.min}
                      required={field.required}
                      value={form[field.name]}
                      onChange={updateField}
                      placeholder={field.placeholder || field.label}
                      className="mt-2 w-full rounded-xl border border-[#1e2f4e] bg-[#080f1d] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    />
                  )}
                </label>
              ))}
              {[
                { name: "description", label: "Description", required: true },
                { name: "requirements", label: "Requirements", placeholder: "Add one item per line" },
                { name: "benefits", label: "Benefits", placeholder: "Add one item per line" },
              ].map((field) => (
                <label key={field.name} className="text-sm font-medium text-slate-300 sm:col-span-2" htmlFor={`job-${field.name}`}>
                  {field.label}{field.required && <span className="text-cyan-300"> *</span>}
                  <textarea
                    id={`job-${field.name}`}
                    name={field.name}
                    required={field.required}
                    rows={field.name === "description" ? 4 : 3}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder || field.label}
                    className="mt-2 w-full resize-y rounded-xl border border-[#1e2f4e] bg-[#080f1d] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                  />
                </label>
              ))}
              <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
                <button
                  type="submit"
                  disabled={savingJob}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#080d1a] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingJobId ? <Check size={16} /> : <Plus size={17} />}
                  {savingJob ? "Saving..." : editingJobId ? "Save changes" : "Publish job"}
                </button>
              </div>
            </form>
          </section>
        )}

        {(selectedJob || selectedApplication) && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/80 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedJob(null);
                setSelectedApplication(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="recruiter-detail-title"
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#263958] bg-[#0b1425] shadow-2xl shadow-black/50"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#20314e] bg-[#0b1425]/95 p-5 backdrop-blur sm:p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                    {selectedJob ? "Job preview" : "Application review"}
                  </p>
                  <h2 id="recruiter-detail-title" className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    {selectedJob?.title || getApplicationApplicant(selectedApplication || {})}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(null);
                    setSelectedApplication(null);
                  }}
                  className="rounded-xl border border-[#263958] p-2 text-slate-400 transition hover:bg-[#15213a] hover:text-white"
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
              </div>

              {selectedJob && (
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {[
                      selectedJob.company?.name || selectedJob.company || selectedJob.postedBy?.name,
                      selectedJob.location,
                      selectedJob.jobType || selectedJob.type,
                      selectedJob.experience,
                    ].filter(Boolean).map((value) => (
                      <span key={value} className="rounded-full border border-[#263958] bg-[#101b30] px-3 py-1.5 text-xs text-slate-300">
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Salary", selectedJob.salary],
                      ["Openings", selectedJob.openings],
                      ["Posted", selectedJob.createdAt || selectedJob.postedAt
                        ? new Date(selectedJob.createdAt || selectedJob.postedAt).toLocaleDateString()
                        : ""],
                      ["Deadline", selectedJob.deadline || selectedJob.applicationDeadline
                        ? new Date(selectedJob.deadline || selectedJob.applicationDeadline).toLocaleDateString()
                        : ""],
                    ].filter(([, value]) => value != null && value !== "").map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-200">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                  {[
                    ["Description", selectedJob.description],
                    ["Responsibilities", selectedJob.responsibilities],
                    ["Requirements", selectedJob.requirements || selectedJob.qualifications],
                    ["Skills", selectedJob.skills || selectedJob.requiredSkills],
                    ["Benefits", selectedJob.benefits],
                  ].filter(([, value]) => value && (!Array.isArray(value) || value.length > 0)).map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                      <h3 className="text-sm font-semibold text-white">{label}</h3>
                      {Array.isArray(value) ? (
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                          {value.map((item, index) => (
                            <li key={`${label}-${index}`} className="flex gap-2">
                              <span className="text-cyan-300">•</span>
                              <span>{typeof item === "string" ? item : item?.name || item?.title || JSON.stringify(item)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedApplication && (() => {
                const applicant = selectedApplication.applicant || selectedApplication.user || selectedApplication.candidate;
                const applicantEmail = typeof applicant === "object"
                  ? applicant?.email
                  : selectedApplication.email;
                const applicantPhone = typeof applicant === "object"
                  ? applicant?.phone || applicant?.phoneNumber
                  : selectedApplication.phone;
                const resume = selectedApplication.resume || selectedApplication.resumeUrl;
                const applicationStatus = String(selectedApplication.status || "pending").toLowerCase();
                const applicationId = getId(selectedApplication);
                const isUpdating = updatingApplicationId === applicationId;

                return (
                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-[#101b30] p-5">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Applied for</p>
                      <p className="mt-1 text-lg font-bold text-white">{getApplicationJob(selectedApplication)}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {selectedApplication.createdAt
                          ? `Received ${new Date(selectedApplication.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`
                          : "Application received"}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                        <p className="text-xs text-slate-500">Applicant</p>
                        <p className="mt-1 font-semibold text-white">{getApplicationApplicant(selectedApplication)}</p>
                      </div>
                      <div className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                        <p className="text-xs text-slate-500">Current status</p>
                        <p className="mt-1 font-semibold capitalize text-cyan-200">{applicationStatus}</p>
                      </div>
                      {applicantEmail && (
                        <div className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                          <p className="text-xs text-slate-500">Email</p>
                          <a href={`mailto:${applicantEmail}`} className="mt-1 block break-all text-sm font-medium text-cyan-200 hover:text-cyan-100">
                            {applicantEmail}
                          </a>
                        </div>
                      )}
                      {applicantPhone && (
                        <div className="rounded-xl border border-[#20314e] bg-[#0e192c] p-4">
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="mt-1 text-sm font-medium text-slate-200">{applicantPhone}</p>
                        </div>
                      )}
                    </div>

                    {resume && (
                      <a
                        href={resume}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-4 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4 transition hover:bg-cyan-500/10"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-white">Applicant resume</span>
                          <span className="mt-1 block text-xs text-slate-400">Opens in a new tab</span>
                        </span>
                        <Eye size={18} className="shrink-0 text-cyan-300" />
                      </a>
                    )}

                    {applicationStatus !== "considered" && applicationStatus !== "rejected" && (
                      <div className="flex flex-col gap-3 border-t border-[#20314e] pt-5 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleApplicationStatus(selectedApplication, "considered")}
                          disabled={isUpdating}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#07120d] transition hover:bg-emerald-300 disabled:opacity-50"
                        >
                          <ThumbsUp size={16} /> {isUpdating ? "Saving..." : "Mark considered"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplicationStatus(selectedApplication, "rejected")}
                          disabled={isUpdating}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                        >
                          <ThumbsDown size={16} /> Reject application
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
