import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';
import { resetCart } from './cartSlice';

const initialState = {
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod')
    ? localStorage.getItem('paymentMethod')
    : '',
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false,
  page: 1,
  pages: 1,
  total: 0,
};

// Create Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Order placed successfully',
          })
        );
        
        // Clear cart after successful order
        dispatch(resetCart());
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create order');
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

// Get Order Details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);

      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get order details');
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

// Pay Order
export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { dispatch, getState, rejectWithValue }) => {
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
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Payment successful',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Payment failed');
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

// Get My Orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);

      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get orders');
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

// Get All Orders (Admin)
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const { page = 1, status } = params || {};
      
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      
      if (status) {
        queryParams.append('status', status);
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders?${queryParams.toString()}`, config);

      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get orders');
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

// Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { dispatch, getState, rejectWithValue }) => {
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
        `/api/orders/${orderId}/status`,
        { status },
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Order status updated',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update status');
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

// Update Order Tracking (Admin)
export const updateOrderTracking = createAsyncThunk(
  'order/updateOrderTracking',
  async ({ orderId, trackingNumber }, { dispatch, getState, rejectWithValue }) => {
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
        `/api/orders/${orderId}/tracking`,
        { trackingNumber },
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Tracking information updated',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update tracking');
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.shippingAddress = {};
      state.paymentMethod = '';
      state.error = null;
      state.success = false;
      state.loading = false;
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => 
          action.type.startsWith('order/') && 
          action.type.endsWith('/pending') &&
          action.type !== 'order/createOrder/pending',
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => 
          action.type.startsWith('order/') && 
          action.type.endsWith('/rejected') &&
          action.type !== 'order/createOrder/rejected',
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
        state.error = null;
        state.shippingAddress = {};
        state.paymentMethod = '';
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.error = null;
      })
      .addCase(updateOrderTracking.fulfilled, (state, action) => {
        state.loading = false;
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.error = null;
      })
      .addCase('auth/logout/fulfilled', (state) => {
        state.order = null;
        state.orders = [];
        state.shippingAddress = {};
        state.paymentMethod = '';
        state.success = false;
        state.error = null;
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
      });
  },
});

export const { resetOrderState, saveShippingAddress, savePaymentMethod } = orderSlice.actions;

export default orderSlice.reducer; 