import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Fetch Leaderboard
export const fetchLeaderboard = createAsyncThunk(
    'leaderboard/fetchLeaderboard',
    async ({ type, metric, categoryId }, { rejectWithValue }) => {
        try {
            let url = `/leaderboard?type=${type}&metric=${metric}`;
            if (type === 'category' && categoryId) {
                url += `&categoryId=${categoryId}`;
            }
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch leaderboard'
            );
        }
    }
);

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState: {
        rankings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.rankings = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default leaderboardSlice.reducer;
