// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import {productReducer} from './productSlice';
import { orderReducer } from './orderSlice';
import paymentReducer from './paymentSlice';
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Redux Persist
    }),
});
export const persistor = persistStore(store);
export default store;
