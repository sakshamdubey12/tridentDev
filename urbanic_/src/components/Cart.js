import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../redux/cartSlice';
import { createRazorpayOrder, verifyRazorpayPayment, createShiprocketOrder } from '../redux/paymentSlice';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdOutlinePayment } from 'react-icons/md';
import { TbTruckReturn } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const isLogin = useSelector((state) => state.auth.isLogin); // Check if the user is logged in
  const {userId, Data} = useSelector((state) => state.auth); // Assuming you store userId after login
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const baseFare = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const siteDiscount = cartItems.reduce((total, item) => total + (item.price * item.discount * item.quantity) / 100, 0);
  const tax = (baseFare - siteDiscount) * 0.18; // Assuming 18% tax
  const shipping = baseFare - siteDiscount > 499 ? 0 : 99; // Free shipping if total > ₹499
  console.log(shipping)
  // const finalTotal = (baseFare - siteDiscount + tax + shipping);  
  const finalTotal = parseFloat((baseFare - siteDiscount + tax + shipping).toFixed(2));


  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  
  const applyCoupon = () => {
    // Assuming predefined coupon codes
    const validCoupons = {
      'DISCOUNT10': 10, // 10% discount
      'FREESHIP': 50,   // ₹50 
    };
  
    if (validCoupons[couponCode]) {
      const discountValue = validCoupons[couponCode];
      if (couponCode === 'DISCOUNT10') {
        const discountAmount = (total * 0.10).toFixed(2); // 10% off
        setDiscount(discountAmount);
      } else {
        setDiscount(discountValue);
      }
    } else {
      toast.error('Invalid Coupon Code');
      setDiscount(0); // Reset discount if invalid
    }
  };
  
  // const handlePayment = async () => {
  //   if (!name || !phone) {
  //     toast.error('Please enter name and phone number');
  //     return;
  //   }
  //   setIsModalOpen(false);

  //   setIsLoading(true); // Show loading spinner

  //   try {
  //     const response = await fetch('http://localhost:5000/api/create-razorpay-order', { // Updated route
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         user: userId,
  //         totalAmount: (finalTotal - discount).toFixed(0),
  //         items: cartItems,
          
  //       }),
  //     });
      
  //     const { id, amount, currency } = await response.json();

  //     if (response.ok) {
  //       openRazorpayCheckout(id, amount, currency); // Open Razorpay checkout form
  //     } else {
  //       toast.error('Error creating Razorpay order');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Something went wrong');
  //   } finally {
  //     setIsLoading(false); // Hide loading spinner
  //   }
  // };
  const handlePayment = async () => {
    if (!name || !phone) {
      toast.error('Please enter name and phone number');
      return;
    }

    setIsModalOpen(false);
    setIsLoading(true);

    try {
      const orderResponse = await dispatch(createRazorpayOrder({
        userId,
        finalTotal,
        discount,
        cartItems
      })).unwrap();

      openRazorpayCheckout(orderResponse.id, orderResponse.amount, orderResponse.currency);
    } catch (error) {
      toast.error('Error creating Razorpay order');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckOut = () => {
    if (!isLogin) {
      toast.info('Login to place order!', { position: 'top-right', autoClose: 3000 });
      handleLoginRedirect();
      return;
    }
    setIsModalOpen(true);
  };

  const handleProceed = () => {
    if (!name || !phone) {
      toast.error('Please enter name and phone number');
      return;
    }
    toast.success('Proceeding to payment');
    setIsModalOpen(false);
    // Here you can trigger the Razorpay payment function
  };

  // Redirect to login page if not logged in
  const handleLoginRedirect = () => {
    toast.info('Login to place order!', {
      position: 'top-right',
      autoClose: 3000,
    });
    navigate('/account');
  };

  // Open Razorpay Checkout
  // const openRazorpayCheckout = (orderId, amount, currency) => {
  //   const options = {
  //     key: "rzp_test_18EThdPFVH1GIf", // Razorpay key
  //     amount: amount, // Total amount (in paise)
  //     currency: currency,
  //     name: 'Your Company Name',
  //     description: 'Order Payment',
  //     order_id: orderId,
  //     handler: async function (response) {
  //       console.log(response)
  //       await verifyPayment(response); // Once payment is done, verify it on the backend
  //     },
  //     prefill: {
  //       name: 'Your Name',
  //       email: 'your-email@example.com',
  //       contact: '1234567890',
  //     },
  //   };

  //   const razorpay = new window.Razorpay(options);
  //   razorpay.open();
  // };
  const openRazorpayCheckout = (orderId, amount, currency) => {
    const options = {
      key: "rzp_test_18EThdPFVH1GIf",
      amount: amount,
      currency: currency,
      name: 'Your Company Name',
      description: 'Order Payment',
      order_id: orderId,
      handler: async function (response) {
        await verifyPayment(response);
      },
      prefill: {
        name,
        email: 'your-email@example.com',
        contact: phone,
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Verify Payment
//   const verifyPayment = async (paymentData) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/verify-razorpay-payment', { // Updated route
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: userId,
//           totalAmount: (finalTotal - discount).toFixed(0),
//           items: cartItems,
//           name: name,
//           phone:phone,
//           address: address,
//           payment: {
//             orderId: paymentData.razorpay_order_id,
//             paymentId: paymentData.razorpay_payment_id,
//             signature: paymentData.razorpay_signature,
//           },
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log(result)
//         toast.success('Order Placed!');

//  // Send Order to Shiprocket
//  const shiprocketResponse = await fetch("http://localhost:5000/api/shiprocket/create-shiprocket-order", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//       orderId: result._id, // Order ID from backend
//       customer_name: name,
//       phone: phone,
//       address: address,
//       total_price: (finalTotal - discount).toFixed(0),
//       items: cartItems
//   })
// });

// const trackingData = await shiprocketResponse.json();
// console.log("Tracking Info:", trackingData);

//         dispatch(removeFromCart()); // Empty the cart
//         navigate('/previous-orders'); // Redirect to success page
//       } else {
//         toast.error(result.message || 'Payment verification failed');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Error verifying payment');
//     }
//   };
  const verifyPayment = async (paymentData) => {
    try {
      const verifyResponse = await dispatch(verifyRazorpayPayment({
        userId,
        finalTotal,
        discount,
        cartItems,
        name,
        phone,
        address,
        paymentData,
      })).unwrap();

      // toast.success('Order Placed Successfully!');
      console.log(verifyResponse.order)
      const shiprocketResponse = await dispatch(createShiprocketOrder({
        orderId: verifyResponse.order._id,
        name,
        phone,
        address,
        totalPrice: finalTotal - discount,
        cartItems,
      })).unwrap();

      console.log("Tracking Info:", shiprocketResponse);
      dispatch(removeFromCart());
      navigate('/previous-orders');
    } catch (error) {
      toast.error('Payment verification failed');
    }
  };


  return (
    <div className="cart">
      {cartItems.length === 0 ? (
        <div className="empty-cart absolute left-1/3 text-center">
          <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            It seems like you haven't added any items to your cart yet. Let's fix that!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="cart-item">
            <h2>My Bag ({cartItems.length})</h2>
            {cartItems.map((item) => (
              <div style={{ display: 'flex', margin: '5px' }} key={item.id}>
                <img style={{ height: '250px' }} src={item.imageUrl} alt={item.name} />
                <div>
                  <div style={{ color: 'grey', width: '400px', marginLeft: '10px', marginBottom: '30px' }}>
                    {item.name}
                  </div>
                  <div>
                    <div style={{ display: 'flex', margin: '5px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            backgroundColor: `${item.selectedColor}`,
                            marginLeft: '5px',
                            height: '20px',
                            width: '20px',
                            borderRadius: '50%',
                          }}
                          className="color"
                        ></div>
                        <div style={{ marginLeft: '5px' }}> / {item.size}</div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <AiOutlinePlusCircle
                          onClick={() => dispatch(incrementQuantity(item))}
                          style={{ marginRight: '10px' }}
                          className="icon"
                        />
                        <b>{item.quantity}</b>
                        <AiOutlineMinusCircle
                          onClick={() => dispatch(decrementQuantity(item))}
                          style={{ marginLeft: '10px' }}
                          className="icon"
                        />
                      </div>
                    </div>
                    <div style={{ marginLeft: '10px', marginTop: '30px' }}>
                      <b>₹{item.price}</b>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="checkout">
            {/* <h2>Price Details</h2> */}
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
              <div>Total MRP:</div>
              <div>
                <b>₹{baseFare.toFixed(2)}</b>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
              <div>Discount:</div>
              <div>
                <b>₹{siteDiscount.toFixed(2)}</b>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
              <div>Tax:</div>
              <div>
                <b>₹{tax.toFixed(2)}</b>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
              <div>Shipping Charges:</div>
              <div>
                <b>₹{shipping.toFixed(2)}</b>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
              <div>
                <b>TOTAL:</b>
              </div>
              <div>
                <b>₹{finalTotal.toFixed(2)}</b>
              </div>
            </div>
            <button
              onClick={handleCheckOut}
              style={{
                width: '100%',
                marginTop: '30px',
                borderRadius: '5px',
              }}
              disabled={cartItems.length === 0 || isLoading}
              className="button-2"
            >
              {isLoading ? 'Processing...' : `CHECKOUT(${cartItems.length})`}
            </button>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              Do you have a discount coupon? Add in the next step.
            </div>
            <hr
              style={{
                background: 'rgb(216 202 202)',
                width: '100%',
                marginTop: '30px',
              }}
            />
            <div style={{ marginTop: '28px', display: 'flex' }}>
              <LiaShippingFastSolid style={{ fontWeight: 'lighter', fontSize: '20px', marginRight: '5px' }} />
              <div>Free Shipping for orders ₹990</div>
            </div>
            <div style={{ marginTop: '28px', display: 'flex' }}>
              <MdOutlinePayment style={{ fontWeight: 'lighter', fontSize: '20px', marginRight: '5px' }} />
              <div> Secure Payment & Checkout</div>
            </div>
            <div style={{ marginTop: '28px',marginBottom: '28px', display: 'flex' }}>
              <TbTruckReturn style={{ fontWeight: 'lighter', fontSize: '20px', marginRight: '5px' }} />
              <div> Easy Return , Free Pick Up</div>
            </div>
          </div>
        </>
      )}

      {/* Modal for Address Input */}
    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Enter Shipping Details</h2>
      <label className="block mb-2">
        <span className="text-gray-600">Name:</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="Enter your name"
        />
      </label>

      <label className="block mb-2">
        <span className="text-gray-600">Phone:</span>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="Enter phone number"
        />
      </label>

      <label className="block mb-2">
        <span className="text-gray-600">Select Address:</span>
        <select onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-2 py-1 mt-1">
          <option>Select address</option>
          {
            Data.addresses.map((address, index) => (
              <option key={index}
                value={`${address.houseNo}, ${address.building}, ${address.street}, ${address.locality}, ${address.pincode}, ${address.city}, ${address.state}`}>
                {address.houseNo}, {address.building}, {address.street}, {address.locality}, {address.pincode}, {address.city}, {address.state}
              </option>
            ))
          }
        </select>
      </label>

      {/* Coupon Code Section */}
      <label className="block mb-2 mt-4">
        <span className="text-gray-600">Enter Coupon Code:</span>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="Enter coupon code"
        />
      </label>

      {/* Apply Coupon Button */}
      <button
        onClick={applyCoupon}
        className="px-4 py-2 bg-gray-300 rounded mt-2"
      >
        Apply Coupon
      </button>

      {/* Display Applied Discount */}
      {discount > 0 && (
        <div className="mt-2 text-green-600">
          <span>Coupon Applied: -₹{discount}</span>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button onClick={handlePayment} className="px-4 py-2 bg-black text-white rounded">
          Proceed
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Cart;


