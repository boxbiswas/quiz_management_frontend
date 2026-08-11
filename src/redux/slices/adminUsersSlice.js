import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Fetch all users (students) with optional search
export const fetchAdminUsers = createAsyncThunk(
    'adminUsers/fetchAll',
    async (searchQuery = '', { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/users', {
                params: { search: searchQuery }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Fetch a single user's detailed profile (includes performance & history)
export const fetchAdminUserById = createAsyncThunk(
    'adminUsers/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
        }
    }
);

// Update user status (Activate/Deactivate)
export const updateAdminUserStatus = createAsyncThunk(
    'adminUsers/updateStatus',
    async ({ userId, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/admin/users/${userId}/status`,
                { status }
            );
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

// Delete user
export const deleteAdminUser = createAsyncThunk(
    'adminUsers/delete',
    async (userId, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

const initialState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
};

const adminUsersSlice = createSlice({
    name: 'adminUsers',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAdminUsers
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchAdminUserById
            .addCase(fetchAdminUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedUser = null;
            })
            .addCase(fetchAdminUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchAdminUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateAdminUserStatus
            .addCase(updateAdminUserStatus.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                // Update in list
                const index = state.users.findIndex(u => u.id === updatedUser.id);
                if (index !== -1) {
                    state.users[index].status = updatedUser.status;
                }
                // Update in selected user profile if active
                if (state.selectedUser?.profile?.id === updatedUser.id) {
                    state.selectedUser.profile.status = updatedUser.status;
                }
            })
            // deleteAdminUser
            .addCase(deleteAdminUser.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.users = state.users.filter(u => u.id !== deletedId);
                if (state.selectedUser?.profile?.id === deletedId) {
                    state.selectedUser = null;
                }
            });
    }
});

export const { clearSelectedUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
