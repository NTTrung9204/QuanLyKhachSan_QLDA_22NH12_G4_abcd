const express = require("express");
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes - anyone can view services
router.get("/", serviceController.getAllServices);
router.get("/price", serviceController.getServicesByPriceRange);
router.get("/:id", serviceController.getService);

// Protected routes - only staff and admin
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo("staff", "admin"));

// Create, update, and delete operations restricted to staff and admin
router.post("/", serviceController.createService);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

module.exports = router;
