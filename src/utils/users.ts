import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ReactNativeVersionInfo from 'react-native-version-info';

import { AnalyticCategory, AnalyticVerb } from 'types/analytics';
import logger from 'utils/logger';

import { INTEGRATED_SOCIAL_LIST } from '../constants';
import {
  isUserBlocked,
  loadSocialPosts,
  patchEditProfile,
  updateDmViewStage,
  updateLoginCount,
} from '../services';
import {
  loadAllSocials,
  loadBlockedList,
  loadFriendsData,
  loadRecentlySearched,
  loadUserData,
  loadUserMoments,
  loadUserNotifications,
  logout,
  updateProfileTutorialStage,
} from '../store/actions';
import { NO_SOCIAL_ACCOUNTS } from '../store/initialStates';
import { loadUserMomentCategories } from './../store/actions/momentCategories';
import { loadUserX } from './../store/actions/userX';
import { AppDispatch } from './../store/configureStore';
import { RootState } from './../store/rootReducer';
import {
  ASYNC_STORAGE_KEYS,
  ProfileInfoType,
  ProfilePreviewType,
  ProfileTutorialStage,
  ScreenType,
  UserType,
} from './../types/types';
import { identifyUser, track } from './analytics';

const loadData = async (dispatch: AppDispatch, user: UserType) => {
  await Promise.all([
    dispatch(loadUserData(user)),
    dispatch(loadFriendsData(user.userId)),
    dispatch(loadUserMomentCategories(user.userId)),
    dispatch(loadUserMoments(user.userId)),
    dispatch(loadUserNotifications()),
    dispatch(loadAllSocials(user.userId)),
    dispatch(loadBlockedList(user.userId)),
    dispatch(loadRecentlySearched()),
  ]);
};

/**

 * Async function to store/retrieve user details from AsyncStorage
 * and load user data such as notifications, moments, profile related data
 * @param dispatch
 * @param user
 * @param newToken
 * @returns Promise<void>
 *
 *
 * Note that loading the user from AsyncStorage if any this makes logout
 * triggered by invalid Token have no effect.
 * We should figure out a way to handle that.
 * Suggestions?
 * NOTE : Not something introduced by this commit but something we already have.
 */
export const userLogin = async (dispatch: AppDispatch, user: UserType, newToken?: string) => {
  try {
    // Determining if Tagg must display moment post popup the second time
    const updateTutorialStage = async () => {
      let tutorialStage = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.PROFILE_TUTORIAL_STAGE);
      if (
        tutorialStage &&
        tutorialStage === ProfileTutorialStage.TRACK_LOGIN_AFTER_POST_MOMENT_1 + ''
      ) {
        dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_POST_MOMENT_2));
      }
    };

    //Update app version
    await AsyncStorage.setItem('appVersion', ReactNativeVersionInfo.appVersion);

    // Update new token
    if (newToken) {
      await AsyncStorage.setItem('token', newToken);
    }
    let localUser = { ...user };

    // Is no user was passed in through the param list
    if (!user.userId) {
      // Grab user details from AsyncStorage
      const [id, username, token] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('username'),
        AsyncStorage.getItem('token'),
      ]);

      // If user details were found in the AsyncStorage
      if (id && username && token) {
        localUser = { ...localUser, userId: id, username: username };
        updateLoginCount(id, token);
        updateTutorialStage();
        updateDmViewStage(id, 2);
      } else {
        return;
      }
    }

    // Is user details were passed in through param list
    else {
      await Promise.all([
        AsyncStorage.setItem('userId', user.userId),
        AsyncStorage.setItem('username', user.username),
      ]);
      updateTutorialStage();
      updateDmViewStage(user.userId, 2);
    }

    // Identify user for mixpanel analytics
    identifyUser(localUser);

    // Load user data including profile data, moments, notifications etc
    await loadData(dispatch, localUser);
  } catch (error) {
    logger.log(error);
  }
};

/**
 * This tries to load data userX passed in
 * @param dispatch This is the dispatch object from the redux store
 * @param user The user
 */
export const fetchUserX = async (dispatch: AppDispatch, user: UserType, screenType: ScreenType) => {
  try {
    dispatch(loadUserX(user, screenType));
  } catch (error) {
    logger.log(error);
  }
};

/**
 * This function checks if the userX slice of our store contains the given user for the provided Screen
 */
export const userXInStore = (state: RootState, screen: ScreenType, userId: string) => {
  const userX = state.userX[screen];
  return userX && userId in userX && userX[userId].user.userId;
};

/**
 * Abstracted the code to laod all socials out.
 * @param userId userId for whom socials should be fetched
 */
