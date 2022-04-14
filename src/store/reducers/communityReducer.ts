import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  show: false,
};

const communityPopupSlice = createSlice({
  name: 'communityPopup',
  initialState: INITIAL_STATE,
  reducers: {
    showCommunityPopup: (state, action) => {
      state.show = action.payload;
    },
  },
});

export const { showCommunityPopup } = communityPopupSlice.actions;
export const communityPopupReducer = communityPopupSlice.reducer;
