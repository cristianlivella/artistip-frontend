import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

export const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setFromApi: (state, action) => {
        Object.assign(state, action.payload);
    },
    clear: (state) => {
        Object.assign(state, initialState);
    }
  },
});

export const { clear, setFromApi } = userSlice.actions;

export default userSlice.reducer;
