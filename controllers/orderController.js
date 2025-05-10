const Order = require("../models/Order");
const Service = require("../models/Service");

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (String(service.seller) === String(req.user._id)) {
      return res.status(400).json({ message: "Cannot order your own service" });
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + service.deliveryTime);

    const order = await Order.create({
      service: service._id,
      seller: service.seller,
      buyer: req.user._id,
      price: service.price,
      deliveryDate,
      status: "in_progress",
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// Get buyer's orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("service")
      .populate("seller", "name email");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Get seller's orders
exports.getOrdersAsSeller = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("service")
      .populate("buyer", "name email");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Get single order
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("service")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      String(order.buyer) !== String(req.user._id) &&
      String(order.seller) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// Buyer cancels order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.buyer) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only buyer can cancel this order" });
    }

    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled" });
  } catch (err) {
    next(err);
  }
};

// Seller marks as delivered
exports.markDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.seller) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only seller can mark as delivered" });
    }

    if (order.status !== "in_progress") {
      return res.status(400).json({ message: "Order not in progress" });
    }

    order.status = "delivered";
    await order.save();
    res.json({ message: "Order marked as delivered" });
  } catch (err) {
    next(err);
  }
};

// Buyer marks as completed
exports.markCompleted = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.buyer) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only buyer can complete the order" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order must be delivered first" });
    }

    order.status = "completed";
    await order.save();
    res.json({ message: "Order marked as completed" });
  } catch (err) {
    next(err);
  }
};
