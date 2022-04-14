import { createSlice } from '@reduxjs/toolkit';

import { NO_SOCIALS } from '../initialStates';

const userSocialsSlice = createSlice({
  name: 'userSocials',
  initialState: NO_SOCIALS,
  reducers: {
    individualSocialfetched: (state, actions) => {
      state.socialAccounts[actions.payload.socialType] = actions.payload.social;
    },
    userSocialsFetched: (state, action) => {
      state.socialAccounts = action.payload;
    },
    resetSocialData: () => NO_SOCIALS,
  },
});

export const { userSocialsFetched, individualSocialfetched, resetSocialData } =
  userSocialsSlice.actions;
export const userSocialsReducer = userSocialsSlice.reducer;
