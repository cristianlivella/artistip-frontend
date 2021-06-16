import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

export const serverSlice = createSlice({
  name: 'serverInfo',
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

export const { clear, setFromApi } = serverSlice.actions;

export default serverSlice.reducer;
