

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Thunk to fetch orders
// export const fetchOrders = createAsyncThunk(
//   'orders/fetchOrders',
//   async ({userId}) => {
//     const response = await fetch(`http://localhost:5000/api/order/allOrders?userId=${userId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch orders');
//     }
//     return await response.json();
//   }
// );

// // Thunk to create an order
// export const createOrder = createAsyncThunk(
//   'orders/createOrder',
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) throw new Error('Failed to create order');
//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


// export const updateOrderStatus = createAsyncThunk(
//   'orders/updateOrderStatus',
//   async ({orderId, status}) => {
//     const response = await fetch(`http://localhost:5000/api/order/updateStatus`,{
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({status,orderId}),
//     });
//     console.log('ss',response)
//     if (!response.ok) {
//       throw new Error('Failed to fetch orders');
//     }
//     return await response.json();
//   }
// );

// const orderSlice = createSlice({
//   name: 'orders',
//   initialState: {
//     orders: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.push(action.payload);
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
  
//     builder
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const orderReducer = orderSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ userId }) => {
    const response = await fetch(`http://localhost:5000/api/order/allOrders?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return await response.json();
  }
);

// Thunk to create an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }) => {
    const response = await fetch(`http://localhost:5000/api/order/updateStatus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, orderId }),
    });

    console.log('ss', response);

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return await response.json();
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Persist Configuration
const persistConfig = {
  key: 'orders',
  storage,
  whitelist: ['orders'], // Persist only order history
};

export const orderReducer = persistReducer(persistConfig, orderSlice.reducer);
