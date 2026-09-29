const express = require("express");
const { createUser, deleteUser } = require("../controllers/userController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authenticateToken, requireAdmin, createUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

module.exports = router;
