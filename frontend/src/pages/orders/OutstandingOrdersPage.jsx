import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OutstandingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function loadOutstandingOrders() {
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/orders/outstanding",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Outstanding orders could not be loaded.");
        setIsError(true);
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (err) {
      setMessage(
        "Couldn't connect to the server. Please check your connection and try again.",
      );
      setIsError(true);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOutstandingOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Outstanding Customer Orders</h1>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadOutstandingOrders}
            disabled={isLoading}
            className="border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={isLoading}
            className="border border-gray-300 px-3 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Back
          </button>
        </div>
      </div>

      {message && (
        <p className={`mb-4 ${isError ? "text-red-600" : "text-gray-600"}`}>
          {message}
        </p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="p-4 border rounded bg-gray-50 text-gray-600">
          There are currently no outstanding orders.
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{order.id}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.first_name} {order.last_name}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.phone_number}
                  </td>

                  <td className="px-4 py-3">{order.book_title}</td>

                  <td className="px-4 py-3 capitalize">
                    {order.contact_preference}
                  </td>

                  <td className="px-4 py-3 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OutstandingOrdersPage;
