import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import JobsNotFound from "../components/JobsNotFound";
import FilterBar from "../components/Filterbar.jsx";
import JobsTable from "../components/JobsTable.jsx";

const DEFAULT_FILTERS = { search: "", status: "all", priority: "all", location: "all" };
const DEFAULT_SORT = { field: "updatedAt", dir: "desc" };

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        console.log("API /jobs response:", res.data);

        const arr = Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.jobs)
          ? res.data.jobs
          : [];

        setJobs(arr);
        setIsRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load jobs");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = Array.isArray(jobs) ? jobs : [];
    return list.filter((j) => {
      const matchesSearch =
        q === "" ||
        [j.title, j.company, j.source, j.location, j.stage]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesStatus = filters.status === "all" || j.status === filters.status;
      const matchesPriority = filters.priority === "all" || j.priority === filters.priority;
      const matchesLocation =
        filters.location === "all" ||
        (j.location || "").toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesLocation;
    });
  }, [jobs, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const { field, dir } = sort;
      const A = a?.[field] ?? "";
      const B = b?.[field] ?? "";
      if (field === "updatedAt" || field === "createdAt") {
        const da = new Date(A).getTime() || 0;
        const db = new Date(B).getTime() || 0;
        return dir === "asc" ? da - db : db - da;
      }
      const sa = String(A).toLowerCase();
      const sb = String(B).toLowerCase();
      if (sa < sb) return dir === "asc" ? -1 : 1;
      if (sa > sb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading jobs...</div>}

        {!loading && !isRateLimited && (
          <>
            <FilterBar
              value={filters}
              onChange={setFilters}
              locations={[
                ...new Set(
                  (Array.isArray(jobs) ? jobs : [])
                    .map((j) => j.location)
                    .filter(Boolean)
                ),
              ]}
            />

            {sorted.length === 0 ? (
              <JobsNotFound />
            ) : (
              <JobsTable
                jobs={sorted}
                sort={sort}
                onSort={setSort}
                onDeleteLocal={(id) => setJobs((prev) => prev.filter((j) => j._id !== id))}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
