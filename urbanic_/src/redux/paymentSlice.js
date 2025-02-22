import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Async Thunks

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  'payment/createRazorpayOrder',
  async ({ userId, finalTotal, discount, cartItems }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userId,
          totalAmount: (finalTotal - discount).toFixed(0),
          items: cartItems,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data; // Return order data
    } catch (error) {
      toast.error('Error creating Razorpay order');
      return rejectWithValue(error.message);
    }
  }
);

// Verify Razorpay payment
export const verifyRazorpayPayment = createAsyncThunk(
  'payment/verifyRazorpayPayment',
  async ({ userId, finalTotal, discount, cartItems, name, phone, address, paymentData }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userId,
          totalAmount: (finalTotal - discount).toFixed(0),
          items: cartItems,
          name,
          phone,
          address,
          payment: {
            orderId: paymentData.razorpay_order_id,
            paymentId: paymentData.razorpay_payment_id,
            signature: paymentData.razorpay_signature,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success('Order Placed Successfully!');

      return result; // Return order verification response
    } catch (error) {
      toast.error('Error verifying payment');
      return rejectWithValue(error.message);
    }
  }
);

// Create Shiprocket order
export const createShiprocketOrder = createAsyncThunk(
  'payment/createShiprocketOrder',
  async ({ orderId, name, phone, address, totalPrice, cartItems }, { rejectWithValue }) => {
    
    try {
      const response = await fetch('http://localhost:5000/api/shiprocket/create-shiprocket-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customer_name: name,
          phone,
          address,
          total_price: totalPrice.toFixed(0),
          items: cartItems,
        }),
      });

      const trackingData = await response.json();
      if (!response.ok) throw new Error(trackingData.message);

      return trackingData; // Return tracking data
    } catch (error) {
      toast.error('Error creating Shiprocket order');
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Tracking Data
export const fetchTrackingData = createAsyncThunk(
  'payment/fetchTrackingData',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shiprocket/track-order/${id}`);

      if (!response.ok) throw new Error('Failed to fetch tracking data');

      const data = await response.json();
      return data; // Return tracking data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkPincodeAvailability = createAsyncThunk(
  'payment/checkPincodeAvailability',
  async (pincode, { rejectWithValue }) => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      toast.info('Please enter a valid 6-digit PIN code.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return rejectWithValue('Invalid Pincode');
    }

    try {
      const response = await fetch(`http://localhost:5000/api/check-pincode/${pincode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Payment Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    orderData: null,
    orderStatus: 'idle',
    paymentStatus: 'idle',
    shippingStatus: 'idle',
    trackingStatus: 'idle', 
    trackingData: null,
    error: null,
    pincodeAvailability: null, // New state for pincode check
    pincodeStatus: 'idle',     // Status of pincode check
    pincodeError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Razorpay Order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.orderStatus = 'loading';
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.orderStatus = 'succeeded';
        state.orderData = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.orderStatus = 'failed';
        state.error = action.payload;
      })

      // Verify Razorpay Payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.paymentStatus = 'loading';
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state) => {
        state.paymentStatus = 'succeeded';
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.payload;
      })

      // Shiprocket Order
      .addCase(createShiprocketOrder.pending, (state) => {
        state.shippingStatus = 'loading';
      })
      .addCase(createShiprocketOrder.fulfilled, (state, action) => {
        state.shippingStatus = 'succeeded';
      })
      .addCase(createShiprocketOrder.rejected, (state, action) => {
        state.shippingStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch Tracking Data
      .addCase(fetchTrackingData.pending, (state) => {
        state.trackingStatus = 'loading';
      })
      .addCase(fetchTrackingData.fulfilled, (state, action) => {
        state.trackingStatus = 'succeeded';
        state.trackingData = action.payload;
      })
      .addCase(fetchTrackingData.rejected, (state, action) => {
        state.trackingStatus = 'failed';
        state.error = action.payload;
      })

       // **Check Pincode Availability**
       .addCase(checkPincodeAvailability.pending, (state) => {
        state.pincodeStatus = 'loading';
        state.pincodeAvailability = null;
        state.pincodeError = null;
      })
      .addCase(checkPincodeAvailability.fulfilled, (state, action) => {
        state.pincodeStatus = 'succeeded';
        state.pincodeAvailability = action.payload;
      })
      .addCase(checkPincodeAvailability.rejected, (state, action) => {
        state.pincodeStatus = 'failed';
        state.pincodeError = action.payload;
      });
  },
});

export default paymentSlice.reducer;
