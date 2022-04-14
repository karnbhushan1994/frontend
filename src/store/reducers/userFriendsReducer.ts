import { createSlice } from '@reduxjs/toolkit';

import { NO_FRIENDS_DATA } from '../initialStates';

const userFriendsSlice = createSlice({
  name: 'userFriends',
  initialState: NO_FRIENDS_DATA,
  reducers: {
    userFriendsFetched: (state, action) => {
      state.friends = action.payload.friends;
    },

    updateFriends: (state, action) => {
      const { isFriend, data } = action.payload;
      if (!isFriend) {
        const friendInList: boolean = state.friends.some(
          friend => friend.username === data.username,
        );
        if (!friendInList) {
          state.friends.push(data);
        }
      } else {
        state.friends = state.friends.filter(friend => friend.username !== data.username);
      }
    },
    resetUserFriends: () => NO_FRIENDS_DATA,
  },
});

export const { userFriendsFetched, updateFriends, resetUserFriends } = userFriendsSlice.actions;
export const userFriendsReducer = userFriendsSlice.reducer;
