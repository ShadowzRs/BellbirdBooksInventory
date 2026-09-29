// This file creates/opens the database file and makes the
// "stock" and "orders" tables

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bellbird.db");

db.serialize(() => {
  // STORY: Search stock by title/author
  // STORY: List and filter stock by section
  db.run(`
    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('new', 'second-hand')),
      section TEXT NOT NULL,
      shelf_location TEXT,
      quantity INTEGER CHECK (quantity IS NULL OR quantity >= 0),
      condition TEXT CHECK (
        condition IS NULL OR
        condition IN ('New', 'Very Good', 'Good', 'Fair', 'Reading Copy')
      ),
      price DECIMAL(9,2) NOT NULL CHECK (price >= 0),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creating stock table:", err);
  });

  // STORY: Record a customer order (and look it up later)
  // Each row is one customer's request for a book that isn't currently in stock
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      contact_preference TEXT NOT NULL CHECK (contact_preference IN ('call', 'text')),
      book_title TEXT NOT NULL,
      book_author TEXT,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      status TEXT NOT NULL CHECK (status IN ('unfulfilled', 'fulfilled', 'cancelled')) DEFAULT 'unfulfilled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creating orders table:", err);
  });
});

module.exports = db;