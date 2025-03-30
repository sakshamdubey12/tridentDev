  import React, { useState,useEffect } from "react";
import { FiEdit, FiSave, FiPlusCircle, FiTrash } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { logout, updateDetails } from "../redux/authSlice";
import { fetchOrders } from "../redux/orderSlice";
import { Link } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("personal"); // Default section
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing personal details
  const { orders } = useSelector((state) => state.orders);
  const {userId,Data }= useSelector((state)=> state.auth);

  const [userData, setUserData] = useState({
    name: Data.name,
    email: Data.email,
    phone: Data.phone,
    gender: Data.gender,
    dob: Data.dob ? new Date(Data.dob).toISOString().split("T")[0] : "", // Convert to YYYY-MM-DD format
    addresses: Data.addresses,
});


  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    houseNo: '',
    building: '',
    street: '',
    locality: '',
    pincode: '',
    city: '',
    state: '',
  });

   useEffect(() => {
      // Simulate a delay for fetching data based on category
      dispatch(fetchOrders({userId}))
      // console.log(orders)
      // console.log('xx',userData)

    }, []);

  // Handle input change
  const handleChange = (e) => {
    console.log(e)
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle adding a new address
  const handleAddAddress = async () => {
    console.log(addressForm,'addind address...')
    console.log(userData,'existing addresses...')
    if (!addressForm.houseNo || !addressForm.street) return;
  
    setLoading(true);
  
    try {
      const response = await fetch("https://tridentdev-1.onrender.com/api/geo/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...addressForm,userId}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save address");
      }
  
      const savedAddress = await response.json();
      // Add the new address returned from the backend to the list
      setUserData((prevData) => ({
        ...prevData,
        addresses: [...prevData.addresses, savedAddress],
      }));
  
      setIsModalOpen(false);
      setAddressForm({
        houseNo: "",
        building: "",
        street: "",
        locality: "",
        pincode: "",
        city: "",
        state: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting an address
  const handleDeleteAddress = (index) => {
    const updatedAddresses = userData.addresses.filter((_, i) => i !== index);
    setUserData({ ...userData, addresses: updatedAddresses });
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };



  const getLocationAndSaveAddress = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=pk.a873f6af9d4344153af7ba1a5f5b6752&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const { address } = data;

          setAddressForm({
            houseNo: address.house_number || '',
            building: address.building || '',
            street: address.road || '',
            locality: address.suburb || '',
            pincode: address.postcode || '',
            city: address.city || '',
            state: address.state || '',
          });
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      });
    }
  };
  const handleEditDetails =()=>{
    dispatch(updateDetails({
      email:userData.email,
      name:userData.name,
      phone:userData.phone,
      gender:userData.gender,
      dob:userData.dob,
      userId:userId,
    }))
  }

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 min-h-[75vh] rounded-md shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">My Profile</h2>

        {/* Navigation List */}
        <div className="flex justify-between border-b pb-2 mb-4 text-gray-600 font-semibold">
          <button
            className={`w-1/5 text-center ${activeSection === "personal" ? "border-b-2 border-black text-black" : ""}`}
            onClick={() => setActiveSection("personal")}
          >
            Personal Details
          </button>
          <button
            className={`w-1/6 text-center ${activeSection === "address" ? "border-b-2 border-black text-black" : ""}`}
            onClick={() => setActiveSection("address")}
          >
            Address
          </button>
          <button
            className={`w-1/5 text-center ${activeSection === "orders" ? "border-b-2 border-black text-black" : ""}`}
            onClick={() => setActiveSection("orders")}
          >
            Previous Orders
          </button>
          <button
            className={`w-1/5 text-center ${activeSection === "returns" ? "border-b-2 border-black text-black" : ""}`}
            onClick={() => setActiveSection("returns")}
          >
            Return Policy
          </button>
          <button className="w-1/5 text-center text-red-600" onClick={handleLogout}>
            <MdLogout className="inline-block mr-1" /> Logout
          </button>
        </div>

        {/* Personal Details Section */}
        {activeSection === "personal" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <FiSave onClick={handleEditDetails} size={20} /> : <FiEdit size={20} />}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-gray-600">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-2 py-1 mt-1 disabled:bg-gray-100"
                />
              </label>

              <label className="block">
                <span className="text-gray-600">Email:</span>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-2 py-1 mt-1 disabled:bg-gray-100"
                />
              </label>

              <label className="block">
                <span className="text-gray-600">Phone:</span>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-2 py-1 mt-1 disabled:bg-gray-100"
                />
              </label>

              <label className="block">
                <span className="text-gray-600">Gender:</span>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-2 py-1 mt-1 disabled:bg-gray-100"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-gray-600">Date of Birth:</span>
                <input
                  type="date"
                  name="dob"
                  value={userData.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border rounded px-2 py-1 mt-1 disabled:bg-gray-100"
                />
              </label>
            </div>
          </div>
        )}
        {activeSection === "orders" && (
          <div>
             <div className="w-full max-w-4xl p-6">
            {orders.slice(0,2).map((order) => (
             <div key={order.payment.orderId} className="border-b p-4 mb-6 bg-white shadow-lg rounded-md">
             <h3 className="text-xl font-semibold">Order #{order.payment.orderId}</h3>

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
          <div className="">
            <Link  to="/previous-orders">
            View More
            </Link>
            </div>
          </div>
        )}

        {/* Address Section */}
        {activeSection === "address" && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>
            {userData.addresses.map((address, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                <p>{address.houseNo}, {address.building}, {address.street}, {address.locality}, {address.city}, {address.state}, {address.pincode}</p>
                <button
                  onClick={() => handleDeleteAddress(index)}
                  className="text-gray-500 hover:text-black"
                >
                  <FiTrash size={18} />
                </button>
              </div>
            ))}

            {/* Add New Address */}
            <div className="flex mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 flex gap-2 bg-black text-xs text-white rounded"
              >
                <FiPlusCircle size={18} /> New Address
              </button>
            </div>
          </div>
        )}

        {/* Modal for Adding New Address */}
        {isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md w-96 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">Add New Address</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          {/* House No */}
          <label className="block">
            <span className="text-gray-600 text-sm">House No</span>
            <input
              type="text"
              name="houseNo"
              value={addressForm.houseNo}
              onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>

           {/* Street */}
           <label className="block">
            <span className="text-gray-600 text-sm">Street</span>
            <input
              type="text"
              name="street"
              value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>

          {/* Pincode */}
          <label className="block">
            <span className="text-gray-600 text-sm">Pincode  </span>
            <input
              type="text"
              name="pincode"
              value={addressForm.pincode}
              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
        </div>

        {/* Right Column */}
        <div>
          {/* Building */}
          <label className="block">
            <span className="text-gray-600 text-sm">Building</span>
            <input
              type="text"
              name="building"
              value={addressForm.building}
              onChange={(e) => setAddressForm({ ...addressForm, building: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
         

          {/* Locality */}
          <label className="block">
            <span className="text-gray-600 text-sm">Locality</span>
            <input
              type="text"
              name="locality"
              value={addressForm.locality}
              onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>

          {/* City */}
          <label className="block">
            <span className="text-gray-600 text-sm">City</span>
            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>

          {/* State */}
          <label className="block">
            <span className="text-gray-600 text-sm">State</span>
            <input
              type="text"
              name="state"
              value={addressForm.state}
              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {/* Use My Location Button */}
        <button
          onClick={getLocationAndSaveAddress}
          className="px-4 py-2 bg-black text-xs text-white rounded hover:bg-gray-700"
        >
          Use My Location
        </button>

        {/* Save Button */}
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-black text-xs text-white rounded hover:bg-gray-700"
        >
          Save Address
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-black text-xs text-white rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default Profile;