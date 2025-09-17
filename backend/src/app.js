import express from "express";
import jobsRoutes from "./routes/jobsRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";           

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(rateLimiter);

app.use("/api/jobs", jobsRoutes);


app.use("/api/ai", aiRoutes);                


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
