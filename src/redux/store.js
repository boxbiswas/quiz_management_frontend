import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import adminQuizzesReducer from './slices/adminQuizzesSlice';
import adminCategoriesReducer from './slices/adminCategoriesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        adminUsers: adminUsersReducer,
        adminQuizzes: adminQuizzesReducer,
        adminCategories: adminCategoriesReducer,
    },
});