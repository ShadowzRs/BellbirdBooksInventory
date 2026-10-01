const express = require("express");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();
router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/:id", authenticateToken, requireAdmin, getUserById);
router.post("/", authenticateToken, requireAdmin, createUser);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

module.exports = router;
