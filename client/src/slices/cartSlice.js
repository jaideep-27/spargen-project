import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';

// Helper function to transform DB cart items and calculate total
const transformDbCart = (dbCartData) => {
  if (!dbCartData || !dbCartData.products) {
    return { cartItems: [], total: 0 };
  }
  const cartItems = dbCartData.products.map(item => ({
    itemId: item._id, // This is the cart item's ID from the DB
    product: item.product, // Assuming product is populated with details
    quantity: item.quantity,
    price: item.priceAtPurchase || item.product.price, // Use priceAtPurchase if available
    // Add any other fields CartPage might need directly on the item
  }));
  const total = dbCartData.totalPrice || cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { cartItems, total };
};

// Helper function to calculate total for guest cart
const calculateGuestCartTotal = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
};

// Get cart items from localStorage (for guest users or initial load before hydration)
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage, // For guests, or temp for logged-in until DB cart loads
  dbCart: null, // Stores the raw cart object from the database
  loading: false,
  error: null,
  total: cartItemsFromStorage.length > 0 ? calculateGuestCartTotal(cartItemsFromStorage) : 0, // Initial total for guest cart
};

// Get cart
export const getCart = createAsyncThunk(
  'cart/getCart',
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

      const { data } = await axios.get('/api/cart', config);
      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get cart');
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

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        dispatch(setAlert({
          type: 'info',
          message: 'Please login to add items to your cart'
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

      // First verify product availability
      const { data: productData } = await axios.get(`/api/products/${productId}`, config);
      if (!productData.success) {
        throw new Error(productData.message || 'Failed to get product details');
      }

      const product = productData.data;
      if (!product.isAvailable || product.stockQuantity < quantity) {
        dispatch(setLoading(false));
        dispatch(setAlert({
          type: 'error',
          message: 'Product is not available in the requested quantity'
        }));
        return rejectWithValue('Product not available');
      }

      // Add to cart with retry logic
      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 1000;

      while (retries < maxRetries) {
        try {
          const { data } = await axios.post(
            '/api/cart',
            { productId, quantity },
            config
          );

        dispatch(setLoading(false));
          
        if (data.success) {
            dispatch(setAlert({
              type: 'success',
              message: 'Item added to cart successfully'
            }));
            return data.data;
        } else {
          throw new Error(data.message || 'Failed to add to cart');
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
        message = error.response?.data?.message || error.message || 'Failed to add to cart';
      }
      
      dispatch(setAlert({
        type: 'error',
        message,
      }));
      
      return rejectWithValue(message);
    }
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity, itemId }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
        dispatch(setLoading(false));
        return null;
      }
      
        const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
        };

        const { data } = await axios.put(`/api/cart/${itemId}`, { quantity }, config);
        dispatch(setLoading(false));
      
        if (data.success) {
        dispatch(setAlert({
          type: 'success',
          message: 'Cart updated'
        }));
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update cart');
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

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ itemId }, { dispatch, getState, rejectWithValue }) => { 
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

      const { data } = await axios.delete(`/api/cart/${itemId}`, config);
      dispatch(setLoading(false));
      
        if (data.success) {
        dispatch(setAlert({
          type: 'success',
          message: 'Item removed from cart'
        }));
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to remove from cart');
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

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const { auth } = getState();
      if (auth.userInfo) {
        const config = { headers: { Authorization: `Bearer ${auth.userInfo.token}` } };
        // API clears entire cart for the user
        const { data } = await axios.delete('/api/cart/clear', config); 
        dispatch(setLoading(false));
        if (data.success) {
          dispatch(setAlert({ type: 'success', message: 'Cart cleared' }));
          // Expect backend to return an empty cart structure
          return { updatedCartFromAPI: { products: [], totalPrice: 0 }, isGuest: false }; 
        } else {
          throw new Error(data.message || 'Failed to clear cart');
        }
      } else {
        localStorage.removeItem('cartItems');
        dispatch(setLoading(false));
        dispatch(setAlert({ type: 'success', message: 'Cart cleared' }));
        return { cartItems: [], isGuest: true };
      }
    } catch (error) {
      dispatch(setLoading(false));
      const message = error.response?.data?.message || error.message;
      dispatch(setAlert({ type: 'error', message }));
      return rejectWithValue(message);
    }
  }
);

