import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { fetchOrders, updateOrderStatus } from "../../redux/orderSlice"; // Import the Thunk action

const OrderSection = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders); // Access the orders state from Redux
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Fetch orders when category or search query changes
  useEffect(() => {
    dispatch(fetchOrders({ userId: "" }));
  }, [dispatch]);

  // Filter orders based on category
  const filteredOrders = orders.filter((order) => {
    if (selectedCategory === "All") return true;
    return order.status === selectedCategory;
  });

  // Filter orders based on search query (by Order ID)
  const searchedOrders = filteredOrders.filter((order) =>
    order.payment.orderId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalOrders = orders.length;
  const unpaidOrders = orders.filter(
    (order) => order.status === "Unpaid"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  // Handle status change
  const handleChangeStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({orderId, status:newStatus}))
    // Update order status logic (You could dispatch another thunk here)
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
      </div>

      {/* Categories and stats */}
      <div className="p-4 flex items-center space-x-6">
        <div className="flex space-x-6">
          <button
            className={`text-sm font-medium ${
              selectedCategory === "All"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All ({totalOrders})
          </button>
          <button
            className={`text-sm font-medium ${
              selectedCategory === "Unpaid"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedCategory("Unpaid")}
          >
            Unpaid ({unpaidOrders})
          </button>
          <button
            className={`text-sm font-medium ${
              selectedCategory === "Processing"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedCategory("Processing")}
          >
            Processing ({processingOrders})
          </button>
          <button
            className={`text-sm font-medium ${
              selectedCategory === "Shipped"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedCategory("Shipped")}
          >
            Shipped ({shippedOrders})
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 flex items-center space-x-6">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md text-sm"
        />
      </div>

      {/* Orders List */}
      <div className="flex justify-center items-center w-full py-4 min-h-[200px]">
        {loading ? (
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        ) : error ? (
          <div className="text-center w-full">
            <p className="text-lg text-red-500">Error: {error}</p>
          </div>
        ) : searchedOrders.length === 0 ? (
          <div className="text-center w-full">
            <p className="text-lg text-gray-700">
              No orders found for this category.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-4xl p-6">
            {searchedOrders.map((order) => (
              <div
                key={order._id}
                className="border-b p-4 mb-6 bg-white shadow-lg rounded-md"
              >
                <h3 className="text-xl font-semibold">
                  Order #{order.payment.orderId}
                </h3>

                {/* Order Date and Total */}
                <div className="flex justify-between mt-2">
                  <p className="text-gray-600">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* Items List */}
                <div className="mt-4">
                  <div className="flex flex-wrap space-x-4">
                    {order.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={
                            item.imageUrl || "https://via.placeholder.com/50"
                          }
                          alt={item.name}
                          className="w-12 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <p className="text-sm font-semibold text-gray-700">
                              {item.name}
                            </p>
                            <p className="text-sm font-semibold text-gray-700">
                              x {item.quantity}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <p className="text-sm font-semibold text-gray-600">
                              $
                              {(
                                item.price -
                                (item.price * item.discount) / 100
                              ).toFixed(2)}
                            </p>
                            <p className="text-sm text-red-500 line-through">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="text-sm text-gray-500">
                              {item.size} /
                            </div>
                            <div
                              style={{
                                backgroundColor: item.selectedColor,
                                width: "16px",
                                height: "16px",
                              }}
                              className="inline-block rounded-md m-1"
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Status: {order.status}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleChangeStatus(order._id, e.target.value)
                    }
                    className="mt-2 border p-2 rounded-md text-sm"
                  >
                    <option
                      disabled={order.payment.status === "Paid"}
                      value="Unpaid"
                    >
                      Unpaid
                    </option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSection;
