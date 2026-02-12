import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { requireAuthMiddleware } from "./middlewares/auth.middleware.js";
import resumeRoutes from "./routes/resume.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Allow your React app's URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed actions
  credentials: true // Allow cookies/authorization headers
}));
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
  res.send("DevApply backend running");
});

/* 🔐 Protected test route */
app.get("/api/protected", requireAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    userId: req.auth.userId,
  });
});

app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
