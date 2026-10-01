const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  createOrder,
  searchOrders,
  getOutstandingOrders,
  updateOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/", authenticateToken, createOrder); // Create a new order
router.get("/search", authenticateToken, searchOrders); // Search for customer order
router.get("/outstanding", authenticateToken, getOutstandingOrders); // Get outstanding orders
router.put("/:id", authenticateToken, updateOrder); // Update an existing order

module.exports = router;
