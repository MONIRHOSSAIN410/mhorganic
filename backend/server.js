import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// ট্রেইলিং স্ল্যাশ ছাড়া সঠিক ফরম্যাটে অরিজিনগুলো দিন
const allowedOrigins = [
  "https://mhorganic-kabv.vercel.app",
  "https://mhorganic-k8gy.vercel.app",
  "https://mhorganic.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // Postman বা server-to-server রিকোয়েস্টের জন্য origin না থাকলে অ্যালাউ করবে
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Organic Store API!", status: "active" });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "organic-store-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`API running on port ${port}`)))
  .catch((err) => { 
    console.error("Failed to start API:", err.message); 
    process.exit(1); 
  });