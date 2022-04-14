import React from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  ScrollView,
  Keyboard,
} from 'react-native';

import { PreviewType, ProfilePreviewType, ScreenType, CategoryPreviewType } from 'types';

import { TAGG_LIGHT_BLUE } from '../../constants';

import SearchResults from './SearchResults';

interface RecentSearchesProps extends TouchableOpacityProps {
  sectionTitle: PreviewType;
  recents: Array<ProfilePreviewType>;
  recentCategories: CategoryPreviewType[];
  screenType: ScreenType;
}

const RecentSearches: React.FC<RecentSearchesProps> = props => {
  const { recents, recentCategories } = props;
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Recent</Text>
        <TouchableOpacity {...props}>
          <Text style={styles.clear}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={{ paddingBottom: useBottomTabBarHeight() }}>
        <SearchResults results={recents} categories={recentCategories} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 25,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flexGrow: 1,
  },
  clear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TAGG_LIGHT_BLUE,
  },
});

export default RecentSearches;
