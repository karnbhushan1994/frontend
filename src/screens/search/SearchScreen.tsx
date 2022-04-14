import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Keyboard, LayoutChangeEvent, StatusBar, StyleSheet } from 'react-native';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  RecentSearches,
  SearchBar,
  SearchCategories,
  SearchResultList,
  SearchResultsBackground,
  TabsGradient,
} from 'components';
import { loadSearchResults } from 'services';
import { resetScreenType } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { CategoryPreviewType, ProfilePreviewType, ScreenType } from 'types';
import { getRecentlySearchedCategories, getRecentlySearchedUsers } from 'utils';
import logger from 'utils/logger';

import { SEARCH_ENDPOINT } from '../../constants';

/**
 * Search Screen for user recommendations and a search
 * tool to allow user to find other users
 */

const SearchScreen: React.FC = () => {
  const { recentSearches } = useSelector((state: RootState) => state.taggUsers);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[] | undefined>();
  const [recents, setRecents] = useState<Array<ProfilePreviewType>>(recentSearches ?? []);
  const [recentCategories, setRecentCategories] = useState<CategoryPreviewType[]>([]);
  const [searching, setSearching] = useState(false);
  /*
   * Animated value
   */
  const animationProgress = useSharedValue<number>(0);
  const [searchBarHeight, setSearchBarHeight] = useState<number>(0);

  const dispatch = useDispatch();

  /*
   * Main handler for changes in query.
   */
  useEffect(() => {
    if (!searching) {
      return;
    }
    if (query.length < 3) {
      loadRecentlySearched().then(() => setResults(undefined));
      return;
    }
    (async () => {
      const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT}?query=${query}`);
      if (query.length > 2) {
        const sanitizedResult = [
          {
            title: 'badges',
            data: searchResults?.badges,
          },
          {
            title: 'categories',
            data: searchResults?.categories,
          },
          {
            title: 'users',
            data: searchResults?.users,
          },
        ];
        setResults(sanitizedResult);
      } else {
        setResults(undefined);
      }
    })();
  }, [query]);

  /**
   * Code under useFocusEffect gets executed every time the screen comes under focus / is being viewed by the user.
   * This is done to reset the users stored in our store for the Search screen.
   * Read more here : https://reactnavigation.org/docs/function-after-focusing-screen/
   */
  useFocusEffect(() => {
    dispatch(resetScreenType(ScreenType.Search));
  });

  // when searching state changes, run animation and reset query accordingly
  useEffect(() => {
    if (searching) {
      loadRecentlySearched().then(() => {
        animationProgress.value = withTiming(1, {
          duration: 180,
          easing: Easing.bezier(0.31, 0.14, 0.66, 0.82),
        });
      });
    } else {
      setQuery('');
      handleBlur();
      animationProgress.value = withTiming(
        0,
        { duration: 180, easing: Easing.inOut(Easing.ease) },
        () => {
          'worklet';
          runOnJS(setResults)(undefined);
        },
      );
    }
  }, [searching]);

  // loads recent searches (users & categories) from AsyncStorage
  const loadRecentlySearched = async () =>
    Promise.all([getRecentlySearchedUsers(), getRecentlySearchedCategories()]).then(
      ([users, categories]: [ProfilePreviewType[], CategoryPreviewType[]]) => {
        setRecents(users);
        setRecentCategories(categories);
      },
    );
  const clearRecentlySearched = async () => {
    try {
      AsyncStorage.removeItem('@recently_searched_users');
      AsyncStorage.removeItem('@recently_searched_categories');
      loadRecentlySearched();
    } catch (e) {
      logger.log(e);
    }
  };

  const handleFocus = () => {
    setSearching(true);
  };
  const handleBlur = () => {
    Keyboard.dismiss();
  };
  const handleCancel = () => {
    setSearching(false);
  };
  const onSearchBarLayout = (e: LayoutChangeEvent) => {
    setSearchBarHeight(e.nativeEvent.layout.height);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        onCancel={handleCancel}
        onChangeText={setQuery}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={query}
        onLayout={onSearchBarLayout}
        {...{ animationProgress, searching }}
      />
      <SearchCategories useSuggestions={false} />
      <SearchResultsBackground {...{ searching, searchBarHeight, animationProgress }}>
        {results === undefined ? (
          recents.length + recentCategories.length > 0 && (
            <RecentSearches
              sectionTitle="Recent"
              onPress={clearRecentlySearched}
              screenType={ScreenType.Search}
              {...{ recents, recentCategories }}
            />
          )
        ) : (
          <SearchResultList
            {...{ results }}
            previewType={'Search'}
            screenType={ScreenType.Search}
          />
        )}
      </SearchResultsBackground>
      <TabsGradient />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
export default SearchScreen;
