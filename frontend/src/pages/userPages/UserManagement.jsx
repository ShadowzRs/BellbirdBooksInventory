import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Load all users
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Failed to load users.");
          return;
        }

        setUsers(data);
      } catch (error) {
        console.error("Load users error:", error);

        setErrorMessage("Couldn't connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Format role for display
  function formatRole(role) {
    if (role === "bookseller") {
      return "Bookseller";
    }

    if (role === "manager") {
      return "Manager";
    }

    if (role === "admin") {
      return "Admin";
    }

    return role;
  }

  // Get role badge styling
  function getRoleStyle(role) {
    if (role === "admin") {
      return "bg-purple-100 text-purple-800";
    }

    if (role === "manager") {
      return "bg-blue-100 text-blue-800";
    }

    return "bg-green-100 text-green-800";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage bookstore users and their access roles.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/users/add")}
              className="bg-green-800 hover:bg-green-900 text-white font-medium px-5 py-2 rounded-lg transition whitespace-nowrap"
            >
              Add New User
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              Back
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errorMessage}
          </div>
        )}

        {/* USER LIST */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* LIST HEADER */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  All Users
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {users.length} {users.length === 1 ? "user" : "users"}{" "}
                  registered
                </p>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500 text-sm">Loading users...</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && users.length === 0 && !errorMessage && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500 text-sm">No users found.</p>
            </div>
          )}

          {/* USERS */}
          {!loading && users.length > 0 && (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="px-6 py-5 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* USER INFORMATION */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {user.first_name} {user.last_name}
                        </h3>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRoleStyle(
                            user.role,
                          )}`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p>
                          Username:{" "}
                          <span className="text-gray-700">{user.username}</span>
                        </p>

                        <p>
                          User ID:{" "}
                          <span className="text-gray-700">#{user.user_id}</span>
                        </p>
                      </div>
                    </div>

                    {/* UPDATE BUTTON */}
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/users/update/${user.user_id}`)
                        }
                        className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                      >
                        Update User
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
