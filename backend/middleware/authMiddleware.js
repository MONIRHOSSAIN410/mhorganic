import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function protectAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Admin login required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Admin account not found" });
    req.admin = { id: admin._id, name: admin.name, email: admin.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}
