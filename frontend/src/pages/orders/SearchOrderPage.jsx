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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Customer Orders</h1>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label htmlFor="query" className="block mb-1">
            Search by name, book title, or order number:
          </label>

          <input
            type="text"
            id="query"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. John Smith, The Great Gatsby, or 123"
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={isSearching}
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="border border-gray-300 px-3 py-2 rounded hover:bg-gray-100"
        >
          Back
        </button>

        {message && (
          <p
            className={`text-sm self-center ${isError ? "text-red-600" : "text-gray-600"}`}
          >
            {message}
          </p>
        )}
      </div>

      {hasSearched && results.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {results.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{order.id}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.first_name} {order.last_name}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.phone_number}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {order.contact_preference}
                  </td>

                  <td className="px-4 py-3">{order.book_title}</td>

                  <td className="px-4 py-3">{order.book_author || "—"}</td>

                  <td className="px-4 py-3 text-center">{order.quantity}</td>

                  <td className="px-4 py-3 capitalize">{order.status}</td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/orders/${order.id}/edit`, {
                          state: { order },
                        })
                      }
                      className="bg-blue-700 text-white text-sm px-2 py-1 rounded hover:bg-blue-800"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SearchOrderPage;
