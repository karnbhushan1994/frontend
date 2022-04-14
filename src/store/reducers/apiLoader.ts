import { createSlice } from '@reduxjs/toolkit';

import { APP_LOADER } from '../initialStates';

const apiLoader = createSlice({
  name: 'apiLoader',
  initialState: APP_LOADER,
  reducers: {
    setApiLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setApiLoader } = apiLoader.actions;
export const apiLoaderReducer = apiLoader.reducer;
