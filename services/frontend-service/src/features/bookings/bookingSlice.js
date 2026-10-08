import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyBookings = createAsyncThunk('bookings/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createBookingOrder = createAsyncThunk('bookings/createOrder', async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.post('/bookings/create-order', bookingData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const verifyPayment = createAsyncThunk('bookings/verifyPayment', async (paymentData, { rejectWithValue }) => {
  try {
    const response = await api.post('/bookings/verify-payment', paymentData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  myBookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload.data.bookings;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default bookingSlice.reducer;
