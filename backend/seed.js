import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import Product from "./models/Product.js";

const products = [
  ["Karkuma Organic Turmeric", "Organic Spices", 390, "250 gm", "photo-1615485290382-441e4d049cb5", true],
  ["Quinoa (250g)", "Healthy Grains", 275, "250 gm", "photo-1586201375761-83865001e31c", true],
  ["Country Natural Chicken", "Fresh Food", 240, "500 gm", "photo-1604503468506-a8da13d82791", false],
  ["Country Natural Chicken Nuggets", "Frozen Food", 225, "250 gm", "photo-1562967914-608f82629710", false],
  ["Organic Apple Cider Vinegar", "Organic Drinks", 900, "500 ml", "photo-1600185365483-26d7a4cc7519", true],
  ["Karkuma Organic Moringa", "Organic Herbs", 400, "100 gm", "photo-1603048719539-9ecb4aa395e3", false],
  ["Karkuma Organic Beetroot", "Organic Vegetables", 320, "250 gm", "photo-1571771894821-ce9b6c11b08e", false],
  ["Karkuma Garlic Oil", "Organic Oils", 1270, "100 ml", "photo-1474979266404-7eaacbcd87c5", true],
  ["Organic Peanut Butter", "Healthy Snacks", 320, "220 gm", "photo-1589367920969-ab8e050bbb04", false],
  ["KKK Ginger Tea Bags", "Tea & Drinks", 225, "15 bags", "photo-1544787219-7f47ccb76574", false],
  ["KKK Black Tea Bags", "Tea & Drinks", 225, "15 bags", "photo-1597318181409-cf64d0b5d8a2", false],
  ["KKK Premium Black Tea", "Tea & Drinks", 190, "200 gm", "photo-1576092768241-dec231879fc3", true],
  ["Full Cream Milk Powder", "Dairy", 375, "500 gm", "photo-1550583724-b2692b85b150", false],
  ["KKK Masala Tea Bags", "Tea & Drinks", 150, "15 bags", "photo-1571934811356-5cc061b6821f", false],
  ["Organic Green Tea", "Tea & Drinks", 225, "25 bags", "photo-1556679343-c7306c1976bc", true],
  ["KKK Organic Cinnamon", "Organic Spices", 190, "100 gm", "photo-1603905179139-d2e9b2b4b7a2", false],
  ["Chili Powder", "Organic Spices", 230, "250 gm", "photo-1599909533730-f9d5b1c3d6b0", false],
  ["Cumin Powder", "Organic Spices", 230, "250 gm", "photo-1596040033229-a9821ebd058d", false],
  ["Coriander Powder", "Organic Spices", 165, "250 gm", "photo-1599909533730-f9d5b1c3d6b0", false],
  ["Turmeric Powder", "Organic Spices", 180, "250 gm", "photo-1615485290382-441e4d049cb5", true],
  ["Lal Mirch (Chili)", "Organic Spices", 170, "100 gm", "photo-1518977676601-b53f82aba655", false]
].map(([name, category, price, unit, photo, featured]) => ({
  name, category, price, unit, featured, stock: 20,
  image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=80`,
  description: `${name} — carefully selected quality product for your everyday kitchen.`
}));

try {
  await connectDB();
  const email = "admin@organicstore.com";
  const existing = await Admin.findOne({ email });
  if (!existing) await Admin.create({ name: "Store Admin", email, password: await bcrypt.hash("Admin123!", 12) });
  if (await Product.countDocuments() === 0) await Product.insertMany(products);
  console.log("Seed complete. Admin: admin@organicstore.com / Admin123!");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
