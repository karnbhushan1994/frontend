import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ViewProps, Image } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { icons } from 'assets/icons';
import { loadImageFromURL } from 'services';
import { PreviewType, ProfilePreviewType, ScreenType } from 'types';
import {
  checkIfUserIsBlocked,
  fetchUserX,
  isIPhoneX,
  normalize,
  SCREEN_WIDTH,
  userXInStore,
} from 'utils';
import logger from 'utils/logger';
import { addUserToRecentlySearched } from 'utils/search';

import { ERROR_UNABLE_TO_VIEW_PROFILE } from '../../constants/strings';

import { RootState } from '../../store/rootReducer';
import { Avatar } from '../common';

/**
 * This component returns user's profile picture friended by username as a touchable component.
 * What happens when someone clicks on this component is partly decided by the prop isComment.
 * If isComment is true then it means that we are not displaying this tile as a part of search results.
 * And hence we do not cache the search results.
 * On the other hand, if isComment is false, then we should update the search cache. (This cache needs to be revamped to clear outdated results.)
 * Finally, We navigate to Profile.
 */

interface ProfilePreviewProps extends ViewProps {
  profilePreview: ProfilePreviewType;
  previewType: PreviewType;
  screenType: ScreenType;
  setMFDrawer?: Function;
  // userIcon to show default user profile in place of cross image, currently using from CommentTile.js
  userIcon?: boolean;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profilePreview: { username, first_name, last_name, id, thumbnail_url },
  previewType,
  screenType,
  setMFDrawer,
  userIcon = false,
  moment_user_id,
  setIsOpen,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  const [avatar, setAvatar] = useState<string>();
  const dispatch = useDispatch();
  const isCreator = moment_user_id === id;

  useEffect(() => {
    (async () => {
      const response = await loadImageFromURL(thumbnail_url);
      if (response) {
        setAvatar(response);
      }
    })();
  }, []);

  /**
   * Adds a searched user to the recently searched cache if they're tapped on.
   * Cache maintains 10 recently searched users, popping off the oldest one if
   * needed to make space.
   */

  const state: RootState = useStore().getState();

  const addToRecentlyStoredAndNavigateToProfile = async () => {
    let user: ProfilePreviewType = {
      id,
      username,
      first_name,
      last_name,
      thumbnail_url,
    };

    try {
      //If the logged in user is blocked by the user being viewed, do not proceed.
      const isUserBlocked = await checkIfUserIsBlocked(user.id, dispatch, loggedInUser.userId);
      if (isUserBlocked) {
        Alert.alert(ERROR_UNABLE_TO_VIEW_PROFILE);
        return;
      }
      if (previewType !== 'Comment') {
        await addUserToRecentlySearched(user);
      }

      const userXId = loggedInUser.username === user.username ? undefined : user.id;

      /**
       * Dispatch an event to Fetch the user details only if we're navigating to
       * a userX's profile.
       * If the user is already present in store, do not fetch again.
       * Finally, Navigate to profile of the user selected.
       */
      if (userXId && !userXInStore(state, screenType, user.id)) {
        await fetchUserX(dispatch, { userId: user.id, username: user.username }, screenType);
      }

      // Close Mutual Friends drawer on suggested people upon navigation
      if (setMFDrawer) {
        setMFDrawer(false);
      }

      navigation.push('Profile', {
        userXId,
        screenType,
      });
    } catch (e) {
      logger.log(e);
    }
    setIsOpen(false);
  };

  var containerStyle, avatarStyle, nameContainerStyle, usernameToDisplay, usernameStyle, nameStyle;

