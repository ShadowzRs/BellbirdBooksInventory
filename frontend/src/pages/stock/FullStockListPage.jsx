import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FullStockListPage() {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAllStock() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/stock/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load stock");
      }

      const data = await response.json();

      setStock(data);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Couldn't load stock. Please refresh the page.");
    }
  }

  useEffect(() => {
    loadAllStock();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock List</h1>

            <p className="text-gray-500 mt-1">
              View all books currently available in stock.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadAllStock}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>
          </div>
        </div>

        {/* API ERROR */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {errorMessage}
          </div>
        )}

        {/* EMPTY STOCK */}
        {!errorMessage && stock.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No stock available.</p>
          </div>
        )}

        {/* STOCK TABLE */}
        {stock.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* TABLE HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  All Stock
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {stock.length} {stock.length === 1 ? "book" : "books"} in
                  stock
                </p>
              </div>

              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                {stock.length}
              </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Title
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Author
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Type
                    </th>

                    <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">
                      Qty
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Condition
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Price
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Shelf
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {stock.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">
                      {/* TITLE */}
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {book.title}
                      </td>

                      {/* AUTHOR */}
                      <td className="px-4 py-4 text-gray-600">{book.author}</td>

                      {/* TYPE */}
                      <td className="px-4 py-4">
                        {book.type === "new" ? (
                          <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium">
                            Second Hand
                          </span>
                        )}
                      </td>

                      {/* QUANTITY */}
                      <td className="px-4 py-4 text-center">
                        {book.type === "new" ? (
                          <span className="font-medium text-gray-700">
                            {book.quantity}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* CONDITION */}
                      <td className="px-4 py-4">
                        {book.type === "second-hand" ? (
                          <span className="text-gray-700">
                            {book.condition || "—"}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* PRICE */}
                      <td className="px-4 py-4 font-semibold text-green-800 whitespace-nowrap">
                        ${Number(book.price).toFixed(2)}
                      </td>

                      {/* SHELF */}
                      <td className="px-4 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">
                          {book.shelf_location || "—"}
                        </span>
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

export default FullStockListPage;
