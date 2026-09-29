import { useState } from "react";

const initialFormData = {
  first_name: "",
  last_name: "",
  phone_number: "",
  contact_preference: "call",
  book_title: "",
  book_author: "",
  quantity: "",
};

function NewOrderPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setFormData((previous) => ({ ...previous, phone_number: digitsOnly }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
        setIsError(true);
      } else {
        setMessage(`${data.message} Order number: ${data.orderId}`);
        setIsError(false);
        // Clear the fields after a successful save (subtask 93)
        setFormData(initialFormData);
      }
    } catch (err) {
      setMessage("Couldn't connect to the server. Please check your connection and try again.");
      setIsError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Record a Customer Order</h1>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label htmlFor="first_name">First name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="last_name">Last name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="phone_number">Phone number:</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handlePhoneChange}
            maxLength={10}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="contact_preference">Contact preference:</label>
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

        <div>
          <label htmlFor="book_title">Book title:</label>
          <input
            type="text"
            id="book_title"
            name="book_title"
            value={formData.book_title}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="book_author">Book author (optional):</label>
          <input
            type="text"
            id="book_author"
            name="book_author"
            value={formData.book_author}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="quantity">Quantity:</label>
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
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </div>

      {message && (
        <p className={`mb-4 ${isError ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export default NewOrderPage;