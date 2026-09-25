import { useState, useEffect } from "react";

function StockPage() {
  // Search feature state
  const [query, setQuery] = useState("");
  const [newStock, setNewStock] = useState([]);
  const [secondHandStock, setSecondHandStock] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Section filter feature state
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [sectionStock, setSectionStock] = useState([]);
  const [sectionError, setSectionError] = useState("");

  // Load the list of sections once, when the page first opens
  useEffect(() => {
    async function loadSections() {
      try {
        const response = await fetch("http://localhost:3000/api/stock/sections");
        const data = await response.json();
        setSections(data.sections);
      } catch (err) {
        setSectionError("Couldn't load sections. Please refresh the page.");
      }
    }
    loadSections();
  }, []);

  async function handleSearch() {
    try {
      const response = await fetch(`http://localhost:3000/api/stock/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setNewStock([]);
        setSecondHandStock([]);
      } else {
        setNewStock(data.newStock);
        setSecondHandStock(data.secondHandStock);

        // If both lists are empty, tell the staff member instead of showing nothing
        if (data.newStock.length === 0 && data.secondHandStock.length === 0) {
          setErrorMessage("No matching books found.");
        } else {
          setErrorMessage("");
        }
      }
    } catch (err) {
      setErrorMessage("Couldn't connect to the server. Please check your connection and try again.");
      setNewStock([]);
      setSecondHandStock([]);
    }
  }

  async function handleSectionChange(e) {
  const section = e.target.value;
  setSelectedSection(section);

  if (!section) {
    setSectionStock([]);
    return;
  }

  // "All Sections" uses a different endpoint that returns every book
  const url = section === "All Sections"
    ? "http://localhost:3000/api/stock/all"
    : `http://localhost:3000/api/stock/section/${encodeURIComponent(section)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    setSectionError("");
    setSectionStock(data.stock);
  } catch (err) {
    setSectionError("Couldn't load stock for this section. Please try again.");
    setSectionStock([]);
  }
}

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* SEARCH SECTION */}
      <h1 className="text-2xl font-bold mb-4">Search Stock</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-green-800 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {newStock.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">New Stock</h2>
          {newStock.map((book) => (
            <div key={book.id} className="border-b py-2">
              <div className="text-sm text-gray-700"><strong>Title:</strong> {book.title}</div>
              <div className="text-sm text-gray-700"><strong>Author:</strong> {book.author}</div>
              <div className="text-sm text-gray-700"><strong>Shelf Location:</strong> {book.shelf_location}</div>
              <div className="text-sm text-gray-700"><strong>Quantity:</strong> {book.quantity}</div>
              <div className="text-sm text-gray-700"><strong>Price:</strong> ${book.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      {secondHandStock.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold mb-2">Second-hand Stock</h2>
          {secondHandStock.map((book) => (
            <div key={book.id} className="border-b py-2">
              <div className="text-sm text-gray-700"><strong>Title:</strong> {book.title}</div>
              <div className="text-sm text-gray-700"><strong>Author:</strong> {book.author}</div>
              <div className="text-sm text-gray-700"><strong>Shelf Location:</strong> {book.shelf_location}</div>
              <div className="text-sm text-gray-700"><strong>Condition:</strong> {book.condition}</div>
              <div className="text-sm text-gray-700"><strong>Price:</strong> ${book.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION FILTER */}
      <h1 className="text-2xl font-bold mb-4">Stock by Section</h1>

      <select
        value={selectedSection}
        onChange={handleSectionChange}
        className="border border-gray-300 rounded p-2 mb-4"
      >
        <option value="">-- Select a section --</option>
<option value="All Sections">All Sections</option>
{sections.map((section) => (
  <option key={section} value={section}>{section}</option>
))}
      </select>

      {sectionError && <p className="text-red-600 mb-4">{sectionError}</p>}

      {selectedSection && sectionStock.length === 0 && !sectionError && (
        <p className="text-gray-600">No stock in this section.</p>
      )}

      {sectionStock.map((book) => (
        <div key={book.id} className="border-b py-2">
          <div className="text-sm text-gray-700"><strong>Title:</strong> {book.title}</div>
          <div className="text-sm text-gray-700"><strong>Author:</strong> {book.author}</div>
          <div className="text-sm text-gray-700"><strong>Shelf Location:</strong> {book.shelf_location}</div>
          {book.type === "new" ? (
            <>
              <div className="text-sm text-gray-700"><strong>Quantity:</strong> {book.quantity}</div>
              <div className="text-sm text-gray-700"><strong>Price:</strong> ${book.price.toFixed(2)}</div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-700"><strong>Condition:</strong> {book.condition}</div>
              <div className="text-sm text-gray-700"><strong>Price:</strong> ${book.price.toFixed(2)}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default StockPage;