import { createSlice } from '@reduxjs/toolkit';

import { NO_USER_DATA } from '../initialStates';

/**
 * A reducer is a pure function with the sole responsibility of updating the state and nothing else.
 * No side effects are allowed.
 */

/**
 * Actions are a way to indicate what just happened / what is going to happen and update the state accordingly.
 */

/**
 * Create slice allows us
 * To initialise State , create Actions and Reducers in one go
 * Read more here https://redux.js.org/introduction/installation
 */

const userDataSlice = createSlice({
  name: 'userData',
  initialState: NO_USER_DATA,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload;
    },

    userDetailsFetched: (state, action) => {
      state.profile = action.payload.profile;
      state.avatar = action.payload.avatar;
      state.cover = action.payload.cover;
    },

    userProfileFetched: (state, action) => {
      state.profile = action.payload.profile;
    },

    socialEdited: (state, action) => {
      const { social, value } = action.payload;
      switch (social) {
        case 'Snapchat':
          state.profile.snapchat = value;
          break;
        case 'TikTok':
          state.profile.tiktok = value;
          break;
      }
    },

    profileTutorialStageUpdated: (state, action) => {
      state.profile.profile_tutorial_stage = action.payload.stage;
    },

    updateRewards: (state, action) => {
      state.profile.rewards = action.payload.rewards;
    },

    updateNewRewardsReceived: (state, action) => {
      state.profile.newRewardsReceived = action.payload.newRewardsReceived;
    },

    setTaggScore: (state, action) => {
      state.profile.tagg_score = action.payload.tagg_score;
    },

    setNewNotificationReceived: (state, action) => {
      state.newNotificationReceived = action.payload.newNotificationReceived;
    },

    setReplyPosted: (state, action) => {
      state.replyPosted = action.payload.replyPosted;
    },

    setSuggestedPeopleImage: (state, action) => {
      state.suggestedPeopleImage = action.payload.suggestedPeopleImage;
    },

    clearHeaderAndProfileImages: state => {
      state.avatar = '';
      state.cover = '';
    },

    setMomentUploadProgressBar: (state, action) => {
      state.momentUploadProgressBar = action.payload.momentUploadProgressBar;
    },

    setUserProfileTemplate: (state, action) => {
      state.profileTemplate = {
        ...state.profileTemplate,
        ...action.payload,
      };
    },

    removeWidgetFromStore: (state, action) => {
      const idToRemove = action.payload.id;
      Object.keys(state.profileTemplate.widgetStore).forEach(key => {
        state.profileTemplate.widgetStore[key] = state.profileTemplate.widgetStore[key].filter(
          w => w.id !== idToRemove,
        );
      });
    },

    setWidgetsDragChanged: (state, action) => {
      state.widgetsDragChanged = action.payload.changed;
    },

    setUpdateAnalyticStatus: (state, action) => {
      state.analyticsStatus = action.payload.status;
    },

    resetUserData: () => NO_USER_DATA,

    setUserEligiblityForBGTagg: (state, action) => {
      state.userBGTaggEligiblity = action.payload.userBGTaggEligiblity;
    },
    setSkinPermission: (state, action) => {
      state.skinPermission = action.payload.permission;
    },
  },
});

export const {
  userLoggedIn,
  userDetailsFetched,
  socialEdited,
  profileTutorialStageUpdated,
  setNewNotificationReceived,
  setReplyPosted,
  setSuggestedPeopleImage,
  clearHeaderAndProfileImages,
  setMomentUploadProgressBar,
  setUserProfileTemplate,
  removeWidgetFromStore,
  userProfileFetched,
  setWidgetsDragChanged,
  setUpdateAnalyticStatus,
  resetUserData,
  setUserEligiblityForBGTagg,
  updateNewRewardsReceived,
  updateRewards,
  setTaggScore,
  setSkinPermission,
} = userDataSlice.actions;
export const userDataReducer = userDataSlice.reducer;
