import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const STATUS_OPTS = ["saved", "applied", "interview", "offer", "rejected"];
const PRIORITY_OPTS = ["low", "med", "high"];

const JobDetailPage = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob({
          _id: data._id,
          title: data.title ?? "",
          company: data.company ?? "",
          status: data.status ?? "saved",
          priority: data.priority ?? "med",
          stage: data.stage ?? "",
          source: data.source ?? "",
          location: data.location ?? "",
          link: data.link ?? "",
          details: data.details ?? data.content ?? "",   
        });
      } catch (error) {
        console.log("Error in fetching job", error);
        toast.error("Failed to fetch the job");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const onChange = (k) => (e) => setJob((j) => ({ ...j, [k]: e.target.value }));

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the job:", error);
      toast.error("Failed to delete job");
    }
  };

  const handleSave = async () => {
    if (!job.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...job, content: job.details };
      await api.put(`/jobs/${id}`, payload);
      toast.success("Job updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the job:", error);
      toast.error("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Jobs
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Job
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body space-y-4">
              <h2 className="card-title text-2xl">Edit Application</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Title*</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={job.title}
                    onChange={onChange("title")}
                    placeholder="Software Developer Intern"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Company</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={job.company}
                    onChange={onChange("company")}
                    placeholder="AMD"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Status</span></label>
                  <select className="select select-bordered w-full" value={job.status} onChange={onChange("status")}>
                    {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Priority</span></label>
                  <select className="select select-bordered w-full" value={job.priority} onChange={onChange("priority")}>
                    {PRIORITY_OPTS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Stage</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={job.stage}
                    onChange={onChange("stage")}
                    placeholder="Phone Screen"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Source</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={job.source}
                    onChange={onChange("source")}
                    placeholder="LinkedIn"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Location</span></label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={job.location}
                    onChange={onChange("location")}
                    placeholder="Toronto, ON"
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Job Link</span></label>
                  <input
                    type="url"
                    className="input input-bordered"
                    value={job.link}
                    onChange={onChange("link")}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Details / Notes</span></label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  value={job.details}
                  onChange={onChange("details")}
                  placeholder="Notes about the role, prep, interview questions, etc."
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default JobDetailPage;
