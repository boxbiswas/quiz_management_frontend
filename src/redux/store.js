import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import adminQuizzesReducer from './slices/adminQuizzesSlice';
import adminCategoriesReducer from './slices/adminCategoriesSlice';
import adminQuestionsReducer from './slices/adminQuestionsSlice';
import studentQuizzesReducer from './slices/studentQuizzesSlice';
import studentAttemptReducer from './slices/studentAttemptSlice';
import studentDashboardReducer from './slices/studentDashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminUsers: adminUsersReducer,
        adminQuizzes: adminQuizzesReducer,
        adminCategories: adminCategoriesReducer,
        adminQuestions: adminQuestionsReducer,
        studentQuizzes: studentQuizzesReducer,
        studentAttempt: studentAttemptReducer,
        studentDashboard: studentDashboardReducer,
    },
});