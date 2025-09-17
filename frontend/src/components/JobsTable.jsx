import { Trash2, ExternalLink, Pencil } from "lucide-react";
import { useNavigate } from "react-router";           
import api from "../lib/axios";
import toast from "react-hot-toast";

const STATUS_TONE = {
  saved: "badge-ghost",
  applied: "badge-info",
  interview: "badge-warning",
  offer: "badge-success",
  rejected: "badge-error",
};

function StatusPill({ status }) {
  const c = STATUS_TONE[status] || "badge-ghost";
  return <span className={`badge ${c} capitalize`}>{status || "unknown"}</span>;
}

function HeaderCell({ label, field, sort, onSort, className = "" }) {
  const active = sort.field === field;
  const nextDir = !active ? "desc" : sort.dir === "desc" ? "asc" : "desc";
  return (
    <th
      className={`cursor-pointer select-none ${className}`}
      onClick={() => onSort({ field, dir: nextDir })}
      title={`Sort by ${label}`}
    >
      <div className="inline-flex items-center gap-1">
        <span>{label}</span>
        {active && <span className="text-xs opacity-70">{sort.dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}

export default function JobsTable({ jobs, sort, onSort, onDeleteLocal }) {
  const navigate = useNavigate();                     

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      onDeleteLocal(id);
      toast.success("Job deleted");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-base-content/10 bg-base-100">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <HeaderCell label="Title" field="title" sort={sort} onSort={onSort} className="min-w-[220px]" />
            <HeaderCell label="Company" field="company" sort={sort} onSort={onSort} />
            <HeaderCell label="Status" field="status" sort={sort} onSort={onSort} />
            <HeaderCell label="Priority" field="priority" sort={sort} onSort={onSort} /> 
            <HeaderCell label="Stage" field="stage" sort={sort} onSort={onSort} />
            <HeaderCell label="Source" field="source" sort={sort} onSort={onSort} />
            <HeaderCell label="Location" field="location" sort={sort} onSort={onSort} />
            <HeaderCell label="Updated" field="updatedAt" sort={sort} onSort={onSort} />
            <th className="text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j._id} className="hover">
              <td className="whitespace-nowrap">
                <div className="font-medium">{j.title}</div>
                <div className="text-xs opacity-70">{j._id}</div>
              </td>
              <td className="whitespace-nowrap">{j.company || "-"}</td>
              <td><StatusPill status={j.status} /></td>
              <td className="whitespace-nowrap capitalize">{j.priority || "-"}</td> 
              <td className="whitespace-nowrap">{j.stage || "-"}</td>
              <td className="whitespace-nowrap">{j.source || "-"}</td>
              <td className="whitespace-nowrap">{j.location || "-"}</td>
              <td className="whitespace-nowrap">
                {j.updatedAt ? new Date(j.updatedAt).toLocaleDateString() : "-"}
              </td>
              <td className="text-right">
                <div className="inline-flex gap-2">
                  {j.link && (
                    <a
                      href={j.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs"
                      title="Open job link"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button
                    className="btn btn-ghost btn-xs"
                    title="Edit"
                    onClick={() => navigate(`/job/${j._id}`)}   
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    title="Delete"
                    onClick={() => handleDelete(j._id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
