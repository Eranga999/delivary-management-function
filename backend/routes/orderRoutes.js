import express from "express";
import Order from "../models/orderModel.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  checkout,
  getOrders,
  cancelOrder,
  getOrderById,
  generateOrderReport,
  getAllOrders,
  updateOrderStatus,
  getPaidOrdersForDelivery,
} from "../controllers/orderController.js";

const router = express.Router();

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, getOrders);

// @desc    Checkout and place an order
// @route   POST /api/orders/checkout
// @access  Private
router.post("/checkout", protect, checkout);

// @desc    Get user's orders (duplicate route, consider removing or renaming)
// @route   GET /api/orders
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Generate order report
// @route   GET /api/orders/report
// @access  Private
router.get("/report", protect, (req, res) => {
  console.log("Handling /report route");
  return generateOrderReport(req, res);
});

// @desc    Get a single order by ID (alternative route)
// @route   GET /api/orders/order/:id
// @access  Private
router.get("/order/:id", protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all orders (for storekeeper and cashier)
// @route   GET /api/orders/all
// @access  Private
router.get('/all', protect, getAllOrders);

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, getOrderById);

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @desc    Update order status (for cashier)
// @route   PUT /api/orders/:id/status
// @access  Private
router.put('/:id/status', protect, updateOrderStatus);

// @desc    Get user's paid orders for delivery tracking
// @route   GET /api/orders/delivery
// @access  Private
router.get('/delivery', protect, getPaidOrdersForDelivery);

export default router;