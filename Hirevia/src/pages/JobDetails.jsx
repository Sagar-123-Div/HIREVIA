import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";
import { applyToJob } from "../Service/applicationService";
import { formatSalary } from "../utils/formatSalary";

const API_URL = "http://localhost:5000/api/jobs";

function formatDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString();
}

function DetailSection({ title, content }) {
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const items = Array.isArray(content) ? content : [content];
  return (
    <section className="rounded-2xl border border-[#162238] bg-[#0c1424] p-6">
      <h2 className="mb-4 text-base font-semibold text-white">{title}</h2>
      <ul className="space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            {typeof item === "string" ? item : item?.name || item?.title || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </section>
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
    if (initialJob && typeof initialJob === "object") {
      return;
    }

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
    const result = await applyToJob(jobId);
    setApplyMessage(result.message);
    if (result.success) setAppliedJobId(jobId);
    setApplying(false);
  }

  const company = job?.postedBy?.name
    || (typeof job?.company === "string" ? job.company : job?.company?.name)
    || "Company not specified";
  const isApplied = appliedJobId === jobId;
  const skills = job?.skills || job?.requiredSkills;

  return (
    <main className="min-h-screen bg-[#080d1a] px-5 py-8 font-sans text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-[#00e5ff]"
        >
          <ArrowLeft size={17} /> Back
        </button>

        {loading && <p className="py-12 text-center text-cyan-400">Loading job details...</p>}
        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" role="alert">{error}</p>}

        {!loading && job && (
          <>
            <section className="mb-6 rounded-2xl border border-[#1d2d4a] bg-gradient-to-b from-[#101a2e] to-[#0c1424] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#00e5ff]">{company}</p>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{job.title || "Job details"}</h1>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-2"><MapPin size={16} />{job.location || "Location not specified"}</span>
                    <span className="inline-flex items-center gap-2"><Briefcase size={16} />{job.jobType || job.type || "Job type not specified"}</span>
                    <span className="inline-flex items-center gap-1"><IndianRupee size={15} />{formatSalary(job.salary)}</span>
                    {job.experience && <span>Experience: {job.experience}</span>}
                  </div>
                </div>
                {isApplied ? (
                  <span className="w-fit rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold capitalize text-[#00e5ff]">
                    Application: {application?.status || "pending"}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="rounded-xl bg-[#00e5ff] px-6 py-3 text-sm font-bold text-[#080d1a] transition hover:bg-[#33ebff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )}
              </div>

              {applyMessage && (
                <p className="mt-5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200" role="status">
                  {applyMessage}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#1d2d4a] pt-5 text-xs text-slate-400">
                {job.openings != null && <span className="inline-flex items-center gap-2"><Users size={15} />{job.openings} opening{job.openings === 1 ? "" : "s"}</span>}
                {formatDate(job.createdAt || job.postedAt) && <span className="inline-flex items-center gap-2"><Calendar size={15} />Posted {formatDate(job.createdAt || job.postedAt)}</span>}
                {formatDate(job.deadline || job.applicationDeadline) && <span>Apply by {formatDate(job.deadline || job.applicationDeadline)}</span>}
              </div>
            </section>

            <div className="grid gap-5">
              <DetailSection title="Job description" content={job.description} />
              <DetailSection title="Responsibilities" content={job.responsibilities} />
              <DetailSection title="Requirements" content={job.requirements || job.qualifications} />
              <DetailSection title="Skills" content={skills} />
              <DetailSection title="Benefits" content={job.benefits} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
