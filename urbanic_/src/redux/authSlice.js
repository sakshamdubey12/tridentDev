import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Async thunk to handle admin login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Replace with secure storage in production

    try {
      if (email === adminEmail && password === adminPassword) {
        return { isAdmin: true }; // Admin login successful
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('https://tridentdev-1.onrender.com/api/auth/send-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        return { message: data.message }; // OTP sent successfully
      } else {
        throw new Error(data.error || 'Error sending OTP');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://tridentdev-1.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        return { token: data.token, userId: data.userId, Data:data.userData }; // OTP verified successfully
      } else {
        throw new Error(data.error || 'Error verifying OTP');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async ({ addressForm, userId }, { rejectWithValue }) => {
    try {
      console.log(addressForm, 'adding address...');
      console.log(userId, 'user ID...');
      
      const response = await fetch("https://tridentdev-1.onrender.com/api/geo/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...addressForm, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const updatedData = await response.json();
      return updatedData.addresses; // Return the saved address
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Async thunk to handle logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://tridentdev-1.onrender.com/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return {}; // Successfully logged out
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateDetails = createAsyncThunk(
  'auth/updateDetails',
  async ({ name, phone, gender, dob, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://tridentdev-1.onrender.com/api/auth/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, gender, dob, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.userData)
        return { token: data.token, userId: data.userId, Data:data.userData }; // OTP verified successfully
      } else {
        throw new Error(data.error || 'Error verifying OTP');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isAdmin: false,
    loading: false,
    error: null,
    token: null,
    userId : null,
    Data: {},
  },
  reducers: {
    // Additional reducers if necessary (e.g., reset state, etc.)
  },
  extraReducers: (builder) => {
    // Admin login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.Data = action.payload.Data;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isLogin = false;
        state.isAdmin = false;
        state.token = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.Data.addresses) {
          state.Data.addresses = [];
        }
        state.Data.addresses.push(action.payload); // Append new address to existing list
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isLogin', 'isAdmin', 'token', 'userId', 'Data'], // Persist only necessary fields
};

export const { resetAuthState } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);

// export default authSlice.reducer;
