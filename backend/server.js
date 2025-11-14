const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { connectDB, checkDatabaseHealth, getDatabaseStats } = require("./config/database");

const app = express();

// Trust proxy for Railway (required for rate limiting behind proxy)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());

// CORS configuration - Allow Netlify frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://life-info-tracker.netlify.app",
  "http://localhost:3000",
  "http://localhost:8080",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", limiter);

// Root health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Life Info Tracker API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const dbStats = await getDatabaseStats();

    res.json({
      status: "OK",
      database: dbHealth,
      stats: dbStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/blueprint", require("./routes/blueprint"));
app.use("/api/daily-logs", require("./routes/dailyLogs"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/ai", require("./routes/ai"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

