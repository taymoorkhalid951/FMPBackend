const express = require("express");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", protect, getMyNotifications);

// Mark a notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", protect, markAllAsRead);

module.exports = router;
