import express from "express";
import jobsRoutes from "./routes/jobsRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";  
import path from "path";         

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if(process.env.NODE_ENV !== "production") {
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
}
app.use(express.json({ limit: "1mb" }));

app.use(rateLimiter);

app.use("/api/jobs", jobsRoutes);


app.use("/api/ai", aiRoutes);                

app.use(express.static(path.join(__dirname,"../frontend/dist")));

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  });
}
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
