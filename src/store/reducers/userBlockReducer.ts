import { createSlice } from '@reduxjs/toolkit';

import { NO_BLOCKED_USERS } from '../initialStates';

const userBlockSlice = createSlice({
  name: 'userBlock',
  initialState: NO_BLOCKED_USERS,
  reducers: {
    userBlockFetched: (state, action) => {
      state.blockedUsers = action.payload;
    },

    updateBlockedList: (state, action) => {
      const { isBlocked, data } = action.payload;
      if (!isBlocked) {
        state.blockedUsers.push(data);
      } else {
        state.blockedUsers = state.blockedUsers.filter(user => user.username !== data.username);
      }
    },

    resetBlockedList: () => NO_BLOCKED_USERS,
  },
});

export const { userBlockFetched, updateBlockedList, resetBlockedList } = userBlockSlice.actions;
export const userBlockReducer = userBlockSlice.reducer;
