import { createSlice } from '@reduxjs/toolkit';

import { NO_NOTIFICATIONS } from '../initialStates';

const userNotificationsSlice = createSlice({
  name: 'userNotifications',
  initialState: NO_NOTIFICATIONS,
  reducers: {
    userNotificationsFetched: (state, action) => {
      state.notifications = action.payload;
    },
    resetNotifications: () => NO_NOTIFICATIONS,
  },
});

export const { userNotificationsFetched, resetNotifications } = userNotificationsSlice.actions;
export const userNotificationsReducer = userNotificationsSlice.reducer;
