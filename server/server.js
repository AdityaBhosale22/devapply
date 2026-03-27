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

dotenv.config();

const app = express();

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devapply-rouge.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

/* routes */
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("DevApply backend running");
});

app.get("/api/protected", requireAuthMiddleware, (req, res) => {
  try {
    const { userId } = req.auth();

    res.json({
      success: true,
      userId,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

app.use("/api/resume", resumeRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/project-bullets", projectBulletsRoutes);
app.use("/api/job-fit", jobFitRoutes);

connectDB();

export default app;