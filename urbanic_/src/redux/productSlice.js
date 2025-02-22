import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Async thunk to fetch products from API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('http://localhost:5000/api/products'); // Replace with your actual API URL
    const data = await response.json();
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({id}) => {
    const response = await fetch(`http://localhost:5000/api/products/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    // Replace with your actual API URL
    const data = await response.json();
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({id,Productdata}) => {
    const response = await fetch(`http://localhost:5000/api/products/${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Productdata),
      });

    // Replace with your actual API URL
    const data = await response.json();
    return data;
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async ({Productdata}) => {
    const response = await fetch(`http://localhost:5000/api/products`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Productdata),
      });

    // Replace with your actual API URL
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

      builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// Persist Configuration
const persistConfig = {
  key: 'products',
  storage,
  whitelist: ['products'], // Persist only order history
};

// export default productSlice.reducer;
export const productReducer = persistReducer(persistConfig, productSlice.reducer);