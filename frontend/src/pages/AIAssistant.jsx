import { useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

export default function AIAssistant() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [output, setOutput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("aiPrefill");
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      if (p.resume) setResumeText(p.resume);
      if (p.job) setJobText(p.job);
    } catch {}
    localStorage.removeItem("aiPrefill");
  }, []);

  const onUploadPDF = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF too large (max 5MB)");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setFileName(file.name);
    setOutput("");
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:5001/api/uploads/resume", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(message || "Upload failed");
      }

      const data = await res.json();
      setResumeText(data.text || "");
      toast.success("Resume text extracted");
    } catch (err) {
      toast.error(err.message || "Failed to read PDF");
      setFileName("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onGenerate = async () => {
    if (!resumeText.trim()) {
      toast.error("Paste your resume text or upload a PDF first");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const { data } = await api.post("/ai/review", {
        resume: resumeText,
        job: jobText,
      });
      setOutput(data.text || "");
    } catch {
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="btn btn-ghost">
            <ArrowLeftIcon className="size-5" />
            Back to Applications
          </Link>
          <div className="text-sm opacity-70">Mode: <span className="font-semibold">Resume Review</span></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title">Your Resume</h2>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Upload PDF (optional)</span>
                  {fileName && <span className="label-text-alt">{fileName}</span>}
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={onUploadPDF}
                  disabled={uploading}
                />
              </label>

              <textarea
                className="textarea textarea-bordered mt-3 min-h-48"
                placeholder="Or paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />

              <h3 className="card-title mt-4">Job Posting (optional)</h3>
              <textarea
                className="textarea textarea-bordered min-h-40"
                placeholder="Paste a job description to tailor ATS keywords and rewrites…"
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />

              <button
                className={`btn btn-primary mt-4 ${loading || uploading ? "btn-disabled" : ""}`}
                onClick={onGenerate}
              >
                {loading ? "Generating…" : "Generate Review"}
              </button>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Output</h2>
                <button className="btn btn-ghost btn-sm" onClick={onCopy} disabled={!output}>
                  Copy
                </button>
              </div>

              {output ? (
                <div className="prose max-w-none whitespace-pre-wrap">{output}</div>
              ) : (
                <p className="text-base-content/70">
                  Upload a PDF or paste your resume text, optionally add a job post, then click <b>Generate Review</b>.
                  You’ll get: <i>Top 5 Fixes</i>, <i>ATS Keywords</i>, and <i>3 Rewritten Bullets</i>.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs opacity-70">
          Tip: when you like the output, copy it into a job’s <em>details</em> so you keep everything in one place.
        </p>
      </div>
    </div>
  );
}
