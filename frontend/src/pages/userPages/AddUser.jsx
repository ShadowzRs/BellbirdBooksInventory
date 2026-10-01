import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "bookseller",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  }

  // Create user
  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    if (!formData.username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (!formData.first_name.trim()) {
      setErrorMessage("Please enter the first name.");
      return;
    }

    if (!formData.last_name.trim()) {
      setErrorMessage("Please enter the last name.");
      return;
    }

    if (!formData.role) {
      setErrorMessage("Please select a role.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to create user.");
        return;
      }

      window.alert("User has been created successfully.");

      navigate("/users");
    } catch (error) {
      console.error("Create user error:", error);

      setErrorMessage("Couldn't connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-800">Bellbird Books</p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Add New User
            </h1>

            <p className="text-gray-500 mt-1">
              Create a new user account for the bookstore.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition whitespace-nowrap disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errorMessage}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* FIRST NAME */}
            <div className="mb-5">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>

              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                autoComplete="given-name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* LAST NAME */}
            <div className="mb-5">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>

              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                autoComplete="family-name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
            </div>

            {/* ROLE */}
            <div className="mb-6">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              >
                <option value="bookseller">Bookseller</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Creating User..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
