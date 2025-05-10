// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["service", "buyer"],
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // serviceId or buyerId
      refPath: "typeRef",
    },
    typeRef: {
      type: String,
      required: true,
      enum: ["Service", "User"],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
