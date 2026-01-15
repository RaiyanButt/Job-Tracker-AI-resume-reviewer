import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import jobsRoutes from "./routes/jobsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { connectDB } from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadRoutes);


app.get("/health", (_, res) => res.send("ok"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  );
}

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server started on PORT:", PORT);
  });
});
