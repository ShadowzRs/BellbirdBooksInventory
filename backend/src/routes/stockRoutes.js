const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
  addStock,
  searchStock,
  getAllStock,
  updateStock,
  removeStock,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/all", authenticateToken, getAllStock); // Get ALL list
router.get("/", authenticateToken, searchStock); // Search/filter stock
router.post("/", authenticateToken, addStock); // Add stock
router.put("/:id", authenticateToken, updateStock); // Update stock
router.delete("/:id", authenticateToken, removeStock); // remove stock

module.exports = router;
