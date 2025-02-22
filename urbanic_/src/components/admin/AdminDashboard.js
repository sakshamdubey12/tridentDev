import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import OrderSection from "./OrderSection";
import ProductsSection from "./ProductsSection";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { fetchProducts } from "../../redux/productSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, isAdmin } = useSelector((state) => state.auth);
  const { products, isLoading } = useSelector((state) => state.products);
  
  const [orders, setOrders] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Orders"); // Track selected category (Orders or Products)

   useEffect(() => {
      dispatch(fetchProducts());
    }, [dispatch]);

  useEffect(() => {
    // Simulate a delay for fetching data based on selected category
    setTimeout(() => {
      if (selectedCategory === "Orders") {
        // Fetch orders (replace with real API call)
        const fetchedOrders = [
          { id: 1, status: "Unpaid", date: "2024-01-01", totalAmount: 100, items: ["Item 1", "Item 2"] },
          { id: 2, status: "Processing", date: "2024-01-02", totalAmount: 50, items: ["Item 3"] },
          { id: 3, status: "Shipped", date: "2024-01-03", totalAmount: 150, items: ["Item 4", "Item 5"] },
        ];
        setOrders(fetchedOrders);
      } else if (selectedCategory === "Products") {
        // Fetch products (replace with real API call)
        const fetchedProducts = [
          { id: 1, name: "Product 1", price: 100, discount: 10, available: true },
          { id: 2, name: "Product 2", price: 50, discount: 5, available: false },
        ];
        // setProducts(fetchedProducts);
      }

      setLoading(false);
    }, 2000); // Simulated delay
  }, [selectedCategory]);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to admin login page
  };

  // Calculate stats for orders and products
  const totalOrders = orders.length;
  const unpaidOrders = orders.filter(order => order.status === "Unpaid").length;
  const processingOrders = orders.filter(order => order.status === "Processing").length;
  const shippedOrders = orders.filter(order => order.status === "Shipped").length;

  const totalProducts = products.length;
  const availableProducts = products.filter(product => product.available).length;
  const unavailableProducts = totalProducts - availableProducts;

  return (
    <div className="min-h-screen absolute top-0 z-10 bg-gray-50 flex flex-col">
      <div className="w-full bg-white p-4 shadow-md flex items-center justify-between">
        <div className="flex ">
        <h2 className="text-3xl px-4 font-bold">Admin Dashboard</h2>
        <button className=" font-bold  scale-150 rounded-md " onClick={handleLogout}><MdLogout /></button>

        </div>
        <div className="flex space-x-6 p-4">
          <button
            className={`text-md font-medium ${selectedCategory === "Orders" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("Orders")}
          >
            Orders
          </button>
          <button
            className={`text-md font-medium ${selectedCategory === "Products" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setSelectedCategory("Products")}
          >
            Products
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center space-x-8 p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-500">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Unpaid Orders</h3>
          <p className="text-2xl font-bold text-red-500">{unpaidOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Shipped Orders</h3>
          <p className="text-2xl font-bold text-green-500">{shippedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Processing Orders</h3>
          <p className="text-2xl font-bold text-yellow-500">{processingOrders}</p>
        </div>
      </div>

      <div className="flex justify-center space-x-8 p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-blue-500">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Available Products</h3>
          <p className="text-2xl font-bold text-green-500">{availableProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
          <h3 className="text-xl font-semibold mb-2">Unavailable Products</h3>
          <p className="text-2xl font-bold text-red-500">{unavailableProducts}</p>
        </div>
      </div>

      {/* Display Selected Category */}
      <div className="flex flex-col w-screen items-center py-4">
        {loading ? (
          // Show the loading spinner while data is being fetched
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        ) : selectedCategory === "Orders" ? (
          <OrderSection orders={orders} />
        ) : (
          <ProductsSection allProducts={products} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
