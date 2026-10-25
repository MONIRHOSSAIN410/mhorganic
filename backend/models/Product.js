import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, default: "Organic Food" },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0, default: null },
  unit: { type: String, default: "250 gm", trim: true },
  image: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  stock: { type: Number, default: 20, min: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
