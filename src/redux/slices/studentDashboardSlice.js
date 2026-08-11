import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

export const fetchStudentDashboardStats = createAsyncThunk(
    'studentDashboard/fetchStats',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/student/dashboard');
            return response.data; // { statistics, recentAttempts, performanceData }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

const studentDashboardSlice = createSlice({
    name: 'studentDashboard',
    initialState: {
        statistics: null,
        recentAttempts: [],
        performanceData: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload.statistics;
                state.recentAttempts = action.payload.recentAttempts;
                state.performanceData = action.payload.performanceData;
            })
            .addCase(fetchStudentDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default studentDashboardSlice.reducer;
