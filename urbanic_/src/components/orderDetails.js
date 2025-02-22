import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaDownload, FaTruck, FaUndo, FaCopy } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTrackingData } from "../redux/paymentSlice";
const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);
  // const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);            // State to track loading status
  const [error, setError] = useState(null); 

  const dispatch = useDispatch();
  const trackingData = useSelector((state) => state.payment.trackingData);
  const trackingStatus = useSelector((state) => state.payment.trackingStatus);

  const fetchTracking = async (orderId) => {
    dispatch(fetchTrackingData(orderId));
    // setLoading(true);
    // setError(null); // Reset error before each fetch

    // try {
    //   const response = await fetch(
    //     `http://localhost:5000/api/shiprocket/track-order/${id}`
    //   );

    //   if (!response.ok) {
    //     throw new Error("Failed to fetch tracking data");
    //   }

    //   const data = await response.json();
    //   setTrackingData(data); // Set the tracking data to the state
    //   console.log('tracking data: ',data);
    // } catch (err) {
    //   setError(err.message); // Set error message if the fetch fails
    // } finally {
    //   setLoading(false); // Set loading to false after fetch is complete
    // }
  };


  useEffect(() => {
    const foundOrder = orders.find((o) => o.payment?.orderId === orderId);
    setOrder(foundOrder)
    fetchTracking(foundOrder?._id);
    console.log(trackingData,trackingStatus)
  }, [orderId, orders]);

 

  // Calculate return eligibility
  let returnDisabled = false;
  let returnMessage = "";

  if (order?.status.toLowerCase() === "delivered" && order.deliveryDate) {
    const deliveryDate = new Date(order.deliveryDate); // Assuming `deliveryDate` exists in order object
    const today = new Date();
    const diffDays = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24)); // Difference in days

    if (diffDays > 14) {
      returnDisabled = true;
      returnMessage = "Return window closed";
    }
  }

  if (!order) return <p className="text-center mt-6">Order not found</p>;

  // Invoice Calculation
  const baseFare = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = order.items.reduce(
    (total, item) => total + (item.price * item.discount * item.quantity) / 100,
    0
  );
  const tax = (baseFare - discount) * 0.18; // Assuming 18% tax
  const shipping = baseFare - discount > 499 ? 0 : 99; // Free shipping if total > ₹499
  const finalTotal = baseFare - discount + tax + shipping;

  // Dummy function for invoice download
  const downloadInvoice = () => {
    alert("Downloading invoice...");
  };

  // Order Status Messages
  const statusMessages = {
    processing: { text: "Your order is being processed. Stay tuned!" },
    shipped: { text: "Your order is on its way!" },
    delivered: { text: "Your order has been delivered. Enjoy!" },
    cancelled: { text: "Your order was cancelled." },
  };

  const orderStatus = order?.status ? order.status.toLowerCase() : "processing";

  const statusMessage = statusMessages[orderStatus] || {
    text: "Status unknown",
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold">
        Order #{order.payment.orderId.slice(6)}
      </h2>
      <p className="text-gray-700 my-2">
        <span className="font-semibold">Payment ID:</span>{" "}
        {order.payment.paymentId.slice(4)}
      </p>
      <p className="text-gray-600 font-semibold">
        Date: {new Date(order.date).toLocaleDateString()}
      </p>

      {/* Order Status */}
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between align-top">
          <h3 className="text-lg font-semibold">
            Order Status: <span className="uppercase">{orderStatus}</span>
          </h3>

          {/* Return Order Button */}
          {order.status.toLowerCase() === "delivered" && (
            <div>
              <button
                className={`flex items-center text-sm space-x-2 px-4 py-2 rounded-md ${
                  returnDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white"
                }`}
                disabled={returnDisabled}
              >
                <FaUndo />
                <span>Return Order</span>
              </button>
              {returnDisabled && (
                <p className="text-red-500 mt-2">{returnMessage}</p>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-gray-700">{statusMessage.text}</p>
        <Link className="hover:text-white"  to={`${trackingData?.trackingLink}`}>
        <button className="mt-4 flex items-center space-x-2 px-4 py-2 border-2 bg-white border-black text-black rounded-md hover:bg-black hover:text-white">
          <FaTruck />
          <span className="text-sm">Track Order</span>
        </button>
        </Link>
      </div>

      {/* Items List */}
      <h3 className="mt-6 text-xl font-semibold">Items:</h3>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.name}
            className="flex items-center space-x-4 border p-3 rounded-md"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-20 object-cover rounded-md"
            />
            <div>
              <p className="font-semibold">
                {item.name} x {item.quantity}
              </p>
              <p className="text-gray-600">
                ₹{(item.price - (item.price * item.discount) / 100).toFixed(2)}
                <span className="text-sm text-red-500 line-through ml-2">
                  ₹{item.price}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <h3 className="mt-6 text-xl font-semibold">Price Breakdown:</h3>
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Total MRP:</span>
          <span className="font-semibold">₹{baseFare.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Discount:</span>
          <span className="text-green-600 font-semibold">
            - ₹{discount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Tax (18%):</span>
          <span className="font-semibold">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between py-1 relative group">
          <span className="text-gray-700 flex items-center">
            Shipping Charges
            <FaInfoCircle className="ml-2 text-gray-500 cursor-pointer" />
            <span className="absolute bottom-6 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Free shipping for orders over ₹499
            </span>
          </span>
          <span className="font-semibold">
            {shipping === 99 ? (
              <>
                <span className="text-red-500 mr-2">₹99</span>
              </>
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </span>
        </div>

        <hr className="my-2" />
        <div className="flex justify-between py-2 text-lg font-bold">
          <span>Total Amount:</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons: Invoice & Return */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={downloadInvoice}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md"
        >
          {/* <FaDownload /> */}
          <span className="text-sm">Get Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
