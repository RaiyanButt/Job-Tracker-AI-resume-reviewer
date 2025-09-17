import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: ["saved", "applied", "interview", "offer", "rejected"],
      default: "saved",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "med", "high"],
      default: "med",
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
