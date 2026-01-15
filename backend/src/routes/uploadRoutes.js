import { Router } from "express";
import multer from "multer";
import { createRequire } from "module";
import requireAuth from "../middleware/requireAuth.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file?.mimetype === "application/pdf" ||
      (file?.originalname || "").toLowerCase().endsWith(".pdf");
    cb(ok ? null : new Error("Only PDF files are allowed"), ok);
  },
});

router.post("/resume", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let data;
    try {
      data = await pdfParse(req.file.buffer);
    } catch (e) {
      return res.status(400).json({
        message: "Failed to parse PDF",
        detail: String(e?.message || e),
      });
    }

    const text = String(data?.text || "").replace(/\s+/g, " ").trim();

    if (!text) {
      return res.status(400).json({
        message: "No selectable text found in PDF",
        detail: "This PDF may be scanned, image-based, or protected.",
      });
    }

    return res.json({ text });
  } catch (e) {
    return res.status(500).json({ message: "Upload failed", detail: String(e?.message || e) });
  }
});

export default router;
