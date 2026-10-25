import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "organic-store-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch((err) => { console.error("Failed to start API:", err.message); process.exit(1); });
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Organic Store API!", status: "active" });
});