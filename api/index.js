import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { requireAuthMiddleware } from "./middlewares/auth.middleware.js";
import resumeRoutes from "./routes/resume.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import coverLetterRoutes from "./routes/coverLetter.routes.js";
import projectBulletsRoutes from "./routes/projectBullets.routes.js";
import jobFitRoutes from "./routes/jobFit.routes.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

/* ✅ CORS Configuration For Vercel & Local */
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

/* ✅ Routes */
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/project-bullets", projectBulletsRoutes);
app.use("/api/job-fit", jobFitRoutes);

/* ✅ Health Check */
app.get("/api/health", (req, res) => {
  res.send("DevApply Serverless API Running 🚀");
});

/* ✅ Protected Test Route */
app.get("/api/protected", requireAuthMiddleware, (req, res) => {
  try {
    const { userId } = req.auth();
    res.json({ success: true, userId });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

/* ✅ Global Error Handler Framework for Production Safety */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Unhandled Error:", err);
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ✅ Initialize DB Connection safely */
connectDB().catch((err) => {
  if (process.env.NODE_ENV !== "production") console.error("DB Boot Error:", err);
});

/* ✅ Exporting 'app' directly for Vercel Serverless environment instead of app.listen() */
export default app;
