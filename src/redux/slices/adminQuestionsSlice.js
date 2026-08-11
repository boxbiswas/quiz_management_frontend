import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

export const fetchAdminQuestions = createAsyncThunk(
    'adminQuestions/fetchQuestions',
    async (quizId, thunkAPI) => {
        try {
            const response = await api.get(`/quizzes/${quizId}/questions`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
        }
    }
);

export const createAdminQuestion = createAsyncThunk(
    'adminQuestions/createQuestion',
    async ({ quizId, questionData }, thunkAPI) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
            return response.data.question;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create question');
        }
    }
);

export const updateAdminQuestion = createAsyncThunk(
    'adminQuestions/updateQuestion',
    async ({ id, questionData }, thunkAPI) => {
        try {
            // Note: Update and Delete routes are mounted at /questions/:id, not nested under /quizzes/
            const response = await api.put(`/questions/${id}`, questionData);
            return response.data.question;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update question');
        }
    }
);

export const deleteAdminQuestion = createAsyncThunk(
    'adminQuestions/deleteQuestion',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/questions/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete question');
        }
    }
);

const adminQuestionsSlice = createSlice({
    name: 'adminQuestions',
    initialState: {
        questions: [],
        loading: false,
        actionLoading: false,
        error: null,
    },
    reducers: {
        clearQuestionsState: (state) => {
            state.questions = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAdminQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchAdminQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create
            .addCase(createAdminQuestion.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createAdminQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                if (action.payload) {
                    state.questions.push(action.payload);
                }
            })
            .addCase(createAdminQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateAdminQuestion.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateAdminQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                if (action.payload) {
                    const index = state.questions.findIndex(q => q.id === action.payload.id);
                    if (index !== -1) {
                        state.questions[index] = action.payload;
                    }
                }
            })
            .addCase(updateAdminQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteAdminQuestion.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(deleteAdminQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.questions = state.questions.filter(q => q.id !== action.payload);
            })
            .addCase(deleteAdminQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearQuestionsState } = adminQuestionsSlice.actions;
export default adminQuestionsSlice.reducer;
