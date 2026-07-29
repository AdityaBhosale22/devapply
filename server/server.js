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
import debugRoutes from "./routes/debug.routes.js";

dotenv.config();

const app = express();

/* ✅ CORS Configuration */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://devapply-j5fi-qv2ys8xfv-adityas-projects-d7b95a25.vercel.app",
  "https://devapply-j5fi.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/subscription", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activities", activityRoutes);

/* ✅ Health Check */
app.get("/", (req, res) => {
  res.send("DevApply backend running");
});

/* ✅ Protected Test Route */
app.get("/api/protected", requireAuthMiddleware, (req, res) => {
  try {
    // ✅ Clerk Future-Proof Fix
    const { userId } = req.auth();

    res.json({
      success: true,
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

/* ✅ Resume Routes */
app.use("/api/resume", resumeRoutes);

// Optional debug routes — enable by setting ENABLE_DEBUG_ROUTES=true in env
if (process.env.ENABLE_DEBUG_ROUTES === "true") {
  app.use("/api/debug", debugRoutes);
}

/* ✅ Cover Letter Routes */
app.use("/api/cover-letter", coverLetterRoutes);

/* ✅ Project Bullets Routes */
app.use("/api/project-bullets", projectBulletsRoutes);

/* ✅ Job Fit Routes */
app.use("/api/job-fit", jobFitRoutes);

/* ✅ Server Boot */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
