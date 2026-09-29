import { Link } from "react-router-dom";

function Dashboard({ staffName }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-2xl font-bold">Bellbird Books — Staff Home</h1>
        <div className="text-sm text-gray-600">
          Staff: <strong>{staffName}</strong>
        </div>
      </div>
      <hr className="border-t-2 border-green-800 mb-6" />

      <div className="flex gap-8">
        {/* LEFT COLUMN — Stock */}
        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Stock</h2>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/stock/new-book">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              Add New Book
            </button>
          </Link>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/stock/second-hand">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              Add Second-hand Book
            </button>
          </Link>

          <Link to="/stock">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              Search Stock
            </button>
          </Link>

          <Link to="/stock/all">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              View Full Stock List
            </button>
          </Link>
        </div>

        {/* RIGHT COLUMN — Orders */}
        <div className="flex-1 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Orders</h2>

          <Link to="/orders/new">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              New Order
            </button>
          </Link>

          <Link to="/orders/search">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              Search Orders
            </button>
          </Link>

          {/* PLACEHOLDER-change "link to" based on your choice*/}
          <Link to="/orders/outstanding">
            <button className="bg-green-800 text-white px-4 py-3 rounded w-full">
              View Outstanding Orders
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;