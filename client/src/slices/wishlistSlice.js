import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';

const initialState = {
  wishlist: null,
  loading: false,
  error: null,
};

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        return null;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/wishlist', config);
      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get wishlist');
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
          
      dispatch(setAlert({
        type: 'error',
        message,
      }));
      
      return rejectWithValue(message);
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        dispatch(setAlert({
          type: 'info',
          message: 'Please login to add items to your wishlist'
        }));
        return null;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
        retry: 3,
        retryDelay: 1000,
      };

      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 1000;

      while (retries < maxRetries) {
        try {
          const { data } = await axios.post(
            '/api/wishlist',
            { productId },
            config
          );

          dispatch(setLoading(false));
          
          if (data.success) {
            dispatch(setAlert({
              type: 'success',
              message: 'Item added to wishlist'
            }));
            return data.data;
          } else {
            throw new Error(data.message || 'Failed to add to wishlist');
          }
        } catch (error) {
          if (error.response?.status === 429 && retries < maxRetries - 1) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
            continue;
          }
          throw error;
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      let message;
      if (error.response?.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else {
        message = error.response?.data?.message || error.message || 'Failed to add to wishlist';
      }
      
      dispatch(setAlert({
        type: 'error',
        message,
      }));
      
      return rejectWithValue(message);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        return null;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
        retry: 3,
        retryDelay: 1000,
      };

      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 1000;

      while (retries < maxRetries) {
        try {
          const { data } = await axios.delete(`/api/wishlist/${productId}`, config);

          dispatch(setLoading(false));
          
          if (data.success) {
            dispatch(setAlert({
              type: 'success',
              message: 'Item removed from wishlist'
            }));
            return data.data;
          } else {
            throw new Error(data.message || 'Failed to remove from wishlist');
          }
        } catch (error) {
          if (error.response?.status === 429 && retries < maxRetries - 1) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
            continue;
          }
          throw error;
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      
      let message;
      if (error.response?.status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else {
        message = error.response?.data?.message || error.message || 'Failed to remove from wishlist';
      }
      
      dispatch(setAlert({
        type: 'error',
        message,
      }));
      
      return rejectWithValue(message);
    }
  }
);

// Clear wishlist
export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      // Only work with authenticated users
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        return null;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.delete('/api/wishlist', config);

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Wishlist cleared',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to clear wishlist');
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

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.error = null;
      })
      .addCase('auth/logoutUser/fulfilled', (state) => {
        state.wishlist = null;
      })
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 