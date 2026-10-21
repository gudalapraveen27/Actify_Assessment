import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from '../features/accounts/accountsSlice';
export const store = configureStore({ reducer: { accounts: accountsReducer } });
