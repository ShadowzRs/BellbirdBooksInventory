import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrderPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadAllOrders();
  }, []);

  async function handleSearch() {
    const searchTerm = query.trim();

    if (!searchTerm) {
      setMessage("Please enter a name, book title, or order number.");
      setIsError(true);
      return;
    }

    setIsSearching(true);
    setMessage("");
    setIsError(false);
    setHasSearched(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/orders/search?q=${encodeURIComponent(
          searchTerm,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Search could not be completed. Please try again.",
        );
        setIsError(true);
        setResults([]);
        return;
      }

      // Backend returns { orders: [...] }
      setResults(data.orders || []);

      if ((data.orders || []).length === 0) {
        setMessage(`No orders found matching "${searchTerm}".`);
        setIsError(true);
      }
    } catch (err) {
      setMessage(
        "Couldn't connect to the server. Please check your connection and try again.",
      );
      setIsError(true);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function loadAllOrders() {
    setIsSearching(true);
    setMessage("");
    setIsError(false);
    setHasSearched(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/orders/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Orders could not be loaded. Please try again.",
        );
        setIsError(true);
        setResults([]);
        return;
      }

      setResults(data.orders || []);
    } catch (err) {
      setMessage(
        "Couldn't connect to the server. Please check your connection and try again.",
      );
      setIsError(true);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleClear() {
    setQuery("");
    setMessage("");
    setIsError(false);
    loadAllOrders();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Orders</h1>

          <p className="text-gray-500 mt-1">
            Search and update existing customer orders.
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Orders
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Search by customer name, book title, or order number.
            </p>
          </div>

          <div className="mb-5">
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search
            </label>

            <input
              type="text"
              id="query"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. John Smith, The Great Gatsby, or 123"
              className="border border-gray-300 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
            />
          </div>

          {/* BUTTONS + MESSAGE */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-green-800 hover:bg-green-900 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isSearching}
              className="border border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>

            {message && (
              <p
                className={`text-sm ${
                  isError ? "text-red-600" : "text-gray-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* RESULTS */}
        {hasSearched && results.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-8 overflow-hidden">
            {/* RESULTS HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Search Results
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {results.length} {results.length === 1 ? "order" : "orders"}{" "}
                  found
                </p>
              </div>

              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                {results.length}
              </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Order #
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Customer
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Phone
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Contact
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Book Title
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Author
                    </th>

                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                      Qty
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Status
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {results.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      {/* ORDER NUMBER */}
                      <td className="px-4 py-4 font-medium text-gray-900">
                        #{order.id}
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {order.first_name} {order.last_name}
                        </span>
                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                        {order.phone_number}
                      </td>

                      {/* CONTACT */}
                      <td className="px-4 py-4 capitalize">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">
                          {order.contact_preference}
                        </span>
                      </td>

                      {/* BOOK */}
                      <td className="px-4 py-4 min-w-48">
                        <span className="font-medium text-gray-900">
                          {order.book_title}
                        </span>
                      </td>

                      {/* AUTHOR */}
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {order.book_author || "—"}
                      </td>

                      {/* QUANTITY */}
                      <td className="px-4 py-4 text-center">
                        <span className="font-medium text-gray-700">
                          {order.quantity}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 capitalize">
                        {order.status === "unfulfilled" && (
                          <span className="inline-flex bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium">
                            Unfulfilled
                          </span>
                        )}

                        {order.status === "collected" && (
                          <span className="inline-flex bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">
                            Collected
                          </span>
                        )}

                        {order.status === "cancelled" && (
                          <span className="inline-flex bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-medium">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/orders/${order.id}/edit`, {
                              state: { order },
                            })
                          }
                          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchOrderPage;
