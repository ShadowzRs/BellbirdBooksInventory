import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";

function AddBookPage() {
  const navigate = useNavigate();
  const { type } = useParams();

  const isNewBook = type === "new";
  const isSecondHand = type === "second-hand";

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    section: "",
    shelf_location: "",
    quantity: "",
    condition: "",
    price: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Redirect if the URL type is invalid
  if (!isNewBook && !isSecondHand) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove the red border when the user fills in the field
    setMissingFields((previous) => previous.filter((field) => field !== name));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    // Check required fields
    const missing = [];

    if (!formData.title) {
      missing.push("title");
    }

    if (!formData.author) {
      missing.push("author");
    }

    if (!formData.section) {
      missing.push("section");
    }

    if (!formData.price) {
      missing.push("price");
    }

    // New books require quantity
    if (isNewBook && !formData.quantity) {
      missing.push("quantity");
    }

    // Second-hand books require condition
    if (isSecondHand && !formData.condition) {
      missing.push("condition");
    }

    // If there are missing fields
    if (missing.length > 0) {
      setMissingFields(missing);
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // All required fields are filled
    setMissingFields([]);

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          type: type,
          section: formData.section,
          shelf_location: formData.shelf_location || null,

          quantity: isNewBook ? Number(formData.quantity) : null,

          condition: isSecondHand ? formData.condition : null,

          price: Number(formData.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      setMessage(
        `${isNewBook ? "New" : "Second-hand"} book added successfully!`,
      );

      // Clear form after successful submission
      setFormData({
        title: "",
        author: "",
        section: "",
        shelf_location: "",
        quantity: "",
        condition: "",
        price: "",
      });

      setMissingFields([]);
    } catch (error) {
      setErrorMessage(error.message || "Couldn't add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isNewBook ? "Add New Book" : "Add Second-Hand Book"}
        </h1>

        <p className="text-gray-600 mt-1">
          {isNewBook
            ? "Add a new book to the Bellbird Books stock."
            : "Add a second-hand book to the Bellbird Books stock."}
        </p>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-4 p-3 border rounded bg-green-50 text-green-700">
          {message}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-3 border rounded bg-red-50 text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 border rounded-lg p-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Book Title *
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            className={`w-full border rounded-md p-2 ${
              missingFields.includes("title")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Author *
          </label>

          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            className={`w-full border rounded-md p-2 ${
              missingFields.includes("author")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>

        {/* Section */}
        <div>
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Section *
          </label>

          <input
            id="section"
            name="section"
            type="text"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. Fiction"
            className={`w-full border rounded-md p-2 ${
              missingFields.includes("section")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>

        {/* Shelf Location */}
        <div>
          <label
            htmlFor="shelf_location"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Shelf Location
          </label>

          <input
            id="shelf_location"
            name="shelf_location"
            type="text"
            value={formData.shelf_location}
            onChange={handleChange}
            placeholder="e.g. A12"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Quantity - New books only */}
        {isNewBook && (
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Quantity *
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className={`w-full border rounded-md p-2 ${
                missingFields.includes("quantity")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
        )}

        {/* Condition - Second-hand only */}
        {isSecondHand && (
          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Condition *
            </label>

            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 ${
                missingFields.includes("condition")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select condition</option>

              <option value="New">New</option>

              <option value="Very Good">Very Good</option>

              <option value="Good">Good</option>

              <option value="Fair">Fair</option>

              <option value="Reading Copy">Reading Copy</option>
            </select>
          </div>
        )}

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Price *
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full border rounded-md p-2 ${
              missingFields.includes("price")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBookPage;
