const db = require("../database/database");

// ADD STOCK
// STORY: ADD new book to stock
// STORY: ADD second-hand book to stock
const addStock = (req, res) => {
  const {
    title,
    author,
    type,
    section,
    shelf_location,
    quantity,
    condition,
    price,
  } = req.body;

  if (!title || !author || !type || !section || price === undefined) {
    return res.status(400).json({
      message: "Title, author, type, section and price are required",
    });
  }

  try {
    const statement = db.prepare(`
            INSERT INTO stock (
                title,
                author,
                type,
                section,
                shelf_location,
                quantity,
                condition,
                price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

    const result = statement.run(
      title,
      author,
      type,
      section,
      shelf_location || null,
      quantity ?? null,
      condition || null,
      price,
    );

    res.status(201).json({
      message: "Stock added successfully",
      stock_id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error adding stock:", error.message);

    res.status(500).json({
      message: "Failed to add stock",
    });
  }
};

// SEARCH STOCK
// STORY: Search stock by title/author
// STORY: List and filter stock by section

const searchStock = (req, res) => {
  const { q, section } = req.query;

  try {
    let query = `
      SELECT *
      FROM stock
      WHERE 1 = 1
    `;

    const parameters = [];

    if (q && q.trim()) {
      query += `
        AND (
          title LIKE ? COLLATE NOCASE
          OR author LIKE ? COLLATE NOCASE
        )
      `;

      const searchTerm = `%${q.trim()}%`;

      parameters.push(searchTerm, searchTerm);
    }

    if (section && section.trim()) {
      query += ` AND section = ? COLLATE NOCASE`;
      parameters.push(section.trim());
    }

    query += ` ORDER BY title ASC`;

    const statement = db.prepare(query);
    const stock = statement.all(...parameters);

    res.json(stock);
  } catch (error) {
    console.error("Error searching stock:", error.message);

    res.status(500).json({
      message: "Failed to search stock",
    });
  }
};

// GET FULL STOCK LIST
const getAllStock = (req, res) => {
  try {
    const statement = db.prepare(`
            SELECT *
            FROM stock
            ORDER BY title ASC
        `);

    const stock = statement.all();

    res.json(stock);
  } catch (error) {
    console.error("Error getting stock:", error.message);

    res.status(500).json({
      message: "Failed to retrieve stock",
    });
  }
};

// UPDATE STOCK
// STORY: Update stock details and quantity
// UPDATE STOCK
const updateStock = (req, res) => {
  const { id } = req.params;

  const {
    title,
    author,
    type,
    section,
    shelf_location,
    quantity,
    condition,
    price,
  } = req.body;

  if (!title || !author || !type || !section || price === undefined) {
    return res.status(400).json({
      message: "Title, author, type, section and price are required",
    });
  }

  try {
    const statement = db.prepare(`
      UPDATE stock
      SET
        title = ?,
        author = ?,
        type = ?,
        section = ?,
        shelf_location = ?,
        quantity = ?,
        condition = ?,
        price = ?
      WHERE id = ?
    `);

    const result = statement.run(
      title,
      author,
      type,
      section,
      shelf_location || null,
      quantity ?? null,
      condition || null,
      price,
      id,
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error updating stock:", error.message);

    res.status(500).json({
      message: "Failed to update stock",
    });
  }
};

// DELETE STOCK
const removeStock = (req, res) => {
  const { id } = req.params;

  try {
    const statement = db.prepare(`
      DELETE FROM stock
      WHERE id = ?
    `);

    const result = statement.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Stock removed successfully",
    });
  } catch (error) {
    console.error("Error deleting stock:", error.message);

    res.status(500).json({
      message: "Failed to remove stock",
    });
  }
};

module.exports = {
  addStock,
  searchStock,
  getAllStock,
  updateStock,
  removeStock,
};
