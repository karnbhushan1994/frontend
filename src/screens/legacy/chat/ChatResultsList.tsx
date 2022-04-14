import React, { useEffect, useState } from 'react';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Keyboard, SectionList, SectionListData, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { NO_RESULTS_FOUND } from '../../constants/strings';
import { RootState } from 'store/rootreducer';
import { PreviewType, ScreenType } from 'types';
import { normalize, SCREEN_WIDTH } from 'utils';

import ChatResultsCell from './ChatResultsCell';

interface ChatResultsProps {
  // TODO: make sure results come in as same type, regardless of profile, category, badges
  results: SectionListData<any>[];
  previewType: PreviewType;
  screenType: ScreenType;
  setChatModalVisible: Function;
}

const ChatResultsList: React.FC<ChatResultsProps> = ({ results, setChatModalVisible }) => {
  const [showEmptyView, setshowEmptyView] = useState<boolean>(false);
  const { user: loggedInUser } = useSelector((state: RootState) => state.user);
  const tabbarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (results && results.length > 0) {
      let showEmpty = true;

      results.forEach(e => {
        if (e.data.length > 0) {
          showEmpty = false;
        }
      });
      setshowEmptyView(showEmpty);
    }
  }, [results]);

  return showEmptyView ? (
    <View style={styles.container} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.noResultsTextStyle}>{NO_RESULTS_FOUND}</Text>
    </View>
  ) : (
    <SectionList
      onScrollBeginDrag={Keyboard.dismiss}
      contentContainerStyle={[{ paddingBottom: tabbarHeight }]}
      sections={results}
      keyExtractor={(item, index) => item.id + index}
      renderItem={({ item }) => (
        <ChatResultsCell
          profileData={item}
          setChatModalVisible={setChatModalVisible}
          loggedInUser={loggedInUser}
        />
      )}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text>Start a new chat by searching for someone</Text>
        </View>
      )}
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
  empty: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatResultsList;
