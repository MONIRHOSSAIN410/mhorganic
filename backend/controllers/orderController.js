import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, note = "", items } = req.body;
  if (!customerName?.trim() || !phone?.trim() || !address?.trim()) {
    return res.status(400).json({ message: "Name, phone, and delivery address are required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your basket is empty" });
  }

  const normalized = [];
  let total = 0;
  for (const item of items) {
    if (!mongoose.isValidObjectId(item.productId) || !Number.isInteger(Number(item.qty)) || Number(item.qty) < 1) {
      return res.status(400).json({ message: "Invalid product or quantity in basket" });
    }
    const product = await Product.findById(item.productId);
    if (!product) return res.status(400).json({ message: "A product in your basket no longer exists" });
    const qty = Number(item.qty);
    if (product.stock < qty) return res.status(400).json({ message: `${product.name} has only ${product.stock} items in stock` });
    normalized.push({ product: product._id, name: product.name, image: product.image, price: product.price, unit: product.unit, qty });
    total += product.price * qty;
  }

  const order = await Order.create({
    customerName: customerName.trim(), phone: phone.trim(), address: address.trim(),
    note: String(note).trim(), items: normalized, total, paymentMethod: "Cash on Delivery"
  });

  for (const item of normalized) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }
  res.status(201).json({ message: "Order placed successfully", order });
});

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(500);
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const allowed = ["Pending", "Confirmed", "Processing", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ order });
});
