import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import {Link} from "react-router-dom"
const PreviousOrders = () => {
  const dispatch = useDispatch()
  // const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State to track selected category
  const { orders } = useSelector((state) => state.orders);
  const userId = useSelector((state)=> state.auth.userId)

  useEffect(() => {
    // Simulate a delay for fetching data based on category
    dispatch(fetchOrders({userId}))
  }, [selectedCategory]);

  const filteredOrders = orders.filter((order) => {
    if (selectedCategory === "All") return true;
    return order.status === selectedCategory;
  });

   // Calculate stats
   const totalOrders = orders.length;
   const unpaidOrders = orders.filter((order) => order.status === "Unpaid").length;
   const processingOrders = orders.filter((order) => order.status === "Processing").length;
   const shippedOrders = orders.filter((order) => order.status === "Shipped").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white p-4 shadow-md flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <div className="flex space-x-6">
          <button
            className={`text-sm font-medium ${selectedCategory === "All" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          <button
            className={`text-sm font-medium ${selectedCategory === "Unpaid" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("Unpaid")}
          >
            Unpaid
          </button>
          <button
            className={`text-sm font-medium ${selectedCategory === "Processing" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("Processing")}
          >
            Processing
          </button>
          <button
            className={`text-sm font-medium ${selectedCategory === "Shipped" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("Shipped")}
          >
            Shipped
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center bg-gray-50 py-4">
        {loading ? (
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        ) : orders.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-700">No related orders</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl p-6">
            {filteredOrders.map((order) => (
             <div key={order.payment.orderId} className="border-b p-4 mb-6 bg-white shadow-lg rounded-md">
             <Link to={`/order/${order.payment.orderId}`}><h3 className="text-xl font-semibold">Order #{order.payment.orderId}</h3></Link>

             {/* Order Date and Total */}
             <div className="flex justify-between mt-2">
               <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
               <p className="text-lg font-semibold text-gray-800">Total: ${order.totalAmount}</p>
             </div>

             {/* Items List */}
             <div className="mt-4">
               <div className="flex flex-wrap space-x-4">
                 {order.items.map((item) => (
                   <div key={item.name} className="flex items-center space-x-3">
                     <img
                       src={item.imageUrl || "https://via.placeholder.com/50"}
                       alt={item.name}
                       className="w-12 h-16 object-cover rounded-md"
                     />
                     <div className="flex flex-col gap-1">
                       <div className="flex gap-2">
                         <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                         <p className="text-sm font-semibold text-gray-700">x {item.quantity}</p>
                       </div>
                       <div className="flex gap-2">
                         <p className="text-sm font-semibold text-gray-600">
                           ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
                         </p>
                         <p className="text-sm text-red-500 line-through">${item.price}</p>
                       </div>
                       <div className="flex gap-2">
                         <div className="text-sm text-gray-500">{item.size} /</div>
                         <div
                           style={{ backgroundColor: item.selectedColor, width: "16px", height: "16px" }}
                           className="inline-block rounded-md m-1"
                         ></div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

         
           </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousOrders;
