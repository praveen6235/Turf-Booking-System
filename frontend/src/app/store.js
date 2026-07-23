import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import turfReducer from '../features/turfs/turfSlice';
import bookingReducer from '../features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    turfs: turfReducer,
    bookings: bookingReducer,
  },
});
