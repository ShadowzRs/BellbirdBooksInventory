const express = require("express");

const { authenticateToken } = require("../middleware/authMiddleware");

const {
  addStock,
  searchStock,
  getAllStock,
} = require("../controllers/stockController");

const router = express.Router();

router.get("/all", authenticateToken, getAllStock); // Get ALL list
router.get("/", authenticateToken, searchStock); // Search/filter stock
router.post("/", authenticateToken, addStock); // Add stock

module.exports = router;
