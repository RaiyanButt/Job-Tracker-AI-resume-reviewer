import { useEffect, useState } from "react";

export default function FilterBar({ value, onChange, locations = [] }) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 250);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="mb-4 bg-base-100 border border-base-content/10 rounded-xl p-3 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="block text-sm text-base-content/70 mb-1">Search</label>
        <input
          className="input input-bordered w-full"
          placeholder="title, company, source, location…"
          value={local.search}
          onChange={(e) => setLocal({ ...local, search: e.target.value })}
        />
      </div>

      <div className="w-full sm:w-44">
        <label className="block text-sm text-base-content/70 mb-1">Status</label>
        <select
          className="select select-bordered w-full"
          value={local.status}
          onChange={(e) => setLocal({ ...local, status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label className="block text-sm text-base-content/70 mb-1">Priority</label>
        <select
          className="select select-bordered w-full"
          value={local.priority}
          onChange={(e) => setLocal({ ...local, priority: e.target.value })}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="med">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="w-full sm:w-56">
        <label className="block text-sm text-base-content/70 mb-1">Location</label>
        <select
          className="select select-bordered w-full"
          value={local.location}
          onChange={(e) => setLocal({ ...local, location: e.target.value })}
        >
          <option value="all">All</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
