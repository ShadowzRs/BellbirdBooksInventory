import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
    section: "",
    shelf_location: "",
    quantity: "",
    condition: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load the selected book
  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:3000/api/stock/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load stock.");
          return;
        }

        const selectedBook = data.find(
          (book) => String(book.id) === String(id),
        );

        if (!selectedBook) {
          setError("Book could not be found.");
          return;
        }

        setFormData({
          title: selectedBook.title || "",
          author: selectedBook.author || "",
          type: selectedBook.type || "",
          section: selectedBook.section || "",
          shelf_location: selectedBook.shelf_location || "",
          quantity:
            selectedBook.quantity !== null &&
            selectedBook.quantity !== undefined
              ? String(selectedBook.quantity)
              : "",
          condition: selectedBook.condition || "",
          price:
            selectedBook.price !== null && selectedBook.price !== undefined
              ? String(selectedBook.price)
              : "",
        });
      } catch (err) {
        console.error("Load book error:", err);

        setError(
          "Couldn't connect to the server. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // Save changes
  const handleUpdate = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to save these changes?",
    );

    if (!confirmed) {
      return;
    }

    // Basic validation
    if (!formData.title.trim()) {
      setError("Please enter a book title.");
      return;
    }

    if (!formData.author.trim()) {
      setError("Please enter the author name.");
      return;
    }

    if (!formData.type) {
      setError("Please select the book type.");
      return;
    }

    if (!formData.section.trim()) {
      setError("Please enter a section.");
      return;
    }

    if (formData.price === "") {
      setError("Please enter the price.");
      return;
    }

    const price = Number(formData.price);

    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid number greater than or equal to 0.");
      return;
    }

    let quantity = null;

    if (formData.type === "new") {
      if (formData.quantity === "") {
        setError("Please enter the quantity.");
        return;
      }

      quantity = Number(formData.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        setError("Quantity must be a whole number greater than or equal to 0.");
        return;
      }
    }

    if (formData.type === "second-hand" && !formData.condition.trim()) {
      setError("Please enter the condition of the second-hand book.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`http://localhost:3000/api/stock/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          type: formData.type,
          section: formData.section.trim(),
          shelf_location: formData.shelf_location.trim() || null,
          quantity: quantity,
          condition:
            formData.type === "second-hand" ? formData.condition.trim() : null,
          price: price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update stock.");
        return;
      }

      // Show success popup
      window.alert("Changes have been made successfully.");

      // Go back after user presses OK
      navigate(-1);
    } catch (err) {
      console.error("Update stock error:", err);

      setError("Couldn't connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Remove book
  const handleRemove = async () => {
    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to remove this book from stock?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`http://localhost:3000/api/stock/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to remove stock.");
        return;
      }

      navigate("/stock");
    } catch (err) {
      console.error("Remove stock error:", err);

      setError("Couldn't connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">Loading book information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-800">Bellbird Books</p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Update Stock
            </h1>

            <p className="text-gray-500 mt-1">
              Update the information for this book.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/stock")}
            disabled={saving}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition whitespace-nowrap disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            {message}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleUpdate}>
            {/* BOOK ID */}
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Stock ID
              </p>

              <p className="text-sm font-semibold text-gray-900 mt-1">#{id}</p>
            </div>

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
                placeholder="Enter book title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
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
                placeholder="Enter author name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* TYPE */}
            <div className="mb-5">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Book Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              >
                <option value="">Select book type</option>
                <option value="new">New</option>
                <option value="second-hand">Second-hand</option>
              </select>
            </div>

            {/* SECTION */}
            <div className="mb-5">
              <label
                htmlFor="section"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Section
              </label>

              <input
                id="section"
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g. Fiction"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* SHELF LOCATION */}
            <div className="mb-5">
              <label
                htmlFor="shelf_location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Shelf Location
              </label>

              <input
                id="shelf_location"
                type="text"
                name="shelf_location"
                value={formData.shelf_location}
                onChange={handleChange}
                placeholder="e.g. A12"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* NEW BOOK QUANTITY */}
            {formData.type === "new" && (
              <div className="mb-5">
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
                  placeholder="Enter quantity"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                />
              </div>
            )}

            {/* SECOND-HAND CONDITION */}
            {formData.type === "second-hand" && (
              <div className="mb-5">
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Condition
                </label>

                <input
                  id="condition"
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="e.g. Good, Like New, Fair"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                />
              </div>
            )}

            {/* PRICE */}
            <div className="mb-6">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  id="price"
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* REMOVE BUTTON */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={saving}
              className="w-full mt-3 border border-red-300 bg-white text-red-600 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Processing..." : "Remove Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateStock;
