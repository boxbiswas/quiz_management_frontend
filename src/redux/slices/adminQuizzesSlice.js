import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Async Thunks
export const fetchAdminQuizzes = createAsyncThunk(
    'adminQuizzes/fetchQuizzes',
    async (searchQuery = '', thunkAPI) => {
        try {
            const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
            const response = await api.get(`/quizzes${queryParam}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
        }
    }
);

export const fetchAdminQuizById = createAsyncThunk(
    'adminQuizzes/fetchQuizById',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/quizzes/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz details');
        }
    }
);

export const createAdminQuiz = createAsyncThunk(
    'adminQuizzes/createQuiz',
    async (quizData, thunkAPI) => {
        try {
            const response = await api.post('/quizzes', quizData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
        }
    }
);

export const updateAdminQuiz = createAsyncThunk(
    'adminQuizzes/updateQuiz',
    async ({ id, quizData }, thunkAPI) => {
        try {
            const response = await api.put(`/quizzes/${id}`, quizData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
        }
    }
);

export const deleteAdminQuiz = createAsyncThunk(
    'adminQuizzes/deleteQuiz',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/quizzes/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
        }
    }
);

export const updateAdminQuizStatus = createAsyncThunk(
    'adminQuizzes/updateQuizStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await api.patch(`/quizzes/${id}/publish`, { status });
            return response.data.quiz; // Ensure we return the updated quiz object
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update quiz status');
        }
    }
);

const adminQuizzesSlice = createSlice({
    name: 'adminQuizzes',
    initialState: {
        quizzes: [],
        currentQuiz: null,
        loading: false,
        error: null,
        actionLoading: false, // For create/update/delete operations
    },
    reducers: {
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Quizzes
            .addCase(fetchAdminQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload;
            })
            .addCase(fetchAdminQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Quiz By ID
            .addCase(fetchAdminQuizById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentQuiz = null;
            })
            .addCase(fetchAdminQuizById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchAdminQuizById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Quiz
            .addCase(createAdminQuiz.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createAdminQuiz.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.quizzes.unshift(action.payload.quiz);
            })
            .addCase(createAdminQuiz.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update Quiz
            .addCase(updateAdminQuiz.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateAdminQuiz.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.quizzes.findIndex(q => q.id === action.payload.quiz.id);
                if (index !== -1) {
                    state.quizzes[index] = { ...state.quizzes[index], ...action.payload.quiz };
                }
                if (state.currentQuiz?.id === action.payload.quiz.id) {
                    state.currentQuiz = { ...state.currentQuiz, ...action.payload.quiz };
                }
            })
            .addCase(updateAdminQuiz.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Delete Quiz
            .addCase(deleteAdminQuiz.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteAdminQuiz.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
            })
            .addCase(deleteAdminQuiz.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update Status (Publish/Unpublish)
            .addCase(updateAdminQuizStatus.fulfilled, (state, action) => {
                const index = state.quizzes.findIndex(q => q.id === action.payload.id);
                if (index !== -1) {
                    state.quizzes[index].status = action.payload.status;
                }
                if (state.currentQuiz?.id === action.payload.id) {
                    state.currentQuiz.status = action.payload.status;
                }
            });
    }
});

export const { clearCurrentQuiz } = adminQuizzesSlice.actions;
export default adminQuizzesSlice.reducer;
