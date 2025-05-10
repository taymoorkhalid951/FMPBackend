const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrdersAsSeller,
  getOrderById,
  cancelOrder,
  markDelivered,
  markCompleted,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/seller-orders", protect, getOrdersAsSeller);
router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/deliver", protect, markDelivered);
router.put("/:id/complete", protect, markCompleted);

module.exports = router;
