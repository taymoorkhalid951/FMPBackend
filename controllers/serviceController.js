const Service = require("../models/Service");

// @desc    Create a service
exports.createService = async (req, res, next) => {
  try {
    const { title, description, category, price, deliveryTime, tags, images } =
      req.body;
    const service = new Service({
      title,
      description,
      category,
      price,
      deliveryTime,
      tags,
      images,
      seller: req.user._id,
    });

    const created = await service.save();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all services with pagination, search, filter
exports.getServices = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
            { tags: { $in: [new RegExp(req.query.keyword, "i")] } },
          ],
        }
      : {};

    const filters = {
      ...keyword,
      price: {
        ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
        ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
      },
    };

    const total = await Service.countDocuments(filters);
    const services = await Service.find(filters)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      services,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "seller",
      "name email"
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (String(service.seller) !== String(req.user._id))
      return res
        .status(403)
        .json({ message: "Not authorized to update this service" });

    const updates = req.body;
    Object.assign(service, updates);
    const updated = await service.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (String(service.seller) !== String(req.user._id))
      return res
        .status(403)
        .json({ message: "Not authorized to delete this service" });

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};
