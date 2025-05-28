import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  dbCart: null,
  loading: false,
  error: null,
};

// Get cart from database (for logged in users)
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      if (!auth.userInfo) {
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

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      // First get the product details
      const { data: productData } = await axios.get(`/api/products/${productId}`);
      
      if (!productData.success) {
        throw new Error(productData.message || 'Failed to get product details');
      }
      
      const product = productData.data;
      
      // Check if item is in stock
      if (product.stockQuantity < quantity) {
        dispatch(setLoading(false));
        dispatch(
          setAlert({
            type: 'error',
            message: 'Requested quantity not available in stock',
          })
        );
        return rejectWithValue('Not enough stock available');
      }
      
      const { auth } = getState();
      
      // If user is logged in, add to DB cart
      if (auth.userInfo) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        const { data } = await axios.post(
          '/api/cart',
          { productId, quantity },
          config
        );

        dispatch(setLoading(false));
        
        if (data.success) {
          dispatch(
            setAlert({
              type: 'success',
              message: 'Item added to cart',
            })
          );
          
          return { dbCart: data.data, product, quantity };
        } else {
          throw new Error(data.message || 'Failed to add to cart');
        }
      } else {
        // For guest users, use localStorage cart
        dispatch(setLoading(false));
        
        const { cart } = getState();
        
        // Check if item already in cart
        const existItem = cart.cartItems.find((x) => x._id === productId);
        
        let newCartItems;
        
        if (existItem) {
          newCartItems = cart.cartItems.map((item) =>
            item._id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const price = product.onSale && product.salePrice > 0 
            ? product.salePrice 
            : product.price;
            
          newCartItems = [
            ...cart.cartItems,
            {
              _id: product._id,
              name: product.name,
              image: product.images[0]?.url || '',
              price,
              stockQuantity: product.stockQuantity,
              quantity,
            },
          ];
        }
        
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        dispatch(
          setAlert({
            type: 'success',
            message: 'Item added to cart',
          })
        );
        
        return { cartItems: newCartItems };
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

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity, itemId }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      // If user is logged in, update DB cart
      if (auth.userInfo) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        const { data } = await axios.put(
          `/api/cart/${itemId}`,
          { quantity },
          config
        );

        dispatch(setLoading(false));
        
        if (data.success) {
          dispatch(
            setAlert({
              type: 'success',
              message: 'Cart updated',
            })
          );
          
          return { dbCart: data.data };
        } else {
          throw new Error(data.message || 'Failed to update cart');
        }
      } else {
        // For guest users, update localStorage cart
        dispatch(setLoading(false));
        
        const { cart } = getState();
        
        const newCartItems = cart.cartItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        return { cartItems: newCartItems };
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

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      // If user is logged in, remove from DB cart
      if (auth.userInfo) {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        const { data } = await axios.delete(`/api/cart/${productId}`, config);

        dispatch(setLoading(false));
        
        if (data.success) {
          dispatch(
            setAlert({
              type: 'success',
              message: 'Item removed from cart',
            })
          );
          
          return { dbCart: data.data, productId };
        } else {
          throw new Error(data.message || 'Failed to remove from cart');
        }
      } else {
        // For guest users, remove from localStorage cart
        dispatch(setLoading(false));
        
        const { cart } = getState();
        
        const newCartItems = cart.cartItems.filter((item) => item._id !== productId);
        
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        dispatch(
          setAlert({
            type: 'success',
            message: 'Item removed from cart',
          })
        );
        
        return { cartItems: newCartItems, productId };
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

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      // If user is logged in, clear DB cart
      if (auth.userInfo) {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.userInfo.token}`,
          },
        };

        const { data } = await axios.delete('/api/cart', config);

        dispatch(setLoading(false));
        
        if (data.success) {
          dispatch(
            setAlert({
              type: 'success',
              message: 'Cart cleared',
            })
          );
          
          return { dbCart: data.data };
        } else {
          throw new Error(data.message || 'Failed to clear cart');
        }
      } else {
        // For guest users, clear localStorage cart
        dispatch(setLoading(false));
        
        localStorage.removeItem('cartItems');
        
        dispatch(
          setAlert({
            type: 'success',
            message: 'Cart cleared',
          })
        );
        
        return { cartItems: [] };
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

// Sync local cart with database after login
export const syncCartWithDatabase = createAsyncThunk(
  'cart/syncCartWithDatabase',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth, cart } = getState();
      
      if (!auth.userInfo || cart.cartItems.length === 0) {
        dispatch(setLoading(false));
        return;
      }
      
      // Get DB cart first
      const { data: dbCartData } = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      });
      
      if (!dbCartData.success) {
        throw new Error(dbCartData.message || 'Failed to get cart');
      }
      
      // Add local cart items to DB cart one by one
      for (const item of cart.cartItems) {
        try {
          await axios.post(
            '/api/cart',
            { productId: item._id, quantity: item.quantity },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.userInfo.token}`,
              },
            }
          );
        } catch (error) {
          console.error('Failed to add item to DB cart:', error);
          // Continue with next item
        }
      }
      
      // Get updated cart from DB
      const { data } = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      });
      
      // Clear local storage cart
      localStorage.removeItem('cartItems');
      
      dispatch(setLoading(false));
      
      if (data.success) {
        return { dbCart: data.data, cartItems: [] };
      } else {
        throw new Error(data.message || 'Failed to sync cart');
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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.dbCart = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
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
      )
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.dbCart = action.payload;
        }
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.dbCart) {
          state.dbCart = action.payload.dbCart;
        } else if (action.payload.cartItems) {
          state.cartItems = action.payload.cartItems;
        }
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.dbCart) {
          state.dbCart = action.payload.dbCart;
        } else if (action.payload.cartItems) {
          state.cartItems = action.payload.cartItems;
        }
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.dbCart) {
          state.dbCart = action.payload.dbCart;
        } else if (action.payload.cartItems) {
          state.cartItems = action.payload.cartItems;
        }
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.dbCart) {
          state.dbCart = action.payload.dbCart;
        }
        state.cartItems = [];
        state.error = null;
      })
      .addCase(syncCartWithDatabase.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          if (action.payload.dbCart) {
            state.dbCart = action.payload.dbCart;
          }
          state.cartItems = action.payload.cartItems !== undefined ? action.payload.cartItems : [];
        }
        state.error = null;
      })
      .addCase('auth/logout/fulfilled', (state) => {
        state.dbCart = null;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer; 