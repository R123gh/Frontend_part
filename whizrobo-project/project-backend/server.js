const express = require("express");
const path = require("path");
const app = require("./src/app");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing.");
}
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET is too weak for production. Use at least 32 characters.");
}

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes("*")) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV !== "production" && localDevOriginPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked for this origin"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_GLOBAL_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
});

const ragLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_RAG_MAX || 120),
  standardHeaders: true,
  legacyHeaders: false,
});

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(globalLimiter);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authLimiter, authRoutes);
const ragRoutes = require("./routes/rag");
app.use("/api/rag", ragLimiter, ragRoutes);

app.get("/", (req, res) => {
  res.send("running");
});


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
