const express = require("express");
const router = express.Router();
const db = require("../db");

// STORY 1: Search stock by title/author
// Handles a search request from the front-end's search box
// The "q" in the URL is whatever text the staff member typed in

router.get("/search", (req, res) => {
  const query = req.query.q;

  // If nothing was typed, tell the staff member to enter something
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Please enter a search term." });
  }
  const likeQuery = `%${query}%`;

  const sql = `SELECT * FROM stock WHERE title LIKE ? OR author LIKE ? ORDER BY title ASC`;

  db.all(sql, [likeQuery, likeQuery], (err, rows) => {
    if (err) return res.status(500).json({ error: "Search not working right now, please try again later." });

    // filter() on an empty array safely gives back empty arrays,
    // so this works whether there are 0 matches or many
    const newStock = rows.filter((book) => book.type === "new");
    const secondHandStock = rows.filter((book) => book.type === "second-hand");
    res.json({ newStock, secondHandStock });
  });
});

// STORY 2: List and filter stock by section
// Handles a request from the front-end's section dropdown
// The section name (e.g. "Fiction") comes from the URL itself

router.get("/section/:sectionName", (req, res) => {
  const { sectionName } = req.params;
  const sql = `SELECT * FROM stock WHERE section = ? ORDER BY title ASC`;

  db.all(sql, [sectionName], (err, rows) => {
    if (err) return res.status(500).json({ error: "Stock for this section not loading right now, please try again later." });
    res.json({ stock: rows }); // empty array if no stock — not an error
  });
});

// Fills the dropdown with the bookstore's fixed list of sections
// (independent of what currently has stock, so an empty section can still be selected and tested)
router.get("/sections", (req, res) => {
  const allSections = [
    "New Releases",
    "Fiction",
    "Classics",
    "Non-Fiction",
    "History",
    "Romance",
    "Sci-Fi",
    "Children's",
  ];
  res.json({ sections: allSections });
});

// Returns every book across every section, used for the "All Sections" option
router.get("/all", (req, res) => {
  const sql = `SELECT * FROM stock ORDER BY title ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Stock not loading right now, please try again later." });
    res.json({ stock: rows });
  });
});

module.exports = router;