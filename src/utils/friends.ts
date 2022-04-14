// Handles click on friend/requested/unfriend button

import {
  addFriend,
  friendUnfriendUser,
  unfriendUser,
  updateUserXFriends,
  updateUserXProfileAllScreens,
} from '../store/actions';
import { AppDispatch } from '../store/configureStore';
import { RootState } from '../store/rootReducer';
import { ProfilePreviewType, ProfileInfoType, ScreenType, UserType } from '../types';
import { getUserAsProfilePreviewType } from './users';

/*
   * When user logged in clicks on the friend button:
   A request is sent.
   Which means you have to update the status of their friendshpi to requested
   When the status is changed to requested the button should change to requested.
   When the button is changed to requested and thr user clicks on it,
   a request much go to the backend to delete that request
   When that succeeds, their friendship must be updated to no-record again;
   When the button is changed to no_record, the add friends button should be displayed again
   */
export const handleFriendUnfriend = async (
  screenType: ScreenType,
  user: UserType,
  profile: ProfileInfoType,
  dispatch: AppDispatch,
  state: RootState,
  loggedInUser: UserType,
) => {
  const { friendship_status } = profile;
  await dispatch(
    friendUnfriendUser(
      loggedInUser,
      getUserAsProfilePreviewType(user, profile),
      friendship_status,
      screenType,
    ),
  );
  await dispatch(updateUserXFriends(user.userId, state));
  dispatch(updateUserXProfileAllScreens(user.userId, state));
};

export const handleUnfriend = async (
  screenType: ScreenType,
  friend: ProfilePreviewType,
  dispatch: AppDispatch,
  state: RootState,
) => {
  await dispatch(unfriendUser(friend, screenType));
  await dispatch(updateUserXFriends(friend.id, state));
  dispatch(updateUserXProfileAllScreens(friend.id, state));
};

export const handleAddFriend = async (
  screenType: ScreenType,
  friend: ProfilePreviewType,
  dispatch: AppDispatch,
  state: RootState,
) => {
  const success = await dispatch(addFriend(friend, screenType, state));
  await dispatch(updateUserXFriends(friend.id, state));
  await dispatch(updateUserXProfileAllScreens(friend.id, state));
  return success;
};
