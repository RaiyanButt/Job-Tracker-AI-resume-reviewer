import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
      default: "Saved",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
      index: true,
    },

    stage: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },

    details: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

JobSchema.index({ company: 1 });
JobSchema.index({ updatedAt: -1 });

const Job = mongoose.model("Job", JobSchema);
export default Job;