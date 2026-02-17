import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { requireAuthMiddleware } from "./middlewares/auth.middleware.js";
import resumeRoutes from "./routes/resume.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

dotenv.config();

const app = express();

/* ✅ CORS Configuration */
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/subscription", subscriptionRoutes);

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

/* ✅ Server Boot */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
