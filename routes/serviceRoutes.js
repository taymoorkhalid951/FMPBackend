const express = require("express");
const upload = require("../middleware/upload");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByUserId,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected: Create, Update, Delete
router.post("/", upload.array("images"), protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

// Public: Browse Services
router.get("/", getServices);
router.get("/user/:userId", getServicesByUserId);
router.get("/:id", getServiceById);

module.exports = router;
