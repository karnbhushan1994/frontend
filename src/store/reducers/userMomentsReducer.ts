import { createSlice } from '@reduxjs/toolkit';

import { NO_MOMENTS } from '../initialStates';

const userMomentsSlice = createSlice({
  name: 'userMoments',
  initialState: NO_MOMENTS,
  reducers: {
    userMomentsFetched: (state, action) => {
      state.moments = action.payload;
    },

    momentCategoryDeleted: (state, action) => {
      const category = action.payload;
      state.moments = state.moments.filter(moment => moment.moment_category !== category);
    },
    resetUserMoments: () => NO_MOMENTS,
  },
});

export const { userMomentsFetched, momentCategoryDeleted, resetUserMoments } =
  userMomentsSlice.actions;
export const userMomentsReducer = userMomentsSlice.reducer;
