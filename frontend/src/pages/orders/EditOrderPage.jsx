import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function EditOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const order = location.state?.order;

  const [formData, setFormData] = useState(
    order
      ? {
          first_name: order.first_name || "",
          last_name: order.last_name || "",
          phone_number: order.phone_number || "",
          contact_preference: order.contact_preference || "call",
          book_title: order.book_title || "",
          book_author: order.book_author || "",
          quantity: order.quantity || "",
          status: order.status || "unfulfilled",
        }
      : null,
  );

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // If someone opens the edit URL directly without
  // coming from the search page
  if (!order || !formData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Order Not Available</h1>

        <p className="text-gray-600 mb-4">
          Please search for the order first before trying to update it.
        </p>

        <button
          type="button"
          onClick={() => navigate("/orders/search")}
          className="bg-green-800 text-white px-4 py-2 rounded"
        >
          Back to Search
        </button>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove the red border when the field is changed
    setMissingFields((previous) => previous.filter((field) => field !== name));

    setMessage("");
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, "");

    setFormData((previous) => ({
      ...previous,
      phone_number: digitsOnly,
    }));

    setMissingFields((previous) =>
      previous.filter((field) => field !== "phone_number"),
    );

    setMessage("");
  }

  function validateForm() {
    const missing = [];

    if (!formData.first_name.trim()) {
      missing.push("first_name");
    }

    if (!formData.last_name.trim()) {
      missing.push("last_name");
    }

    if (!formData.phone_number.trim()) {
      missing.push("phone_number");
    } else if (formData.phone_number.length !== 10) {
      missing.push("phone_number");
    }

    if (!formData.book_title.trim()) {
      missing.push("book_title");
    }

    if (!formData.quantity) {
      missing.push("quantity");
    } else if (
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) <= 0
    ) {
      missing.push("quantity");
    }

    if (!["unfulfilled", "collected", "cancelled"].includes(formData.status)) {
      missing.push("status");
    }

    setMissingFields(missing);

    if (missing.length > 0) {
      setMessage("Please check the highlighted fields.");
      setIsError(true);
      return false;
    }

    return true;
  }

  async function handleSave() {
    setMessage("");
    setIsError(false);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          contact_preference: formData.contact_preference,
          book_title: formData.book_title,
          book_author: formData.book_author,
          quantity: Number(formData.quantity),
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Order could not be updated. Please check your details.",
        );
        setIsError(true);

        if (data.field) {
          setMissingFields([data.field]);
        }

        return;
      }

      // Return to search page after successful update
      navigate("/orders/search", {
        state: {
          message: `Order #${id} was updated successfully.`,
        },
      });
    } catch (err) {
      setMessage(
        "Couldn't connect to the server. Please check your connection and try again.",
      );
      setIsError(true);
    } finally {
      setIsSaving(false);
    }
  }

  function getInputClass(fieldName) {
    const hasError = missingFields.includes(fieldName);

    return `border rounded p-2 w-full ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;
  }

  function handleCancel() {
    navigate("/orders/search");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Update Customer Order</h1>

      <p className="text-gray-600 mb-4">Order #{id}</p>

      <div className="flex flex-col gap-3 mb-4">
        {/* First name */}
        <div>
          <label htmlFor="first_name" className="block mb-1">
            First name:
          </label>

          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={getInputClass("first_name")}
          />
        </div>

        {/* Last name */}
        <div>
          <label htmlFor="last_name" className="block mb-1">
            Last name:
          </label>

          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={getInputClass("last_name")}
          />
        </div>

        {/* Phone number */}
        <div>
          <label htmlFor="phone_number" className="block mb-1">
            Phone number:
          </label>

          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handlePhoneChange}
            maxLength={10}
            inputMode="numeric"
            className={getInputClass("phone_number")}
          />

          <p className="text-sm text-gray-500 mt-1">
            Enter a 10-digit Australian phone number.
          </p>
        </div>

        {/* Contact preference */}
        <div>
          <label htmlFor="contact_preference" className="block mb-1">
            Contact preference:
          </label>

          <select
            id="contact_preference"
            name="contact_preference"
            value={formData.contact_preference}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="call">Call</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* Book title */}
        <div>
          <label htmlFor="book_title" className="block mb-1">
            Book title:
          </label>

          <input
            type="text"
            id="book_title"
            name="book_title"
            value={formData.book_title}
            onChange={handleChange}
            className={getInputClass("book_title")}
          />
        </div>

        {/* Book author */}
        <div>
          <label htmlFor="book_author" className="block mb-1">
            Book author (optional):
          </label>

          <input
            type="text"
            id="book_author"
            name="book_author"
            value={formData.book_author}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block mb-1">
            Quantity:
          </label>

          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["-", "+", "e", "E", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className={getInputClass("quantity")}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block mb-1">
            Status:
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={getInputClass("status")}
          >
            <option value="unfulfilled">Unfulfilled</option>

            <option value="collected">Collected</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className={`mb-4 ${isError ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditOrderPage;