  switch (previewType) {
    case 'Search':
    case 'Recent':
      containerStyle = styles.searchResultContainer;
      avatarStyle = styles.searchResultAvatar;
      nameContainerStyle = styles.searchResultNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.searchResultUsername;
      nameStyle = styles.searchResultName;
      break;
    case 'Discover Users':
      containerStyle = styles.discoverUsersContainer;
      avatarStyle = styles.discoverUsersAvatar;
      nameContainerStyle = styles.discoverUsersNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.discoverUsersUsername;
      nameStyle = styles.discoverUsersName;
      break;
    case 'Tag Selection':
      containerStyle = styles.tagSelectionContainer;
      avatarStyle = styles.tagSelectionAvatar;
      nameContainerStyle = styles.tagSelectionNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.tagSelectionUsername;
      nameStyle = styles.tagSelectionName;
      break;
    case 'Comment':
      containerStyle = styles.commentContainer;
      avatarStyle = styles.commentAvatar;
      nameContainerStyle = styles.commentNameContainer;
      usernameToDisplay = username;
      usernameStyle = styles.commentUsername;
      nameStyle = styles.commentName;
      break;
    case 'Friend':
      containerStyle = styles.friendContainer;
      avatarStyle = styles.friendAvatar;
      nameContainerStyle = styles.friendNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.friendUsername;
      nameStyle = styles.friendName;
      break;
    case 'Suggested People Drawer':
      containerStyle = styles.suggestedPeopleContainer;
      avatarStyle = styles.suggestedPeopleAvatar;
      nameContainerStyle = styles.suggestedPeopleNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.suggestedPeopleUsername;
      nameStyle = styles.suggestedPeopleName;
      break;
    case 'Suggested People Screen':
      avatarStyle = styles.suggestedPeopleScreenAvatar;
      break;
    case 'Share Moment Drawer':
      containerStyle = styles.shareMomentContainer;
      nameContainerStyle = styles.shareMomentNameContainer;
      nameStyle = styles.shareMomentNameStyle;
      avatarStyle = styles.shareMomentAvatarStyle;
      break;
    default:
      containerStyle = styles.searchResultContainer;
      avatarStyle = styles.searchResultAvatar;
      nameContainerStyle = styles.searchResultNameContainer;
      usernameToDisplay = '@' + username;
      usernameStyle = styles.searchResultUsername;
      nameStyle = styles.searchResultName;
  }
  return (
    <TouchableOpacity onPress={addToRecentlyStoredAndNavigateToProfile} style={containerStyle}>
      <Avatar style={avatarStyle} uri={avatar} userIcon={userIcon} />
      <View style={nameContainerStyle}>
        {(previewType === 'Search' || previewType === 'Recent') && (
          <>
            <Text style={usernameStyle}>{usernameToDisplay}</Text>
            <Text style={nameStyle}>{first_name.concat(' ', last_name)}</Text>
          </>
        )}
        {(previewType === 'Discover Users' ||
          previewType === 'Tag Selection' ||
          previewType === 'Comment') && (
          <>
            <View style={styles.profileName}>
              <Text style={[usernameStyle, styles.name]}>{usernameToDisplay}</Text>
              {isCreator && <Image source={icons.Creator} style={styles.icon} />}
            </View>
          </>
        )}
        {previewType === 'Friend' && (
          <>
            <Text style={usernameStyle}>{usernameToDisplay}</Text>
            <Text style={nameStyle}>{first_name.concat(' ', last_name)}</Text>
          </>
        )}
        {previewType === 'Suggested People Drawer' && (
          <>
            <Text style={styles.suggestedPeopleName} numberOfLines={2}>
              {first_name} {last_name}
            </Text>
            <Text style={styles.suggestedPeopleUsername} numberOfLines={1}>{`@${username}`}</Text>
          </>
        )}
        {previewType === 'Share Moment Drawer' && (
          <Text style={nameStyle}>{first_name.concat(' ', last_name)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discoverUsersContainer: {
    alignItems: 'center',
    textAlign: 'center',
    width: '32%',
    marginVertical: 10,
  },
  searchResultAvatar: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: '10%',
  },
  commentAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
    marginTop: '2%',
  },
  discoverUsersAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  searchResultNameContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    flex: 1,
  },
  commentNameContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
  },
  discoverUsersNameContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginTop: 5,
  },
  searchResultUsername: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: '500',
  },
  discoverUsersUsername: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  commentName: {
    fontSize: 16,
    color: '#333',
  },
  discoverUsersName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.6,
  },
  friendAvatar: {
    height: normalize(42),
    width: normalize(42),
    marginRight: 15,
    borderRadius: 50,
  },
  friendNameContainer: {
    height: '100%',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
  },
  friendUsername: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#000',
    letterSpacing: normalize(0.1),
  },
  friendName: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: '#6C6C6C',
    letterSpacing: normalize(0.1),
  },
  suggestedPeopleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    width: isIPhoneX() ? 80 : 65,
  },
  suggestedPeopleAvatar: {
    alignSelf: 'center',
    height: normalize(60),
    width: normalize(60),
    borderRadius: 60,
  },
  suggestedPeopleUsername: {
    fontSize: normalize(10),
    lineHeight: normalize(15),
    fontWeight: '500',
    color: '#828282',
    textAlign: 'center',
  },
  suggestedPeopleNameContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginTop: 10,
  },
  suggestedPeopleName: {
    fontSize: normalize(12),
    lineHeight: normalize(15),
    fontWeight: '700',
    color: '#3C3C3C',
    textAlign: 'center',
  },
  suggestedPeopleScreenAvatar: {
    height: normalize(33.5),
    width: normalize(33.5),
    marginRight: 15,
    borderRadius: 50,
  },
  tagSelectionContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tagSelectionAvatar: {
    width: 34,
    height: 34,
    borderRadius: 20,
  },
  tagSelectionNameContainer: {
    width: '100%',
    marginVertical: normalize(5),
  },
  tagSelectionUsername: {
    fontWeight: '500',
    fontSize: normalize(9),
    lineHeight: normalize(10),
    letterSpacing: normalize(0.2),
    color: 'white',
    textAlign: 'center',
  },
  tagSelectionName: {
    fontWeight: '500',
    fontSize: 8,
    color: 'white',
  },
  shareMomentContainer: {
    height: '100%',
    paddingHorizontal: '7%',
    flexDirection: 'column',
    alignItems: 'center',
    width: isIPhoneX() ? 80 : 70,
  },
  shareMomentAvatarStyle: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: 35,
  },
  shareMomentNameContainer: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginTop: 10,
  },
  shareMomentNameStyle: {
    fontSize: normalize(10),
    lineHeight: normalize(15),
    fontWeight: '500',
    color: '#828282',
    textAlign: 'center',
  },
  profileName: {
    flexDirection: 'row',
  },
  icon: {
    resizeMode: 'contain',
    width: 55,
    //height: 80,
    marginLeft: 10,
    textAlign: 'center',
    // marginRight: 5,
  },
  name: {
    alignSelf: 'center',
  },
});

export default ProfilePreview;
