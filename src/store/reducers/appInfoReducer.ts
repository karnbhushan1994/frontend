import { createSlice } from '@reduxjs/toolkit';

import { NO_APP_INFO } from '../initialStates';

const appInfoSlice = createSlice({
  name: 'appInfo',
  initialState: NO_APP_INFO,
  reducers: {
    setEnvironment: (state, action) => {
      state.environment = action.payload.environment;
    },
    setNewVersionAvailable: (state, action) => {
      state.newVersionAvailable = action.payload.newVersionAvailable;
    },
  },
});

export const { setEnvironment, setNewVersionAvailable } = appInfoSlice.actions;
export const appInfoReducer = appInfoSlice.reducer;
