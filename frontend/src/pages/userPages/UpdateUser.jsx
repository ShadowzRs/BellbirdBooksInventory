import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get the currently logged-in user from the JWT
  const token = localStorage.getItem("token");

  let loggedInUser = null;

  try {
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      loggedInUser = tokenPayload;
    }
  } catch (error) {
    console.error("Could not read login information:", error);
  }

  // Check if the user being edited is the currently logged-in admin
  const isOwnAccount =
    loggedInUser && Number(loggedInUser.user_id) === Number(id);

  // Load selected user
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Failed to load user.");
          return;
        }

        setFormData({
          username: data.username || "",
          password: "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          role: data.role || "",
        });
      } catch (error) {
        console.error("Load user error:", error);

        setErrorMessage("Couldn't connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  }

  // Update user
  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    if (!formData.username.trim()) {
      setErrorMessage("Please enter a username.");
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

    const confirmed = window.confirm(
      "Are you sure you want to save these changes?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const body = {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
      };

      // Only send a password if a new password was entered
      if (formData.password.trim()) {
        body.password = formData.password;
      }

      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to update user.");
        return;
      }

      window.alert("Changes have been made successfully.");

      navigate(-1);
    } catch (error) {
      console.error("Update user error:", error);

      setErrorMessage("Couldn't connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Delete user
  async function handleDelete() {
    setErrorMessage("");

    // Extra frontend protection
    if (isOwnAccount) {
      setErrorMessage("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to delete user.");
        return;
      }

      window.alert("User has been deleted successfully.");

      navigate("/users");
    } catch (error) {
      console.error("Delete user error:", error);

      setErrorMessage("Couldn't connect to the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">Loading user information...</p>
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
              Update User
            </h1>

            <p className="text-gray-500 mt-1">
              Update the information and role for this user.
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

        {/* User Header & Content */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                User ID
              </p>

              <p className="text-sm font-semibold text-gray-900 mt-1">#{id}</p>

              {isOwnAccount && (
                <p className="text-xs text-blue-600 mt-2">
                  This is your currently logged-in account.
                </p>
              )}
            </div>

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

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />

              <p className="text-xs text-gray-500 mt-2">
                Leave this field blank if you do not want to change the
                password.
              </p>
            </div>

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
                <option value="">Select a role</option>
                <option value="bookseller">Bookseller</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || isOwnAccount}
              className="w-full mt-3 border border-red-300 bg-white text-red-600 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium px-6 py-2.5 rounded-lg transition"
            >
              {isOwnAccount
                ? "Cannot Delete Own Account"
                : saving
                  ? "Processing..."
                  : "Delete User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
