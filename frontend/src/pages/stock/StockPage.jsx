import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // Load the list of sections once, when the page first opens
  useEffect(() => {
    async function loadSections() {
      try {
        const response = await fetch("http://localhost:3000/api/stock/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setSectionError(data.message || "Couldn't load sections.");
          return;
        }

        // Get unique section names from all stock
        const uniqueSections = [
          ...new Set(
            data.map((book) => book.section).filter((section) => section),
          ),
        ];

        setSections(uniqueSections);
      } catch (err) {
        setSectionError("Couldn't load sections. Please refresh the page.");
      }
    }

    loadSections();
  }, []);

  async function handleSearch() {
    const searchTerm = query.trim();

    if (!searchTerm) {
      setErrorMessage("Please enter a title or author.");
      setNewStock([]);
      setSecondHandStock([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/stock?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to search stock.");
        setNewStock([]);
        setSecondHandStock([]);
        return;
      }

      const newBooks = data.filter((book) => book.type === "new");

      const secondHandBooks = data.filter(
        (book) => book.type === "second-hand",
      );

      setNewStock(newBooks);
      setSecondHandStock(secondHandBooks);

      if (data.length === 0) {
        setErrorMessage("No matching books found.");
      } else {
        setErrorMessage("");
      }
    } catch (err) {
      setErrorMessage(
        "Couldn't connect to the server. Please check your connection and try again.",
      );
      setNewStock([]);
      setSecondHandStock([]);
    }
  }

  async function handleSectionChange(e) {
    const section = e.target.value;

    setSelectedSection(section);
    setSectionError("");

    if (!section) {
      setSectionStock([]);
      return;
    }

    try {
      let url;

      if (section === "All Sections") {
        url = "http://localhost:3000/api/stock/all";
      } else {
        url = `http://localhost:3000/api/stock/?section=${encodeURIComponent(
          section,
        )}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setSectionError(
          data.message || "Couldn't load stock for this section.",
        );
        setSectionStock([]);
        return;
      }

      setSectionStock(data);
    } catch (err) {
      setSectionError("Couldn't connect to the server. Please try again.");
      setSectionStock([]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Management
            </h1>

            <p className="text-gray-500 mt-1">
              Search and browse the bookstore's current stock.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
          >
            Back
          </button>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Stock
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Search for books by title or author.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
            />

            <button
              onClick={handleSearch}
              className="bg-green-800 hover:bg-green-900 text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              Search
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {errorMessage}
            </div>
          )}

          {/* NEW STOCK RESULTS */}
          {newStock.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">New Stock</h3>

                <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  {newStock.length} {newStock.length === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newStock.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50"
                  >
                    <div className="flex justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {book.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          by {book.author}
                        </p>
                      </div>

                      <span className="text-green-800 font-semibold whitespace-nowrap">
                        ${Number(book.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                        Shelf: {book.shelf_location || "Not assigned"}
                      </span>

                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                        Quantity: {book.quantity ?? 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECOND-HAND RESULTS */}
          {secondHandStock.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Second-hand Stock
                </h3>

                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  {secondHandStock.length}{" "}
                  {secondHandStock.length === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondHandStock.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50"
                  >
                    <div className="flex justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {book.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          by {book.author}
                        </p>
                      </div>

                      <span className="text-green-800 font-semibold whitespace-nowrap">
                        ${Number(book.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                        Shelf: {book.shelf_location || "Not assigned"}
                      </span>

                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                        Condition: {book.condition || "Not specified"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION FILTER */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Stock by Section
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Browse books available in a specific section.
            </p>
          </div>

          <select
            value={selectedSection}
            onChange={handleSectionChange}
            className="w-full sm:w-auto min-w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
          >
            <option value="">-- Select a section --</option>

            <option value="All Sections">All Sections</option>

            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>

          {sectionError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {sectionError}
            </div>
          )}

          {selectedSection && sectionStock.length === 0 && !sectionError && (
            <div className="mt-6 text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-sm">
                No stock available in this section.
              </p>
            </div>
          )}

          {sectionStock.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  {selectedSection}
                </h3>

                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {sectionStock.length}{" "}
                  {sectionStock.length === 1 ? "book" : "books"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionStock.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50"
                  >
                    <div className="flex justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {book.title}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          by {book.author}
                        </p>
                      </div>

                      <span className="text-green-800 font-semibold whitespace-nowrap">
                        ${Number(book.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                        Shelf: {book.shelf_location || "Not assigned"}
                      </span>

                      {book.type === "new" ? (
                        <span className="bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-md">
                          Quantity: {book.quantity ?? 0}
                        </span>
                      ) : (
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-md">
                          Condition: {book.condition || "Not specified"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockPage;
