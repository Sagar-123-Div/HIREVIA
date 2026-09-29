// Reusable Job Card - Home page aur Dashboards dono mein use hoga
// Props se data aata hai, isme koi API call nahi hai (dumb/presentational component)

export default function JobCard({ job }) {
  return (
    <div
      onClick={() => { window.location.href = `/jobs/${job._id}`; }}
      role="link"
      tabIndex={0}
      className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
      <p className="text-slate-600">{job.companyName}</p>

      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
        <span>{job.location}</span>
        <span>•</span>
        <span>{job.type}</span> {/* Full-time / Part-time / Remote */}
      </div>

      <p className="mt-3 font-semibold text-blue-600">
        {job.salary ? `₹${job.salary}` : 'Salary not disclosed'}
      </p>
    </div>
  );
}