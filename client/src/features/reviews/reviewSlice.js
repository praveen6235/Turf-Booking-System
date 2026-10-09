import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTurfReviews = createAsyncThunk('reviews/fetchTurfReviews', async (turfId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/turfs/${turfId}/reviews`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch reviews' });
  }
});

export const fetchMyReviews = createAsyncThunk('reviews/fetchMyReviews', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  } catch (err) {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (fallbackErr) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch user reviews' });
    }
  }
});

export const createReview = createAsyncThunk('reviews/createReview', async ({ turfId, rating, review }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/turfs/${turfId}/reviews`, { rating, review });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to submit review' });
  }
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (reviewId, { rejectWithValue }) => {
  try {
    await api.delete(`/reviews/${reviewId}`);
    return reviewId;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to delete review' });
  }
});

const initialState = {
  turfReviews: [],
  myReviews: [],
  loading: false,
  submitting: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewState: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Turf Reviews
      .addCase(fetchTurfReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurfReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.turfReviews = action.payload?.data?.reviews || [];
      })
      .addCase(fetchTurfReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Fetch My Reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload?.data?.reviews || [];
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Create / Update Review
      .addCase(createReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitting = false;
        const newRev = action.payload?.data?.review;
        if (newRev) {
          // Update myReviews
          const existingIdx = state.myReviews.findIndex(r => r._id === newRev._id);
          if (existingIdx >= 0) {
            state.myReviews[existingIdx] = newRev;
          } else {
            state.myReviews.unshift(newRev);
          }
          // Update turfReviews if viewing same turf
          const existingTurfIdx = state.turfReviews.findIndex(r => r._id === newRev._id);
          if (existingTurfIdx >= 0) {
            state.turfReviews[existingTurfIdx] = newRev;
          } else {
            state.turfReviews.unshift(newRev);
          }
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Error submitting review';
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.myReviews = state.myReviews.filter(r => r._id !== deletedId);
        state.turfReviews = state.turfReviews.filter(r => r._id !== deletedId);
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
