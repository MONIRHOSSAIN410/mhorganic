import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});
