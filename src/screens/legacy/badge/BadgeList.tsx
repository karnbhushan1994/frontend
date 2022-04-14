import React from 'react';
import {StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {BadgeDataType, BadgeOptions} from 'src/types';
import {SCREEN_HEIGHT} from '../../../utils';
import BadgeItem from './BadgeItem';

interface BadgeListProps {
  data: BadgeDataType[];
  selectedBadges: BadgeDataType[] | BadgeOptions[];
  selectKey: (ikey: BadgeOptions) => void;
}

// Flatlist to display badges on BadgeSelection Screen
const BadgeList: React.FC<BadgeListProps> = ({
  data,
  selectedBadges,
  selectKey,
}) => {
  return (
    <FlatList
      style={{height: SCREEN_HEIGHT * 0.8}}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(item, index) => item + index}
      extraData={selectedBadges}
      renderItem={({item: {name, image}, index}) => {
        return (
          <BadgeItem
            selected={selectedBadges.includes(name)}
            onSelection={selectKey}
            title={name}
            resourcePath={image}
            index={index}
          />
        );
      }}
      data={data}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  scrollViewStyles: {
    paddingBottom: SCREEN_HEIGHT * 0.5,
  },
});

export default BadgeList;
