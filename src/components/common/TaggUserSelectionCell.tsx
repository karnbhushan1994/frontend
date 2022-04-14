import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { ProfilePreview } from 'components';
import { MomentTagType, ProfilePreviewType, ScreenType } from 'types';
import { SCREEN_WIDTH } from 'utils';

import TaggRadioButton from './TaggRadioButton';

interface TaggUserSelectionCellProps {
  item: ProfilePreviewType;
  tags: MomentTagType[];
  setTags: (tags: MomentTagType[]) => void;
}
const TaggUserSelectionCell: React.FC<TaggUserSelectionCellProps> = ({ item, tags, setTags }) => {
  const [pressed, setPressed] = useState<boolean>(false);

  /*
   * To update state of radio button on initial render and subsequent re-renders
   */
  useEffect(() => {
    const updatePressed = () => {
      const userSelected = tags.findIndex(tag => item.id === tag.user.id);
      setPressed(userSelected !== -1);
    };
    updatePressed();
  });

  /*
   * Handles on press on radio button
   * Adds/removes user from selected list of users
   */
  const handlePress = () => {
    // Add to selected list of users
    if (pressed === false) {
      setTags([
        ...tags,
        {
          id: '',
          x: 50,
          y: 50,
          z: 1,
          user: item,
        },
      ]);
    }
    // Remove item from selected list of users
    else {
      setTags(tags.filter(tag => tag.user.id !== item.id));
    }
  };
  return (
    <TouchableWithoutFeedback onPress={handlePress} style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.8 }}>
        <ProfilePreview
          profilePreview={item}
          previewType={'Search'}
          screenType={ScreenType.Profile}
        />
      </View>
      <TaggRadioButton pressed={pressed} onPress={() => null} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TaggUserSelectionCell;
