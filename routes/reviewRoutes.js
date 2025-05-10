// routes/reviewRoutes.js
const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getAverageAndReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.get("/:type/:targetId", getAverageAndReviews); // type: service | buyer

module.exports = router;
