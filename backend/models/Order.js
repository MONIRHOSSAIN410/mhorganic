import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, default: "" },
  qty: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  note: { type: String, default: "" },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ["Cash on Delivery"], default: "Cash on Delivery" },
  status: { type: String, enum: ["Pending", "Confirmed", "Processing", "Delivered", "Cancelled"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
