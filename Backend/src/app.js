import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : [process.env.CORS_ORIGIN];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});



import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import csabRoutes from "./routes/csab.routes.js";
import verifierRoutes from "./routes/verifer.routes.js";
import accountancyRoutes from "./routes/accountancy.routes.js";
import adminRoutes from "./routes/admin.routes.js"

app.use("/api/accountancy", accountancyRoutes);
app.use("/api/verifier", verifierRoutes);
app.use("/api/admin/csab", csabRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);



export { app };
