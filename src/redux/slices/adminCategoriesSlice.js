import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

export const fetchAdminCategories = createAsyncThunk(
    'adminCategories/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const adminCategoriesSlice = createSlice({
    name: 'adminCategories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchAdminCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminCategoriesSlice.reducer;
