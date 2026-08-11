import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Start a quiz attempt (or resume IN_PROGRESS)
export const startQuizAttempt = createAsyncThunk(
    'studentAttempt/startQuiz',
    async (quizId, thunkAPI) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/start`);
            return response.data; // contains attempt, expiryTime, questions
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to start quiz');
        }
    }
);

// Submit a quiz attempt
export const submitQuizAttempt = createAsyncThunk(
    'studentAttempt/submitQuiz',
    async ({ quizId, answers }, thunkAPI) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
            
            // On success, clear local storage for this quiz
            localStorage.removeItem(`quiz_answers_${quizId}`);
            
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
        }
    }
);

const studentAttemptSlice = createSlice({
    name: 'studentAttempt',
    initialState: {
        activeAttempt: null,
        questions: [],
        expiryTime: null,
        answers: [], // Array of { questionId, selectedOptionId }
        loading: false,
        submitLoading: false,
        error: null,
        submitResult: null
    },
    reducers: {
        // Hydrate answers from local storage on refresh
        hydrateAnswers: (state, action) => {
            state.answers = action.payload;
        },
        setAnswer: (state, action) => {
            const { questionId, selectedOptionId } = action.payload;
            const existingIndex = state.answers.findIndex(a => a.questionId === questionId);
            
            if (existingIndex !== -1) {
                state.answers[existingIndex].selectedOptionId = selectedOptionId;
            } else {
                state.answers.push({ questionId, selectedOptionId });
            }
        },
        clearAttemptState: (state) => {
            state.activeAttempt = null;
            state.questions = [];
            state.expiryTime = null;
            state.answers = [];
            state.error = null;
            state.submitResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Start Quiz
            .addCase(startQuizAttempt.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.submitResult = null;
            })
            .addCase(startQuizAttempt.fulfilled, (state, action) => {
                state.loading = false;
                state.activeAttempt = action.payload.attempt;
                state.expiryTime = action.payload.expiryTime;
                state.questions = action.payload.questions;
            })
            .addCase(startQuizAttempt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Submit Quiz
            .addCase(submitQuizAttempt.pending, (state) => {
                state.submitLoading = true;
                state.error = null;
            })
            .addCase(submitQuizAttempt.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.submitResult = action.payload.result;
            })
            .addCase(submitQuizAttempt.rejected, (state, action) => {
                state.submitLoading = false;
                state.error = action.payload;
            });
    }
});

export const { setAnswer, clearAttemptState, hydrateAnswers } = studentAttemptSlice.actions;
export default studentAttemptSlice.reducer;
