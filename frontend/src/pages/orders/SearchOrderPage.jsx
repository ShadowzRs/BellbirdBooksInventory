import { useState } from "react";

function SearchOrderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    setIsSearching(true);
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
        setIsError(true);
        setResults([]);
      } else {
        setResults(data);
        setIsError(false);
        setHasSearched(true);
        if (data.length === 0) {
          setMessage(`No orders found matching "${query}".`);
        }
      }
    } catch (err) {
      setMessage("Couldn't connect to the server. Please check your connection and try again.");
      setIsError(true);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Customer Orders</h1>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label htmlFor="query">Search by name, book title, or order number:</label>
          <input
            type="text"
            id="query"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        onClick={handleSearch}
        disabled={isSearching}
        className="bg-green-800 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSearching ? "Searching..." : "Search"}
      </button>

      {hasSearched && results.length > 0 && (
        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="p-2">Order #</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Book Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((order) => (
              <tr key={order.id} className="border-b border-gray-100">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.first_name} {order.last_name}</td>
                <td className="p-2">{order.phone_number}</td>
                <td className="p-2">{order.book_title}</td>
                <td className="p-2">{order.book_author || "—"}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchOrderPage;