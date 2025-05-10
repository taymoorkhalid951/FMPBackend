const express = require("express");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected: Create, Update, Delete
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

// Public: Browse Services
router.get("/", getServices);
router.get("/:id", getServiceById);

module.exports = router;
