const bcrypt = require("bcryptjs");

const db = require("../database/database");

// CREATE USER
function createUser(req, res) {
  const { username, password, first_name, last_name, role } = req.body;

  if (!username || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const selectedRole = role || "bookseller";

  if (!["admin", "manager", "bookseller"].includes(selectedRole)) {
    return res.status(400).json({
      message: "Invalid user role",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const statement = db.prepare(`
      INSERT INTO users
      (username, password, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      username,
      hashedPassword,
      first_name,
      last_name,
      selectedRole,
    );

    res.status(201).json({
      message: "User created",
      user_id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);

    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
    });
  }
}

// GET ALL USERS
function getAllUsers(req, res) {
  try {
    const statement = db.prepare(`
      SELECT
        user_id,
        username,
        first_name,
        last_name,
        role
      FROM users
      ORDER BY user_id ASC, last_name ASC
    `);

    const users = statement.all();

    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error.message);

    res.status(500).json({
      message: "Failed to retrieve users",
    });
  }
}

// GET ONE USER
function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const statement = db.prepare(`
      SELECT
        user_id,
        username,
        first_name,
        last_name,
        role
      FROM users
      WHERE user_id = ?
    `);

    const user = statement.get(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error.message);

    res.status(500).json({
      message: "Failed to retrieve user",
    });
  }
}

// UPDATE USER
function updateUser(req, res) {
  const userId = req.params.id;

  const { username, password, first_name, last_name, role } = req.body;

  if (!username || !first_name || !last_name || !role) {
    return res.status(400).json({
      message: "Username, first name, last name and role are required",
    });
  }

  if (!["admin", "manager", "bookseller"].includes(role)) {
    return res.status(400).json({
      message: "Invalid user role",
    });
  }

  try {
    // Check whether the user exists
    const existingUser = db
      .prepare(
        `
      SELECT *
      FROM users
      WHERE user_id = ?
    `,
      )
      .get(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check whether another user already has this username
    const usernameTaken = db
      .prepare(
        `
      SELECT user_id
      FROM users
      WHERE username = ?
      AND user_id != ?
    `,
      )
      .get(username, userId);

    if (usernameTaken) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    let statement;
    let result;

    // If password was provided, update it too
    if (password && password.trim()) {
      const hashedPassword = bcrypt.hashSync(password, 10);

      statement = db.prepare(`
        UPDATE users
        SET
          username = ?,
          password = ?,
          first_name = ?,
          last_name = ?,
          role = ?
        WHERE user_id = ?
      `);

      result = statement.run(
        username,
        hashedPassword,
        first_name,
        last_name,
        role,
        userId,
      );
    } else {
      // Keep the existing password
      statement = db.prepare(`
        UPDATE users
        SET
          username = ?,
          first_name = ?,
          last_name = ?,
          role = ?
        WHERE user_id = ?
      `);

      result = statement.run(username, first_name, last_name, role, userId);
    }

    if (result.changes === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error.message);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
}

// DELETE USER
function deleteUser(req, res) {
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (Number(userId) === req.user.user_id) {
    return res.status(400).json({
      message: "You cannot delete your own account",
    });
  }

  try {
    const statement = db.prepare(`
      DELETE FROM users
      WHERE user_id = ?
    `);

    const result = statement.run(userId);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
