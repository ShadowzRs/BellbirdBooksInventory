// This file creates/opens the database file and makes a sample
// "stock" table sample

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bellbird.db");

db.serialize(() => {
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
    if (err) {
      console.error("Error creating stock table:", err);
      return;
    }

    db.get("SELECT COUNT(*) AS count FROM stock", (err, row) => {
      if (err) {
        console.error("Error checking stock count:", err);
        return;
      }

      // TODO: sample data below is for development/testing only —
      // remove this block before final submission/deployment
      if (!row || row.count === 0) {
        const sampleBooks = [
  ["Fourth Wing", "Rebecca Yarros", "new", "New Releases", "A1", 5, null, 24.99],
  ["Iron Flame", "Rebecca Yarros", "new", "New Releases", "A2", 2, null, 26.99],
  ["Wild Swans", "Jung Chang", "second-hand", "Fiction", "F3", null, "Good", 8.50],
  ["Wild Swans", "Jung Chang", "second-hand", "Fiction", "F4", null, "Fair", 6.00],
  ["Persuasion", "Jane Austen", "second-hand", "Classics", "C2", null, "Fair", 5.00],
  ["Pride and Prejudice", "Jane Austen", "second-hand", "Classics", "C3", null, "Very Good", 7.50],
  ["Atomic Habits", "James Clear", "new", "Non-Fiction", "N1", 3, null, 19.99],
  ["Sapiens", "Yuval Noah Harari", "new", "Non-Fiction", "N2", 6, null, 22.50],
  ["A History of the World", "Andrew Marr", "new", "History", "H1", 4, null, 22.50],
  ["SPQR: A History of Ancient Rome", "Mary Beard", "second-hand", "History", "H2", null, "Good", 9.00],
  ["The Notebook", "Nicholas Sparks", "second-hand", "Romance", "R1", null, "Very Good", 6.00],
  ["Me Before You", "Jojo Moyes", "new", "Romance", "R2", 7, null, 18.99],
  ["Me Before You", "Jojo Moyes", "second-hand", "Romance", "R3", null, "Reading Copy", 3.50],
];

        const insert = db.prepare(`
          INSERT INTO stock (title, author, type, section, shelf_location, quantity, condition, price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleBooks.forEach((book) => {
          insert.run(book, (err) => {
            if (err) console.error("Error inserting sample book:", err);
          });
        });

        insert.finalize((err) => {
          if (err) console.error("Error finalizing insert:", err);
          else console.log("Sample stock added.");
        });
      }
    });
  });
});

module.exports = db;