export const loadAllSocialsForUser = async (userId: string, token?: string) => {
  if (!token) {
    token = (await AsyncStorage.getItem('token')) ?? '';
  }
  let socials = NO_SOCIAL_ACCOUNTS;
  try {
    const fetchedSocials = await Promise.all(
      INTEGRATED_SOCIAL_LIST.map(socialType =>
        loadSocialPosts(userId, socialType, token).then(data => ({
          key: socialType,
          data,
        })),
      ),
    );
    for (const fetchedSocial of fetchedSocials) {
      socials = { ...socials, [fetchedSocial.key]: fetchedSocial.data };
    }
    return socials;
  } catch (error) {
    logger.log(error);
  }
};

/**
 * Push the user out of system if token is not present in async storage
 * @param dispatch
 */
export const getTokenOrLogout = async (dispatch: Function): Promise<string> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    dispatch(logout());
    return '';
  }
  return token;
};

/**
 * Creates ProfilePreviewType of a user using UserType && ProfileType
 * @param passedInUser This is the UserType of the user
 * @param passedInProfile This is the ProfileType of the user
 */
export const getUserAsProfilePreviewType = (
  passedInUser: UserType,
  passedInProfile: ProfileInfoType,
): ProfilePreviewType => {
  const fullName = passedInProfile.name.split(' ');
  return {
    id: passedInUser.userId,
    username: passedInUser.username,
    first_name: fullName[0],
    last_name: fullName[1],
    thumbnail_url: '',
  };
};

export const checkIfUserIsBlocked = async (
  userId: string,
  dispatch: Function,
  loggedInUserId: string,
) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    dispatch(logout());
    return false;
  }
  return await isUserBlocked(userId, loggedInUserId, token);
};

export const navigateToProfile = async (
  state: RootState,
  dispatch: any,
  navigation: any,
  screenType: ScreenType,
  user: UserType,
) => {
  const loggedInUserId = state.user.user.userId;
  const { userId, username } = user;

  if (!userXInStore(state, screenType, userId)) {
    await fetchUserX(dispatch, { userId: userId, username: username }, screenType);
  }
  navigation.push('Profile', {
    userXId: userId === loggedInUserId ? undefined : userId,
    screenType,
  });
};

/* Function to open imagepicker and
 * select images, which are sent to
 * the database to update the profile
 */
export const patchProfile = async (title: 'profile' | 'header', userId: string) => {
  let imageSettings = {};
  let screenTitle: string;
  let requestTitle: string;
  let fileName: string;
  switch (title) {
    case 'header':
      screenTitle = 'Select Header Picture';
      requestTitle = 'largeProfilePicture';
      fileName = 'large_profile_pic.jpg';
      imageSettings = {
        smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
        width: 580,
        height: 580,
        cropping: true,
        cropperToolbarTitle: screenTitle,
        mediaType: 'photo',
      };
      break;
    case 'profile':
      screenTitle = 'Select Profile Picture';
      requestTitle = 'smallProfilePicture';
      fileName = 'small_profile_pic.jpg';
      imageSettings = {
        smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
        width: 580,
        height: 580,
        cropping: true,
        cropperToolbarTitle: screenTitle,
        mediaType: 'photo',
        cropperCircleOverlay: true,
      };
      break;
    default:
      screenTitle = '';
      requestTitle = '';
      fileName = '';
      imageSettings = {};
  }

  return await ImagePicker.openPicker(imageSettings)
    .then(picture => {
      if ('path' in picture) {
        const request = new FormData();
        request.append(requestTitle, {
          uri: picture.path,
          name: fileName,
          type: 'image/jpg',
        });

        return patchEditProfile(request, userId)
          .then(_ => true)
          .catch(error => {
            Alert.alert(error);
            return false;
          });
      }
    })
    .catch(_ => false);
};

/**
 * Returns the logged-in user's info in ProfilePreviewType from redux store.
 * @param state the current state of the redux store
 * @returns logged-in user in ProfilePreviewType
 */
export const getLoggedInUserAsProfilePreview: (state: RootState) => ProfilePreviewType = state => {
  const nameSplit = state.user.profile.name.split(' ');
  return {
    id: state.user.user.userId,
    username: state.user.user.username,
    first_name: nameSplit[0],
    last_name: nameSplit[1],
    thumbnail_url: state.user.avatar ?? '', // in full res
  };
};

export const copyProfileLinkToClipboard = async (username: string) => {
  track('FabShareProfile', AnalyticVerb.Pressed, AnalyticCategory.Profile);
  let profileUrl = `https://web.tagg.id/profiles/${username}`;
  Clipboard.setString(profileUrl);
};
