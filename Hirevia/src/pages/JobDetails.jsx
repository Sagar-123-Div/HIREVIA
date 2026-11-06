import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { applyToJob } from "../Service/applicationService";
import { formatSalary } from "../utils/formatSalary";
import API_BASE_URL from "../Service/apiConfig";

const API_URL = `${API_BASE_URL}/api/jobs`;

function formatDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function DetailSection({ title, content, number }) {
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const items = Array.isArray(content) ? content : [content];
  return (
    <section className="rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-300">
          {number}
        </span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start gap-3">
            <Check size={16} className="mt-1 shrink-0 text-cyan-300" />
            <span>
              {typeof item === "string"
                ? item
                : item?.name || item?.title || JSON.stringify(item)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function JobFact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#20314e] bg-[#0a1221]/75 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-semibold text-slate-200">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function JobDetails() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialJob = location.state?.job;
  const application = location.state?.application;
  const [loadedJob, setLoadedJob] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedJobId, setAppliedJobId] = useState(
    application?.status ? jobId : ""
  );
  const job = initialJob && typeof initialJob === "object"
    ? initialJob
    : loadedJob?.jobId === jobId
      ? loadedJob.job
      : null;
  const error = loadError?.jobId === jobId ? loadError.message : "";
  const loading = !job && !error;

  useEffect(() => {
    if (initialJob && typeof initialJob === "object") return undefined;

    let ignore = false;
    async function loadJob() {
      try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(jobId)}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not load job details.");
        }
        if (!ignore) setLoadedJob({ jobId, job: data.job || data });
      } catch (loadError) {
        if (!ignore) {
          setLoadError({
            jobId,
            message: loadError.message || "Could not load job details.",
          });
        }
      }
    }

    loadJob();
    return () => {
      ignore = true;
    };
  }, [initialJob, jobId]);

  async function handleApply() {
    if (!jobId || applying) return;
    setApplying(true);
    setApplyMessage("");
    try {
      const result = await applyToJob(jobId);
      setApplyMessage(result.message);
      if (result.success) setAppliedJobId(jobId);
    } finally {
      setApplying(false);
    }
  }

  const company = job?.postedBy?.name
    || (typeof job?.company === "string" ? job.company : job?.company?.name)
    || "Company not specified";
  const isApplied = appliedJobId === jobId;
  const skills = job?.skills || job?.requiredSkills;
  const postedDate = formatDate(job?.createdAt || job?.postedAt);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#10203a_0%,_#080d1a_48%)] px-4 py-6 font-sans text-slate-100 sm:px-7 sm:py-9">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={17} /> Back to jobs
        </button>

        {loading && (
          <div className="rounded-3xl border border-[#1d2d4a] bg-[#0c1424] p-10 text-center text-cyan-300">
            Loading job details...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300" role="alert">
            {error}
          </div>
        )}

        {!loading && job && (
          <>
            <section className="relative mb-6 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#132440] via-[#101b30] to-[#0c1424] p-6 shadow-2xl shadow-cyan-950/20 sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="relative">
                <div className="mb-7 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                    <Sparkles size={14} /> Open opportunity
                  </span>
                  {(job.jobType || job.type) && (
                    <span className="rounded-full border border-[#314260] bg-[#0a1221]/70 px-3 py-1.5 text-xs font-medium text-slate-300">
                      {job.jobType || job.type}
                    </span>
                  )}
                  {postedDate && (
                    <span className="text-xs text-slate-400">Posted {postedDate}</span>
                  )}
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-200 sm:h-16 sm:w-16">
                      <Building2 size={27} />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-2 text-sm font-semibold text-cyan-200">{company}</p>
                      <h1 className="text-2xl font-bold leading-tight text-white sm:text-4xl">
                        {job.title || "Job details"}
                      </h1>
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                        <MapPin size={16} className="shrink-0 text-cyan-300" />
                        {job.location || "Location not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="lg:pb-1">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold capitalize text-emerald-300">
                        <Check size={17} /> Applied · {application?.status || "pending"}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full rounded-xl bg-cyan-300 px-7 py-3.5 text-sm font-bold text-[#07101e] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {applying ? "Applying..." : "Apply for this job"}
                      </button>
                    )}
                  </div>
                </div>

                {applyMessage && (
                  <p
                    className={`mt-5 rounded-xl border p-3 text-sm ${
                      isApplied
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-500/25 bg-rose-500/10 text-rose-200"
                    }`}
                    role={isApplied ? "status" : "alert"}
                  >
                    {applyMessage}
                  </p>
                )}

                <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  <JobFact icon={Briefcase} label="Employment" value={job.jobType || job.type || "Not specified"} />
                  <JobFact icon={Building2} label="Company" value={company} />
                  <JobFact icon={Clock3} label="Experience" value={job.experience || "Not specified"} />
                  <JobFact icon={Users} label="Open positions" value={job.openings ?? "Not specified"} />
                </div>
              </div>
            </section>

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-5">
                <DetailSection number="01" title="About the role" content={job.description} />
                <DetailSection number="02" title="Responsibilities" content={job.responsibilities} />
                <DetailSection number="03" title="What you'll need" content={job.requirements || job.qualifications} />
                <DetailSection number="04" title="Skills" content={skills} />
                <DetailSection number="05" title="Benefits" content={job.benefits} />
              </div>
              <aside className="space-y-4 lg:sticky lg:top-6">
                <section className="rounded-2xl border border-[#1d2d4a] bg-[#0c1424] p-5">
                  <h2 className="text-sm font-semibold text-white">Job overview</h2>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Compensation</p>
                      <p className="mt-1 text-lg font-bold text-cyan-200">{formatSalary(job.salary)}</p>
                    </div>
                    {job.deadline || job.applicationDeadline ? (
                      <div className="flex items-start gap-3 border-t border-[#1d2d4a] pt-4">
                        <Calendar size={17} className="mt-0.5 text-cyan-300" />
                        <div>
                          <p className="text-xs text-slate-500">Apply by</p>
                          <p className="mt-1 text-sm font-medium text-slate-200">
                            {formatDate(job.deadline || job.applicationDeadline)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {postedDate && (
                      <div className="flex items-start gap-3 border-t border-[#1d2d4a] pt-4">
                        <Calendar size={17} className="mt-0.5 text-cyan-300" />
                        <div>
                          <p className="text-xs text-slate-500">Date posted</p>
                          <p className="mt-1 text-sm font-medium text-slate-200">{postedDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
                  <p className="text-sm font-semibold text-white">Interested in this role?</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Submit your application and follow its status from your applications dashboard.
                  </p>
                  {!isApplied && (
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={applying}
                      className="mt-4 w-full rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#07101e] transition hover:bg-cyan-200 disabled:opacity-60"
                    >
                      {applying ? "Applying..." : "Apply now"}
                    </button>
                  )}
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
