import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/", createOrder);
router.get("/", protectAdmin, getOrders);
router.patch("/:id/status", protectAdmin, updateOrderStatus);
export default router;
