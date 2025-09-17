import Job from "../models/Job.js";


export async function getAllJobs(req, res) {
  try {
    const {
      search = "",
      status,
      priority,
      location,
      sort = "updatedAt:desc",
      page = 1,
      limit = 100,
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (location) where.location = new RegExp(location, "i");

    if (search) {
      const q = new RegExp(search.trim(), "i");
      where.$or = [
        { title: q },
        { company: q },
        { source: q },
        { location: q },
        { stage: q },
        { details: q },
        { content: q }, 
      ];
    }

    let sortObj = { updatedAt: -1 };
    if (typeof sort === "string" && sort.includes(":")) {
      const [field, dir] = sort.split(":");
      sortObj = { [field]: dir === "asc" ? 1 : -1 };
    }

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);

    const [items, total] = await Promise.all([
      Job.find(where).sort(sortObj).skip((p - 1) * lim).limit(lim),
      Job.countDocuments(where),
    ]);

    res.status(200).json({ items, total, page: p, limit: lim });
  } catch (error) {
    console.error("Error in getAllJobs controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    console.error("Error in getJobById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createJob(req, res) {
  try {
    const {
      title,
      company = "",
      status = "saved",
      priority = "med",
      stage = "",
      source = "",
      location = "",
      link = "",
      details = "",
      content, 
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company?.trim() ?? "",
      status,
      priority,
      stage: stage?.trim() ?? "",
      source: source?.trim() ?? "",
      location: location?.trim() ?? "",
      link: link?.trim() ?? "",
      details: (details ?? content ?? "").trim(), 
      content: (content ?? details ?? "").trim(), 
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Error in createJob controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateJob(req, res) {
  try {
    const allow = [
      "title",
      "company",
      "status",
      "priority",
      "stage",
      "source",
      "location",
      "link",
      "details",
      "content", 
    ];

    const patch = {};
    for (const k of allow) {
      if (k in req.body) {
        const val = req.body[k];
        patch[k] = typeof val === "string" ? val.trim() : val;
      }
    }

    if ("details" in patch && !("content" in patch)) {
      patch.content = patch.details;
    }
    if ("content" in patch && !("details" in patch)) {
      patch.details = patch.content;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error in updateJob controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteJob(req, res) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJob controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
