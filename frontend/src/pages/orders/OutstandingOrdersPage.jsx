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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Outstanding Customer Orders
            </h1>
            <p className="text-gray-500 mt-1">
              View customer orders that are currently awaiting collection.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadOutstandingOrders}
              disabled={isLoading}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Back
            </button>
          </div>
        </div>

        {/* Message / Error */}
        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* No Orders */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No Outstanding Orders
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no outstanding customer orders.
            </p>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && orders.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {orders.length} outstanding{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Order #
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Phone
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Book Title
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Contact
                    </th>

                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {order.first_name} {order.last_name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {order.phone_number}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {order.book_title}
                      </td>

                      <td className="px-6 py-4 capitalize text-gray-600">
                        {order.contact_preference}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
                          {order.status}
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

export default OutstandingOrdersPage;
