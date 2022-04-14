import { createSlice } from '@reduxjs/toolkit';

import { ScreenType } from 'types/types';

import { EMPTY_SCREEN_TO_USERS_LIST, EMPTY_USER_X } from '../initialStates';

const userXSlice = createSlice({
  name: 'userX',
  initialState: EMPTY_SCREEN_TO_USERS_LIST,
  reducers: {
    userXRequested: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId] =
        state[<ScreenType>action.payload.screenType][action.payload.userId] || EMPTY_USER_X;
    },

    userXProfileFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].profile =
        action.payload.data;
    },

    userXUserFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].user =
        action.payload.user;
    },

    userXMomentCategoriesFetched: (state, action) => {
      const categories: string[] = action.payload.data;
      state[<ScreenType>action.payload.screenType][action.payload.userId].momentCategories =
        categories;
    },

    userXMomentsFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].moments =
        action.payload.data;
    },

    userXFriendsFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].friends =
        action.payload.data;
    },

    userXAvatarFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].avatar =
        action.payload.data;
    },

    userXCoverFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].cover =
        action.payload.data;
    },

    userXSocialsFetched: (state, action) => {
      state[<ScreenType>action.payload.screenType][action.payload.userId].socialAccounts =
        action.payload.data;
    },

    userXFriendshipEdited: (state, action) => {
      state[<ScreenType>action.payload.screenType][
        action.payload.userId
      ].profile.friendship_status = action.payload.data;
    },

    resetScreen: (state, action) => {
      for (let userId in state[<ScreenType>action.payload.screenType]) {
        state[<ScreenType>action.payload.screenType][userId] = EMPTY_USER_X;
      }
    },

    setUserXProfileTemplate: (state, action) => {
      const userX = state[<ScreenType>action.payload.screenType][action.payload.userId];
      userX.profileTemplate = {
        ...userX.profileTemplate,
        ...action.payload.profileTemplate,
      };
    },
  },
});

export const {
  userXUserFetched,
  userXRequested,
  userXAvatarFetched,
  userXFriendsFetched,
  userXCoverFetched,
  userXMomentsFetched,
  userXProfileFetched,
  userXSocialsFetched,
  userXMomentCategoriesFetched,
  userXFriendshipEdited,
  resetScreen,
  setUserXProfileTemplate,
} = userXSlice.actions;
export const userXReducer = userXSlice.reducer;
