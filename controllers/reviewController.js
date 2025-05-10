// controllers/reviewController.js
const Review = require("../models/Review");
const Order = require("../models/Order");

exports.createReview = async (req, res, next) => {
  try {
    const { type, target, order, rating, comment } = req.body;

    const existingOrder = await Order.findById(order);
    if (!existingOrder || existingOrder.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Order not found or not completed" });
    }

    const isReviewerValid =
      (type === "service" &&
        String(existingOrder.buyer) === String(req.user._id)) ||
      (type === "buyer" &&
        String(existingOrder.seller) === String(req.user._id));

    if (!isReviewerValid) {
      return res.status(403).json({ message: "Not authorized to review" });
    }

    const existingReview = await Review.findOne({ order, type });
    if (existingReview)
      return res.status(400).json({ message: "Review already exists" });

    const review = await Review.create({
      type,
      target,
      typeRef: type === "service" ? "Service" : "User",
      reviewer: req.user._id,
      order,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (String(review.reviewer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (String(review.reviewer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getAverageAndReviews = async (req, res, next) => {
  try {
    const { type, targetId } = req.params;

    const reviews = await Review.find({ type, target: targetId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

    res.json({
      average: parseFloat(avgRating.toFixed(2)),
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};
