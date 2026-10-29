import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  "https://mhorganic-7ubl.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean),
];

// CORS Middleware (একবারই কনফিগার করা হলো)
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin.replace(/\/+$/, ""))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Organic Store API!",
    status: "active",
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "organic-store-api",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

// Start server
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
      console.log("Allowed frontend origins:", allowedOrigins);
    });
  })
  .catch((err) => {
    console.error("Failed to start API:", err.message);
    process.exit(1);
  });

export default app;