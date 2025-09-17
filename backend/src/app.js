import express from "express";
import cors from "cors";
import path from "path";
import jobsRoutes from "./routes/jobsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json({ limit: "1mb" }));

app.use("/api/jobs", jobsRoutes);
app.use("/api/ai", aiRoutes);

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
