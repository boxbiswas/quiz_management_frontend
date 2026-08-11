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
export const createAdminCategory = createAsyncThunk(
    'adminCategories/createCategory',
    async (categoryData, thunkAPI) => {
        try {
            const response = await api.post('/categories', categoryData);
            return response.data.category; // Ensure correct property matches backend
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

export const updateAdminCategory = createAsyncThunk(
    'adminCategories/updateCategory',
    async ({ id, categoryData }, thunkAPI) => {
        try {
            const response = await api.put(`/categories/${id}`, categoryData);
            return response.data.category;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteAdminCategory = createAsyncThunk(
    'adminCategories/deleteCategory',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/categories/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

const adminCategoriesSlice = createSlice({
    name: 'adminCategories',
    initialState: {
        categories: [],
        loading: false,
        actionLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
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
            })
            
            // Create
            .addCase(createAdminCategory.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createAdminCategory.fulfilled, (state, action) => {
                state.actionLoading = false;
                if (action.payload) {
                    state.categories.unshift(action.payload);
                }
            })
            .addCase(createAdminCategory.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateAdminCategory.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateAdminCategory.fulfilled, (state, action) => {
                state.actionLoading = false;
                if (action.payload) {
                    const index = state.categories.findIndex(c => c.id === action.payload.id);
                    if (index !== -1) {
                        state.categories[index] = action.payload;
                    }
                }
            })
            .addCase(updateAdminCategory.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteAdminCategory.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteAdminCategory.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            .addCase(deleteAdminCategory.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    }
});

export default adminCategoriesSlice.reducer;
