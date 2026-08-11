import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

export const fetchAdminDashboardStats = createAsyncThunk(
    'adminDashboard/fetchStats',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/admin/analytics');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch admin analytics');
        }
    }
);

const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState: {
        statistics: null,
        passFailAnalytics: null,
        popularQuizzes: [],
        popularCategories: [],
        charts: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload.statistics;
                state.passFailAnalytics = action.payload.passFailAnalytics;
                state.popularQuizzes = action.payload.popularQuizzes;
                state.popularCategories = action.payload.popularCategories;
                state.charts = action.payload.charts;
            })
            .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminDashboardSlice.reducer;