// Sync local cart with database after login
export const syncCartWithDatabase = createAsyncThunk(
  'cart/syncCartWithDatabase',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const { auth, cart } = getState();
      if (!auth.userInfo || !cart.cartItems || cart.cartItems.length === 0) {
        dispatch(setLoading(false));
        // If nothing to sync, try to get DB cart in case it has items
        if (auth.userInfo) {
            const { data: finalCartData } = await axios.get('/api/cart', {
                 headers: { Authorization: `Bearer ${auth.userInfo.token}` } 
            });
            if (finalCartData.success) {
                return { dbCartData: finalCartData.data, clearLocal: true, isGuestCart: false };
            }
        }
        return { clearLocal: true, isGuestCart: true }; // Clear local, use potentially empty cart
      }
      
      // Sync items: Add each local item to DB. Backend should handle duplicates (e.g., update quantity).
      for (const localItem of cart.cartItems) {
        const productDetails = localItem.product || localItem; // Handle both structures
        try {
          await axios.post(
            '/api/cart',
            { productId: productDetails._id, quantity: localItem.quantity },
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.userInfo.token}` } }
          );
        } catch (syncError) {
          console.error('Failed to sync item to DB cart:', productDetails.name, syncError);
          // Optionally dispatch an alert for per-item sync failure
        }
      }
      
      // After attempting to sync all items, fetch the definitive DB cart
      const { data: finalCartData } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${auth.userInfo.token}` },
      });
      
      localStorage.removeItem('cartItems'); // Clear local cart after sync attempt
      dispatch(setLoading(false));
      
      if (finalCartData.success) {
        dispatch(setAlert({ type: 'success', message: 'Cart synced with your account' }));
        return { dbCartData: finalCartData.data, clearLocal: true, isGuestCart: false };
      } else {
        throw new Error(finalCartData.message || 'Failed to fetch synced cart');
      }
    } catch (error) {
      dispatch(setLoading(false));
      const message = error.response?.data?.message || error.message;
      dispatch(setAlert({ type: 'error', message: `Cart sync failed: ${message}` }));
      // Fallback: might leave user with local cart or try to fetch DB cart again
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.dbCart = null;
      state.error = null;
      state.loading = false;
      state.total = 0;
      localStorage.removeItem('cartItems');
    },
    // This action could be used if a component needs to manually trigger re-derivation
    // of cartItems from dbCart, e.g. if dbCart is updated by a pusher event.
    _deriveCartItemsFromDb: (state) => {
        if (state.dbCart) {
            const { cartItems, total } = transformDbCart(state.dbCart);
            state.cartItems = cartItems;
            state.total = total;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.cartItems = action.payload.items || [];
          state.total = action.payload.totalPrice || 0;
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.cartItems = action.payload.items || [];
          state.total = action.payload.totalPrice || 0;
        }
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.cartItems = action.payload.items || [];
          state.total = action.payload.totalPrice || 0;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.cartItems = action.payload.items || [];
          state.total = action.payload.totalPrice || 0;
        }
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.isGuest) {
          state.cartItems = [];
          state.total = 0;
        } else if (action.payload.updatedCartFromAPI) {
          state.dbCart = action.payload.updatedCartFromAPI; // Should be an empty cart
          const { cartItems, total } = transformDbCart(state.dbCart);
          state.cartItems = cartItems; // Should be []
          state.total = total; // Should be 0
        }
      })
      .addCase(syncCartWithDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.dbCartData) {
          state.dbCart = action.payload.dbCartData;
          const { cartItems, total } = transformDbCart(state.dbCart);
          state.cartItems = cartItems;
          state.total = total;
        } else if (action.payload.clearLocal && action.payload.isGuestCart) {
            // This case means user logged in, had no local items OR sync failed but we fallback to empty/guest
            state.cartItems = [];
            state.total = 0;
        }
        if (action.payload.clearLocal) {
            localStorage.removeItem('cartItems'); // Ensure it's cleared
        }
      })
      .addCase('auth/logoutUser/fulfilled', (state) => {
        state.dbCart = null;
        state.cartItems = [];
        state.total = 0;
        localStorage.removeItem('cartItems');
      })
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetCart, _deriveCartItemsFromDb } = cartSlice.actions;

export default cartSlice.reducer; 