
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userReducer';
import expensesReducer from './slices/expensesReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        expenses: expensesReducer
    }
})
export default store;