import { Link, Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-2xl font-bold">Bellbird Books — Staff Home</h1>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div>
            Staff:{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-[#1A5F3F] px-2.5 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <hr className="border-t-2 border-green-800 mb-6" />
      <div className="flex gap-8">
        {/* LEFT COLUMN — Stock */}
        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
            Stock
          </h2>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/stock/new">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              Add New Book
            </button>
          </Link>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/stock/second-hand">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              Add Second-hand Book
            </button>
          </Link>

          <Link to="/stock">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              Search Stock
            </button>
          </Link>

          <Link to="/stock/all">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              View Full Stock List
            </button>
          </Link>
        </div>

        {/* RIGHT COLUMN — Orders */}
        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
            Orders
          </h2>

          <Link to="/orders/new">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              Place New Order
            </button>
          </Link>

          <Link to="/orders/search">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              Search Current Orders
            </button>
          </Link>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/orders/outstanding">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full hover:bg-green-700">
              View Outstanding Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Admin */}
      {user?.username === "admin" && (
        <div className="mt-12 border-t-2 border-green-800 pt-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
            Admin
          </h2>

          <Link to="/admin/users" className="block">
            <button
              type="button"
              className="w-full rounded-lg bg-[#1A5F3F] px-4 py-3 text-white transition-colors hover:bg-green-700"
            >
              Manage Users
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
