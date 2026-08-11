import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Fetch published quizzes (supports search, category, difficulty)
export const fetchStudentQuizzes = createAsyncThunk(
    'studentQuizzes/fetchQuizzes',
    async (params, thunkAPI) => {
        try {
            // Construct query string manually to avoid passing undefined values
            const queryParams = new URLSearchParams();
            if (params?.search) queryParams.append('search', params.search);
            if (params?.category) queryParams.append('category', params.category);
            if (params?.difficulty) queryParams.append('difficulty', params.difficulty);

            const response = await api.get(`/quizzes?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
        }
    }
);

// Fetch specific quiz details
export const fetchStudentQuizDetails = createAsyncThunk(
    'studentQuizzes/fetchQuizDetails',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/quizzes/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz details');
        }
    }
);

const studentQuizzesSlice = createSlice({
    name: 'studentQuizzes',
    initialState: {
        quizzes: [],
        currentQuiz: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Quizzes
            .addCase(fetchStudentQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload;
            })
            .addCase(fetchStudentQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Quiz Details
            .addCase(fetchStudentQuizDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentQuizDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchStudentQuizDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentQuiz } = studentQuizzesSlice.actions;
export default studentQuizzesSlice.reducer;
