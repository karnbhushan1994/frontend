import { combineReducers } from 'redux';

import bannerReducer from 'store/reducers/bannerReducer';

import {
  userDataReducer,
  userSocialsReducer,
  userFriendsReducer,
  userMomentsReducer,
  taggUsersReducer,
  userBlockReducer,
  userXReducer,
  momentCategoriesReducer,
  userNotificationsReducer,
  appInfoReducer,
  profileTutorialReducer,
} from './reducers';
import { apiLoaderReducer } from './reducers/apiLoader';
import { communityPopupReducer } from './reducers/communityReducer';
import internetState from './reducers/internetState';

/**
 * Combine all the reducers in our application.
 */

const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  user: userDataReducer,
  friends: userFriendsReducer,
  moments: userMomentsReducer,
  notifications: userNotificationsReducer,
  socialAccounts: userSocialsReducer,
  taggUsers: taggUsersReducer,
  blocked: userBlockReducer,
  momentCategories: momentCategoriesReducer,
  userX: userXReducer,
  banner: bannerReducer,
  communityPopup: communityPopupReducer,
  profileTutorial: profileTutorialReducer,
  apiLoader: apiLoaderReducer,
  internetState: internetState,
});

/**
 * This RootState export is needed when a component subscribes to a slice of the state.
 */
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
