import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage or prefers-color-scheme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const initialState = {
  theme: getInitialTheme(),
  loading: false,
  alert: null,
  modal: {
    isOpen: false,
    content: null,
    title: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAlert(state, action) {
      state.alert = action.payload;
    },
    clearAlert(state) {
      state.alert = null;
    },
    openModal(state, action) {
      state.modal.isOpen = true;
      state.modal.content = action.payload.content;
      state.modal.title = action.payload.title || '';
    },
    closeModal(state) {
      state.modal.isOpen = false;
      state.modal.content = null;
      state.modal.title = '';
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLoading,
  setAlert,
  clearAlert,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer; 