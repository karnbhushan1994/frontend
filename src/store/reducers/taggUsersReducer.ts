import { createSlice } from '@reduxjs/toolkit';

import { NO_TAGG_USERS } from '../initialStates';

const taggUsersSlice = createSlice({
  name: 'taggUsers',
  initialState: NO_TAGG_USERS,
  reducers: {
    taggUsersFetched: (state, action) => {
      state.recentSearches = action.payload.recentSearches;
    },
    resetTaggUsers: () => NO_TAGG_USERS,
  },
});

export const { taggUsersFetched, resetTaggUsers } = taggUsersSlice.actions;
export const taggUsersReducer = taggUsersSlice.reducer;
