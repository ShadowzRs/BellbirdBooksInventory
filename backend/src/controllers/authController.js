const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/database");
const JWT_SECRET = "bellbirdKey";

function login(req, res) {
  const { username, password } = req.body;

  // Check that both fields were provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Find user
  const user = db
    .prepare(
      `
        SELECT *
        FROM users
        WHERE username = ?
    `,
    )
    .get(username);

  // Username doesn't exist
  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  // Compare entered password with hashed password
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  // Create JWT
  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    },
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
  });
}

module.exports = {
  login,
};
