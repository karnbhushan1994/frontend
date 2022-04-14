import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  showTutorial: false,
  tutorialType: 'addTagg',
};

const profileTutorialSlice = createSlice({
  name: 'tutorialPopup',
  initialState: INITIAL_STATE,
  reducers: {
    showTutorialPopup: (state, action) => {
      state.showTutorial = action.payload;
    },
    setTutorialType: (state, action) => {
      state.tutorialType = action.payload;
    },
  },
});

export const { showTutorialPopup, setTutorialType } = profileTutorialSlice.actions;
export const profileTutorialReducer = profileTutorialSlice.reducer;
