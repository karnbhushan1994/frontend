import React, { useEffect, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Keyboard, SectionList, SectionListData, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { PreviewType, ScreenType } from 'types';
import { normalize, SCREEN_WIDTH } from 'utils';

import { NO_RESULTS_FOUND } from '../../constants/strings';

import { RootState } from '../../store/rootReducer';
import SearchResultsCell from './SearchResultCell';

interface SearchResultsProps {
  // TODO: make sure results come in as same type, regardless of profile, category, badges
  results: SectionListData<any>[];
  previewType: PreviewType;
  screenType: ScreenType;
}

const sectionHeader: React.FC<Boolean> = (showBorder: Boolean) => {
  if (showBorder) {
    return <View style={styles.sectionHeaderStyle} />;
  }
  return null;
};

const SearchResultList: React.FC<SearchResultsProps> = ({ results }) => {
  const [showEmptyView, setShowEmptyView] = useState<boolean>(false);
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (results && results.length > 0) {
      setShowEmptyView(
        results[0].data.length === 0 &&
          results[1].data.length === 0 &&
          results[2].data.length === 0,
      );
    }
  }, [results]);

  return showEmptyView ? (
    <View style={styles.container} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.noResultsTextStyle}>{NO_RESULTS_FOUND}</Text>
    </View>
  ) : (
    <SectionList
      onScrollBeginDrag={Keyboard.dismiss}
      contentContainerStyle={[{ paddingBottom: tabBarHeight }]}
      sections={results}
      keyExtractor={(item, index) => item.id + index}
      renderItem={({ item }) => (
        <SearchResultsCell profileData={item} loggedInUser={loggedInUser} />
      )}
      renderSectionHeader={({ section: { data } }) => sectionHeader(data.length !== 0)}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  sectionHeaderStyle: {
    width: '100%',
    height: 0.5,
    marginVertical: 5,
    backgroundColor: '#C4C4C4',
  },
  noResultsTextContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: SCREEN_WIDTH,
  },
  noResultsTextStyle: {
    fontWeight: '500',
    fontSize: normalize(14),
  },
});

export default SearchResultList;
