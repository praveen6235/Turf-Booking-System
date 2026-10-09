import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import turfReducer from '../features/turfs/turfSlice';
import bookingReducer from '../features/bookings/bookingSlice';
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    turfs: turfReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
  },
});
