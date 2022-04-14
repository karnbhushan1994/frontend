import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { images } from 'assets/images';

import { loadImageFromURL } from 'services';
import { RootState } from 'store/rootReducer';
import {
  CategoryPreviewType,
  ProfilePreviewType,
  ScreenType,
  UniversityType,
  UserType,
} from 'types';
import {
  addCategoryToRecentlySearched,
  addUserToRecentlySearched,
  getUniversityBadge,
  normalize,
  SCREEN_WIDTH,
} from 'utils';
import { checkIfUserIsBlocked, fetchUserX, userXInStore } from 'utils';

import logger from 'utils/logger';

import { ERROR_UNABLE_TO_VIEW_PROFILE } from '../../constants/strings';

import { Avatar } from '../common';

interface SearchResults {
  profileData: ProfilePreviewType;
  loggedInUser: UserType;
}

const SearchResultsCell: React.FC<SearchResults> = ({
  profileData: { id, name, username, first_name, last_name, thumbnail_url, category },
  loggedInUser,
}) => {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  const { university } = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    (async () => {
      if (thumbnail_url !== undefined) {
        try {
          const response = await loadImageFromURL(thumbnail_url);
          if (response) {
            setAvatar(response);
          }
        } catch (error) {
          logger.log('Error while downloading ', error);
          throw error;
        }
      }
    })();
  }, [thumbnail_url]);

  const dispatch = useDispatch();
  const state: RootState = useStore().getState();
  const navigation = useNavigation();
  const addToRecentlyStoredAndNavigateToProfile = async () => {
    try {
      //If the logged in user is blocked by the user being viewed, do not proceed.
      const isUserBlocked = await checkIfUserIsBlocked(id, dispatch, loggedInUser.userId);
      if (isUserBlocked) {
        Alert.alert(ERROR_UNABLE_TO_VIEW_PROFILE);
        return;
      }

      addUserToRecentlySearched({
        id,
        first_name,
        last_name,
        thumbnail_url,
        username,
      });

      const userXId = loggedInUser.username === username ? undefined : id;

      /**
       * Dispatch an event to Fetch the user details only if we're navigating to
       * a userX's profile.
       * If the user is already present in store, do not fetch again.
       * Finally, Navigate to profile of the user selected.
       */
      if (userXId && !userXInStore(state, ScreenType.Search, id)) {
        await fetchUserX(dispatch, { userId: id, username: username }, ScreenType.Search);
      }

      navigation.navigate('Profile', {
        userXId: userXId,
        screenType: ScreenType.Search,
        showShareModalParm: false,
      });
    } catch (e) {
      logger.log(e);
    }
  };

  /*
   * Save selected category in recently-searched categories and navigate to its Discover screen.
   */
  const onPressCategory = async () => {
    const categoryObj: CategoryPreviewType = { name: name || '', category };
    addCategoryToRecentlySearched(categoryObj);
    navigation.navigate('DiscoverUsers', {
      searchCategory: { id, name },
    });
  };

  const userCell = () => (
    <TouchableOpacity
      onPress={addToRecentlyStoredAndNavigateToProfile}
      style={styles.cellContainer}>
      <Avatar style={styles.imageContainer} uri={avatar} />
      <View style={[styles.initialTextContainer, styles.multiText]}>
        <Text style={styles.initialTextStyle}>{`@${username}`}</Text>
        <Text style={styles.secondaryTextStyle}>{first_name + ' ' + last_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const searchIcon = () => images.main.search;

  const categoryCell = () => (
    <TouchableOpacity style={styles.cellContainer} onPress={onPressCategory}>
      <View style={[styles.imageContainer, styles.categoryBackground]}>
        <Image
          resizeMode="contain"
          source={
            category in UniversityType ? getUniversityBadge(university, 'Search') : searchIcon()
          }
          style={styles.categoryImage}
        />
      </View>
      <View style={styles.initialTextContainer}>
        <Text style={styles.initialTextStyle}>{name}</Text>
      </View>
    </TouchableOpacity>
  );

  return name === undefined ? userCell() : categoryCell();
};

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.112,
    height: SCREEN_WIDTH * 0.112,
    borderRadius: (SCREEN_WIDTH * 0.112) / 2,
  },
  categoryBackground: {
    backgroundColor: 'rgba(196, 196, 196, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '40%',
    height: '40%',
  },
  initialTextContainer: {
    marginLeft: SCREEN_WIDTH * 0.08,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  initialTextStyle: {
    fontWeight: '500',
    fontSize: normalize(14),
  },
  secondaryTextStyle: {
    fontWeight: '500',
    fontSize: normalize(12),
    color: '#828282',
  },
  multiText: { justifyContent: 'space-between' },
});

export default SearchResultsCell;
