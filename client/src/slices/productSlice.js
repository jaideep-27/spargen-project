import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert, setLoading } from './uiSlice';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    metal: '',
    gemstone: '',
    search: '',
    sort: 'newest',
  },
  topProducts: [],
};

// Get Products
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { page = 1, ...filters } = params || {};
      const { product } = getState();
      
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      
      // Add active filters from state or new filters
      const activeFilters = { ...product.filters, ...filters };
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value) queryParams.append(key, value);
      }
      
      const { data } = await axios.get(`/api/products?${queryParams.toString()}`);
      dispatch(setLoading(false));
      
      if (data.success) {
        return {
          products: data.data.products,
          page: data.data.page,
          pages: data.data.pages,
          total: data.data.total,
          filters: activeFilters,
        };
      } else {
        throw new Error(data.message || 'Failed to fetch products');
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

// Get Product Details
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { data } = await axios.get(`/api/products/${id}`);
      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch product details');
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

// Get Top Products
export const getTopProducts = createAsyncThunk(
  'product/getTopProducts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { data } = await axios.get('/api/products/top');
      dispatch(setLoading(false));
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch top products');
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

// Create Product Review
export const createProductReview = createAsyncThunk(
  'product/createProductReview',
  async ({ productId, rating, comment }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: data.message || 'Review added successfully',
          })
        );
        return { review: data.data.review, rating: data.data.rating, productId }; 
      } else {
        throw new Error(data.message || 'Failed to add review');
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

// Create Product (Admin)
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/products',
        productData,
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Product created successfully',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create product');
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

// Update Product (Admin)
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { dispatch, getState, rejectWithValue }) => {
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
        `/api/products/${id}`,
        productData,
        config
      );

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Product updated successfully',
          })
        );
        
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update product');
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

// Delete Product (Admin)
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.delete(`/api/products/${id}`, config);

      dispatch(setLoading(false));
      
      if (data.success) {
        dispatch(
          setAlert({
            type: 'success',
            message: 'Product deleted successfully',
          })
        );
        
        return id;
      } else {
        throw new Error(data.message || 'Failed to delete product');
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

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductDetails: (state) => {
      state.product = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        minPrice: '',
        maxPrice: '',
        metal: '',
        gemstone: '',
        search: '',
        sort: 'newest',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
        state.filters = action.payload.filters;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.product && state.product._id === action.payload.productId) {
          if (!state.product.reviews) {
            state.product.reviews = [];
          }
          state.product.reviews.push(action.payload.review);
          state.product.rating = action.payload.rating;
        }
        const productIndex = state.products.findIndex(p => p._id === action.payload.productId);
        if (productIndex !== -1) {
          if (!state.products[productIndex].reviews) {
            state.products[productIndex].reviews = [];
          }
          state.products[productIndex].reviews.push(action.payload.review);
          state.products[productIndex].rating = action.payload.rating;
        }
        state.error = null;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Add to products list
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProductIndex = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (updatedProductIndex !== -1) {
          state.products[updatedProductIndex] = action.payload;
        }
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
        if(state.product && state.product._id === action.payload){
            state.product = null; // Clear product details if current product deleted
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductDetails, setFilters, clearFilters } = productSlice.actions;

export default productSlice.reducer; 