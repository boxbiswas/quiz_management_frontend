import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios'; // Adjust path if necessary
import { toast } from 'react-toastify';

// Retrieve initial user state from sessionStorage as a fallback
const storedUser = JSON.parse(sessionStorage.getItem('user')) || null;

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (emailData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgotPassword', emailData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to process request');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        // resetData should contain { resetToken, newPassword }
        try {
            const response = await api.post('/auth/resetPassword', resetData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password reset failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        isAuthenticated: !!storedUser,
        loading: false,
        error: null,
    },
    reducers: {
        // Fallback synchronous logout (useful for the Axios 401 interceptor)
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem('user');
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Login ---
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                sessionStorage.setItem('user', JSON.stringify(action.payload.user));
                toast.success('Login successful');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // --- Register ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                toast.success('Registration successful! Please log in.');
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // --- Logout ---
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                sessionStorage.removeItem('user');
                toast.success('Logged out successfully');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                if (action.payload && !action.payload.includes('token missing')) {
                    toast.error(action.payload);
                }
                // Force logout anyway if the server request fails
                state.user = null;
                state.isAuthenticated = false;
                sessionStorage.removeItem('user');
            })

            // --- Forgot Password ---
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                toast.success('Password reset instructions sent.');
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // --- Reset Password ---
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                toast.success('Password reset successfully. You can now log in.');
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;