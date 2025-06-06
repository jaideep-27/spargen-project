import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';
import { syncCartWithDatabase } from './cartSlice';
import { resetCart } from './cartSlice';
import { resetWishlist } from './wishlistSlice';

// Get user info from localStorage
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo,
  isAuthenticated: !!userInfo,
  error: null,
};

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/register',
        { firstName, lastName, email, password },
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: data.message || 'Registration successful! Please check your email to verify your account.',
          })
        );
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
          
      dispatch(
        setAlert({
          type: 'error',
          message,
        })
      );
      
      return rejectWithValue(message);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        await dispatch(syncCartWithDatabase());
        return data.data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
          
      dispatch(
        setAlert({
          type: 'error',
          message,
        })
      );
      
      return rejectWithValue(message);
    }
  }
);

// Logout User
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('userInfo');
    dispatch(resetCart());
    dispatch(resetWishlist());
    dispatch(
      setAlert({
        type: 'success',
        message: 'Logged out successfully',
      })
    );
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/auth/profile',
        userData,
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Profile updated successfully',
          })
        );
        
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        return data.data;
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
          
      dispatch(
        setAlert({
          type: 'error',
          message,
        })
      );
      
      return rejectWithValue(message);
    }
  }
);

// Get User Profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.userInfo?.token) {
      return rejectWithValue('No token found, user not authenticated.');
    }
    try {
      dispatch(setLoading(true));
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/auth/profile', config);
      dispatch(setLoading(false));
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify({ ...auth.userInfo, ...data.data }));
        return data.data;
      } else {
        localStorage.removeItem('userInfo');
        dispatch(logout());
        throw new Error(data.message || 'Failed to get profile, logging out.');
      }
    } catch (error) {
      dispatch(setLoading(false));
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message !== 'Logged out successfully') {
        dispatch(
          setAlert({
            type: 'error',
            message,
          })
        );
      }
      localStorage.removeItem('userInfo');
      return rejectWithValue(message);
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationToken, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const { data } = await axios.get(
        `/api/auth/verify-email/${verificationToken}`
      );
      dispatch(setLoading(false));

      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: data.message || 'Email verified successfully! You can now log in.',
          })
        );
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        return data.data;
      } else {
        throw new Error(data.message || 'Email verification failed');
      }
    } catch (error) {
      dispatch(setLoading(false));
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(
        setAlert({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer; 