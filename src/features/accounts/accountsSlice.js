import { createSlice, nanoid } from '@reduxjs/toolkit';
import { dummyAccounts } from '../../data/dummyAccounts';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: { records: dummyAccounts, loading: false, error: null },
  reducers: {
    addAccount: { reducer(state, action) { state.records.unshift(action.payload); }, prepare(account) { return { payload: { ...account, id: nanoid() } }; } },
    updateAccount(state, action) { const i = state.records.findIndex((record) => record.id === action.payload.id); if (i !== -1) state.records[i] = { ...state.records[i], ...action.payload }; },
    deleteAccount(state, action) { state.records = state.records.filter((record) => record.id !== action.payload); },
    setAccountStatus(state, action) { const record = state.records.find((entry) => entry.id === action.payload.id); if (record) record.status = action.payload.status; },
  }
});

export const { addAccount, updateAccount, deleteAccount, setAccountStatus } = accountsSlice.actions;
export const selectAccounts = (state) => state.accounts.records;
export default accountsSlice.reducer;
