import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const STATUS_OPTS = ["saved", "applied", "interview", "offer", "rejected"];
const PRIORITY_OPTS = ["low", "med", "high"];

const CreatePage = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    status: "saved",
    priority: "med",
    stage: "",
    source: "",
    location: "",
    link: "",
    details: "", 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      
      const payload = { ...form, content: form.details };
      await api.post("/jobs", payload);
      toast.success("Application added successfully!");
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error("Slow down! You're adding applications too fast", { duration: 4000, icon: "💀" });
      } else {
        toast.error("Failed to create application");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Applications
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Application</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Title*</span></label>
                    <input
                      type="text"
                      placeholder="Software Developer Intern"
                      className="input input-bordered"
                      value={form.title}
                      onChange={onChange("title")}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text">Company</span></label>
                    <input
                      type="text"
                      placeholder="AMD"
                      className="input input-bordered"
                      value={form.company}
                      onChange={onChange("company")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Status</span></label>
                    <select className="select select-bordered w-full" value={form.status} onChange={onChange("status")}>
                      {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text">Priority</span></label>
                    <select className="select select-bordered w-full" value={form.priority} onChange={onChange("priority")}>
                      {PRIORITY_OPTS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text">Stage</span></label>
                    <input
                      type="text"
                      placeholder="Phone Screen"
                      className="input input-bordered"
                      value={form.stage}
                      onChange={onChange("stage")}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Source</span></label>
                    <input
                      type="text"
                      placeholder="LinkedIn"
                      className="input input-bordered"
                      value={form.source}
                      onChange={onChange("source")}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text">Location</span></label>
                    <input
                      type="text"
                      placeholder="Toronto, ON"
                      className="input input-bordered"
                      value={form.location}
                      onChange={onChange("location")}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text">Job Link</span></label>
                    <input
                      type="url"
                      placeholder="https://…"
                      className="input input-bordered"
                      value={form.link}
                      onChange={onChange("link")}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Details / Notes</span></label>
                  <textarea
                    placeholder="Notes about the role, prep, interview questions, etc."
                    className="textarea textarea-bordered h-32"
                    value={form.details}
                    onChange={onChange("details")}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
