const bcrypt = require("bcryptjs");
const db = require("../database/database");

function createUser(req, res) {
  const { username, password, first_name, last_name, role } = req.body;

  if (!username || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "All fields are required",
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
      role || "user",
    );

    res.status(201).json({
      message: "User created",
      user_id: result.lastInsertRowid,
    });
  } catch (error) {
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

function deleteUser(req, res) {
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (Number(userId) === req.user.user_id) {
    return res.status(400).json({
      message: "You cannot delete your own account",
    });
  }

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
}

module.exports = {
  createUser,
  deleteUser,
};
