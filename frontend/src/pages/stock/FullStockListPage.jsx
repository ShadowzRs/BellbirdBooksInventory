import { useState, useEffect } from "react";

function FullStockListPage() {
  const [stock, setStock] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAllStock() {
      try {
        const response = await fetch("http://localhost:3000/api/stock/all");
        const data = await response.json();
        setStock(data.stock);
      } catch (err) {
        setErrorMessage("Couldn't load stock. Please refresh the page.");
      }
    }
    loadAllStock();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock List</h1>

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Condition</th>
            <th className="p-2">Price</th>
            <th className="p-2">Shelf</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((book) => (
            <tr key={book.id} className="border-b border-gray-100">
              <td className="p-2 font-semibold">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.type === "new" ? book.quantity : "—"}</td>
              <td className="p-2">{book.type === "second-hand" ? book.condition : "—"}</td>
              <td className="p-2">${book.price.toFixed(2)}</td>
              <td className="p-2">{book.shelf_location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FullStockListPage;