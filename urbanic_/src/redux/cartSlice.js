// import { createSlice } from '@reduxjs/toolkit';

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     items: [],
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       const newItem = {...action.payload.product, size:action.payload.size,selectedColor:action.payload.selectedColor}
//       const existingItem = state.items.find(
//         (item) =>
//           item.id === newItem.id &&
//           item.selectedColor === newItem.selectedColor &&
//           item.size === newItem.size
//       );
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         state.items.push({ ...newItem, quantity: 1 });
//       }
//       console.log('Adding to cart:',newItem);
      
      
//     },
//     incrementQuantity: (state, action) => {
//       const { id, selectedColor, size } = action.payload;
//       const item = state.items.find(
//         (item) =>
//           item.id === id &&
//           item.selectedColor === selectedColor &&
//           item.size === size
//       );
//       if (item) {
//         item.quantity += 1;
//       }
//     },

//     decrementQuantity: (state, action) => {
//       const { id, color, size } = action.payload;
//       const itemIndex = state.items.findIndex(
//         (item) =>
//           item.id === id &&
//           item.color === color &&
//           item.size === size
//       );

//       if (itemIndex !== -1) {
//         if (state.items[itemIndex].quantity > 1) {
//           state.items[itemIndex].quantity -= 1;
//         } else {
//           state.items.splice(itemIndex, 1);
//         }
//       }
//     },

//     removeFromCart: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Create cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    trackingData: null,
    availability: null,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = {
        ...action.payload.product,
        size: action.payload.size,
        selectedColor: action.payload.selectedColor,
      };
      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.selectedColor === newItem.selectedColor &&
          item.size === newItem.size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },

    incrementQuantity: (state, action) => {
      const { id, selectedColor, size } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.size === size
      );
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action) => {
      const { id, selectedColor, size } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.size === size
      );

      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },

    removeFromCart: (state) => {
      state.items = [];
    },
  },
  
});

// Redux Persist Configuration
const persistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'], // Persist only the cart items
};

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart } = cartSlice.actions;
export default persistReducer(persistConfig, cartSlice.reducer);
