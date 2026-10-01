const db = require("../database/database");

// Create a new customer order
function createOrder(req, res) {
  const {
    first_name,
    last_name,
    phone_number,
    contact_preference,
    book_title,
    book_author,
    quantity,
  } = req.body;

  // Validate first name
  if (!first_name || first_name.trim() === "") {
    return res.status(400).json({
      message: "Please enter the customer's first name.",
    });
  }

  // Validate last name
  if (!last_name || last_name.trim() === "") {
    return res.status(400).json({
      message: "Please enter the customer's last name.",
    });
  }

  const cleanedFirstName = first_name.trim().toUpperCase();
  const cleanedLastName = last_name.trim().toUpperCase();

  // Validate phone number
  if (!phone_number || phone_number.trim() === "") {
    return res.status(400).json({
      message: "Please enter a phone number.",
    });
  }

  // Remove spaces, brackets, dashes, etc.
  const digitsOnly = phone_number.replace(/\D/g, "");

  if (digitsOnly.length !== 10) {
    return res.status(400).json({
      message: "Please enter a valid 10-digit phone number.",
    });
  }

  // Validate contact preference
  if (!["call", "text"].includes(contact_preference)) {
    return res.status(400).json({
      message: "Please select a contact preference.",
    });
  }

  // Validate book title
  if (!book_title || book_title.trim() === "") {
    return res.status(400).json({
      message: "Please enter the book title.",
    });
  }

  const cleanedTitle = book_title.trim();

  // Book author is optional
  const trimmedAuthor = book_author ? book_author.trim() : "";

  const cleanedAuthor = trimmedAuthor !== "" ? trimmedAuthor : null;

  // Validate quantity
  const quantityNumber = Number(quantity);

  if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
    return res.status(400).json({
      message: "Please enter a valid quantity of at least 1.",
    });
  }

  try {
    const sql = `
      INSERT INTO orders (
        first_name,
        last_name,
        phone_number,
        contact_preference,
        book_title,
        book_author,
        quantity
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const statement = db.prepare(sql);

    const result = statement.run(
      cleanedFirstName,
      cleanedLastName,
      digitsOnly,
      contact_preference,
      cleanedTitle,
      cleanedAuthor,
      quantityNumber,
    );

    return res.status(201).json({
      message: "Order saved successfully.",
      orderId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Order could not be saved right now. Please try again later.",
    });
  }
}

// Search for customer orders
function searchOrders(req, res) {
  const { q } = req.query;

  try {
    // If no search term is provided, return all orders
    if (!q || !q.trim()) {
      const orders = db
        .prepare(
          `
          SELECT *
          FROM orders
          ORDER BY id ASC
        `,
        )
        .all();

      return res.status(200).json({
        orders,
      });
    }

    const searchTerm = q.trim();

    // Check whether the search is an order ID
    const isOrderId = /^[0-9]+$/.test(searchTerm);

    let rows;

    if (isOrderId) {
      // Search by exact order ID
      const sql = `
        SELECT *
        FROM orders
        WHERE id = ?
        ORDER BY created_at DESC
      `;

      const statement = db.prepare(sql);
      rows = statement.all(Number(searchTerm));
    } else {
      // Search by customer name or book title
      const likeTerm = `%${searchTerm}%`;

      const sql = `
        SELECT *
        FROM orders
        WHERE first_name LIKE ? COLLATE NOCASE
           OR last_name LIKE ? COLLATE NOCASE
           OR (first_name || ' ' || last_name) LIKE ? COLLATE NOCASE
           OR book_title LIKE ? COLLATE NOCASE
        ORDER BY created_at DESC
      `;

      const statement = db.prepare(sql);
      rows = statement.all(likeTerm, likeTerm, likeTerm, likeTerm);
    }

    return res.status(200).json({
      orders: rows,
    });
  } catch (error) {
    console.error("Search orders error:", error);

    return res.status(500).json({
      message:
        "Search could not be completed right now. Please try again later.",
    });
  }
}

// Get all outstanding customer orders
function getOutstandingOrders(req, res) {
  try {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        phone_number,
        contact_preference,
        book_title,
        book_author,
        quantity,
        status,
        created_at
      FROM orders
      WHERE status NOT IN ('collected', 'cancelled')
      ORDER BY created_at DESC
    `;

    const statement = db.prepare(sql);

    const orders = statement.all();

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get outstanding orders error:", error);

    return res.status(500).json({
      message:
        "Outstanding orders could not be loaded right now. Please try again later.",
    });
  }
}

// Update an existing customer order
function updateOrder(req, res) {
  const { id } = req.params;

  const {
    first_name,
    last_name,
    phone_number,
    contact_preference,
    book_title,
    book_author,
    quantity,
    status,
  } = req.body;

  // Check order ID
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      message: "Invalid order ID.",
    });
  }

  // Required first name
  if (!first_name || first_name.trim() === "") {
    return res.status(400).json({
      message: "Please enter the customer's first name.",
      field: "first_name",
    });
  }

  // Required last name
  if (!last_name || last_name.trim() === "") {
    return res.status(400).json({
      message: "Please enter the customer's last name.",
      field: "last_name",
    });
  }

  // Required phone number
  if (!phone_number || phone_number.trim() === "") {
    return res.status(400).json({
      message: "Please enter a phone number.",
      field: "phone_number",
    });
  }

  const digitsOnly = phone_number.replace(/\D/g, "");

  if (digitsOnly.length !== 10) {
    return res.status(400).json({
      message: "Please enter a valid 10-digit phone number.",
      field: "phone_number",
    });
  }

  // Required contact preference
  if (!["call", "text"].includes(contact_preference)) {
    return res.status(400).json({
      message: "Please select a contact preference.",
      field: "contact_preference",
    });
  }

  // Required book title
  if (!book_title || book_title.trim() === "") {
    return res.status(400).json({
      message: "Please enter the book title.",
      field: "book_title",
    });
  }

  // Required quantity
  const quantityNumber = Number(quantity);

  if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
    return res.status(400).json({
      message: "Please enter a valid quantity of at least 1.",
      field: "quantity",
    });
  }

  // Validate status
  if (!["unfulfilled", "collected", "cancelled"].includes(status)) {
    return res.status(400).json({
      message: "Invalid order status.",
      field: "status",
    });
  }

  const cleanedFirstName = first_name.trim().toUpperCase();
  const cleanedLastName = last_name.trim().toUpperCase();
  const cleanedTitle = book_title.trim();
  const trimmedAuthor = book_author ? book_author.trim() : "";
  const cleanedAuthor = trimmedAuthor !== "" ? trimmedAuthor : null;

  try {
    // Check that the order exists
    const existingOrder = db
      .prepare("SELECT id FROM orders WHERE id = ?")
      .get(orderId);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const sql = `
      UPDATE orders
      SET
        first_name = ?,
        last_name = ?,
        phone_number = ?,
        contact_preference = ?,
        book_title = ?,
        book_author = ?,
        quantity = ?,
        status = ?
      WHERE id = ?
    `;

    const statement = db.prepare(sql);

    const result = statement.run(
      cleanedFirstName,
      cleanedLastName,
      digitsOnly,
      contact_preference,
      cleanedTitle,
      cleanedAuthor,
      quantityNumber,
      status,
      orderId,
    );

    return res.status(200).json({
      message: "Order updated successfully.",
      orderId,
      changes: result.changes,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      message: "Order could not be updated right now. Please try again later.",
    });
  }
}

module.exports = {
  createOrder,
  searchOrders,
  getOutstandingOrders,
  updateOrder,
};
