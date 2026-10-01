import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateStock() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadNewStock() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:3000/api/stock/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load stock.");
          return;
        }

        const newStock = data.filter(
          (book) => book.type === "new",
        );

        setBooks(newStock);
      } catch (err) {
        setError(
          "Couldn't connect to the server. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadNewStock();
  }, []);

  const handleBookSelection = (event) => {
    const bookId = event.target.value;

    setSelectedBookId(bookId);
    setMessage("");
    setError("");

    const selectedBook = books.find(
      (book) => String(book.id) === bookId,
    );

    if (selectedBook) {
      setFormData({
        title: selectedBook.title,
        author: selectedBook.author,
        quantity: String(selectedBook.quantity ?? 0),
      });
    } else {
      setFormData({
        title: "",
        author: "",
        quantity: "",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!selectedBookId) {
      setError("Please select a book.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a book title.");
      return;
    }

    if (!formData.author.trim()) {
      setError("Please enter the author name.");
      return;
    }

    if (formData.quantity === "") {
      setError("Please enter the quantity.");
      return;
    }

    const quantity = Number(formData.quantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError(
        "Quantity must be a whole number greater than or equal to 0.",
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3000/api/stock/${selectedBookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            author: formData.author.trim(),
            quantity: quantity,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update stock.");
        return;
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          String(book.id) === selectedBookId
            ? {
                ...book,
                title: formData.title.trim(),
                author: formData.author.trim(),
                quantity: quantity,
              }
            : book,
        ),
      );

      setMessage("Stock information updated successfully.");
    } catch (err) {
      setError(
        "Couldn't connect to the server. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

    const handleRemove = async () => {
      setMessage("");
      setError("");

      if (!selectedBookId) {
        setError("Please select a book.");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to remove this book from stock?",
      );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);

        const response = await fetch(
          `http://localhost:3000/api/stock/${selectedBookId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to remove stock.");
          return;
        }

        setBooks((previousBooks) =>
          previousBooks.filter(
            (book) => String(book.id) !== selectedBookId,
          ),
        );

        setSelectedBookId("");

        setFormData({
          title: "",
          author: "",
          quantity: "",
        });

        setMessage("Book removed from stock successfully.");
      } catch (err) {
        setError(
          "Couldn't connect to the server. Please try again.",
        );
      } finally {
        setSaving(false);
      }
    };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-800">
              Bellbird Books
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Update Stock
            </h1>

            <p className="text-gray-500 mt-1">
              Update the details and quantity of an existing new book.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/stock")}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
          >
            Back
          </button>
        </div>

        {/* UPDATE FORM */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {loading ? (
            <p className="text-gray-500">
              Loading stock...
            </p>
          ) : (
            <form onSubmit={handleUpdate}>
              {/* BOOK SELECTION */}
              <div className="mb-6">
                <label
                  htmlFor="book"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Book
                </label>

                <select
                  id="book"
                  value={selectedBookId}
                  onChange={handleBookSelection}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                >
                  <option value="">
                    Select a book
                  </option>

                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOOK DETAILS */}
              {selectedBookId && (
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h2 className="font-semibold text-gray-900 mb-3">
                    Book Details
                  </h2>

                  <p className="text-sm text-gray-600">
                    Book ID:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedBookId}
                    </span>
                  </p>
                </div>
              )}

              {/* TITLE */}
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={!selectedBookId}
                  placeholder="Enter book title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 disabled:bg-gray-100"
                />
              </div>

              {/* AUTHOR */}
              <div className="mb-5">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Author
                </label>

                <input
                  id="author"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  disabled={!selectedBookId}
                  placeholder="Enter author name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 disabled:bg-gray-100"
                />
              </div>

              {/* QUANTITY */}
              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={!selectedBookId}
                  placeholder="Enter quantity"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 disabled:bg-gray-100"
                />
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                  {message}
                </div>
              )}

              {/* SAVE BUTTON */}
              <button
                type="submit"
                disabled={!selectedBookId || saving}
                className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                {saving ? "Saving..." : "Save Updated Stock"}
              </button>

              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={handleRemove}
                disabled={!selectedBookId || saving}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition"
              >
                {saving ? "Processing..." : "Remove Book"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateStock;