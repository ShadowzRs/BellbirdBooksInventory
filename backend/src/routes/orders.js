const express = require("express");
const router = express.Router();
const db = require("../db");

// STORY: Record a customer order
// Saves a new order when the bookseller submits the "New Order" form
router.post("/", (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    contact_preference,
    book_title,
    book_author,
    quantity,
  } = req.body;

  // Check each required field one at a time, to provide specific error messages
  if (!first_name || first_name.trim() === "") {
    return res.status(400).json({ error: "Please enter the customer's first name." });
  }
  if (!last_name || last_name.trim() === "") {
    return res.status(400).json({ error: "Please enter the customer's last name." });
  }

  const cleanedFirstName = first_name.trim().toUpperCase();
  const cleanedLastName = last_name.trim().toUpperCase();

  if (!phone_number || phone_number.trim() === "") {
    return res.status(400).json({ error: "Please enter a phone number." });
  }

  const digitsOnly = phone_number.replace(/\D/g, "");
  if (digitsOnly.length !== 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit phone number." });
  }

  if (!["call", "text"].includes(contact_preference)) {
    return res.status(400).json({ error: "Please select a contact preference." });
  }

  if (!book_title || book_title.trim() === "") {
    return res.status(400).json({ error: "Please enter the book title." });
  }

  const cleanedTitle = book_title.trim();
  const trimmedAuthor = book_author ? book_author.trim() : "";
  const cleanedAuthor = trimmedAuthor !== "" ? trimmedAuthor : null;

  const quantityNumber = Number(quantity);
  if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
    return res.status(400).json({ error: "Please enter a valid quantity of at least 1." });
  }

  const sql = `
    INSERT INTO orders (first_name, last_name, phone_number, contact_preference, book_title, book_author, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [cleanedFirstName, cleanedLastName, digitsOnly, contact_preference, cleanedTitle, cleanedAuthor, quantityNumber],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Order could not be saved right now, please try again later." });
      }
      res.json({ message: "Order saved successfully.", orderId: this.lastID });
    }
  );
});

// STORY: Search for a customer order
// Finds orders by exact order id, or partial customer name / book title
router.get("/search", (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Please enter a name, book title, or order number to search." });
  }

  const searchTerm = q.trim();

  // Order id must be digits only — no letters, symbols, or +/- signs
  const isOrderId = /^[0-9]+$/.test(searchTerm);

  let sql;
  let params;

  if (isOrderId) {
    // GROUP 1: exact order id search
    sql = `SELECT * FROM orders WHERE id = ? ORDER BY created_at DESC`;
    params = [Number(searchTerm)];
  } else {
    // GROUP 2: customer name or book title — full or partial, case-insensitive
    const likeTerm = `%${searchTerm}%`;
    sql = `
      SELECT * FROM orders
      WHERE first_name LIKE ? COLLATE NOCASE
         OR last_name LIKE ? COLLATE NOCASE
         OR (first_name || ' ' || last_name) LIKE ? COLLATE NOCASE
         OR book_title LIKE ? COLLATE NOCASE
      ORDER BY created_at DESC
    `;
    params = [likeTerm, likeTerm, likeTerm];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Search could not be completed right now, please try again later." });
    }
    res.json(rows);
  });
});

module.exports = router;