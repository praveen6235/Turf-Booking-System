import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTurfs = createAsyncThunk('turfs/fetchAll', async (queryString = '', { rejectWithValue }) => {
  try {
    const response = await api.get(`/turfs${queryString}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchTurfDetails = createAsyncThunk('turfs/fetchDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/turfs/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  turfs: [],
  currentTurf: null,
  loading: false,
  error: null,
};

const turfSlice = createSlice({
  name: 'turfs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurfs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTurfs.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = action.payload.data.turfs;
      })
      .addCase(fetchTurfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch turfs';
      })
      .addCase(fetchTurfDetails.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTurfDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTurf = action.payload.data.turf;
      })
      .addCase(fetchTurfDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch turf details';
      });
  },
});

export default turfSlice.reducer;
