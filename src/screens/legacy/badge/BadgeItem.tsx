import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {SCREEN_WIDTH, normalize} from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {
  BACKGROUND_GRADIENT_MAP,
  BADGE_GRADIENT_FIRST,
  BADGE_GRADIENT_REST,
} from '../../../constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BadgeOptions} from '../../../types';
import {BadgeNamesRecord} from '../../../constants';

interface BadgeItemProps {
  title: BadgeOptions;
  resourcePath: ImageSourcePropType;
  index: Number;
  selected: boolean;
  onSelection: (ikey: BadgeOptions) => void;
}

const BadgeItem: React.FC<BadgeItemProps> = ({
  title,
  resourcePath,
  selected,
  index,
  onSelection,
}) => {
  return (
    <LinearGradient
      colors={
        selected ? BACKGROUND_GRADIENT_MAP[0] : ['transparent', 'transparent']
      }
      useAngle={true}
      angle={136.69}
      style={styles.border}>
      <TouchableOpacity
        onPress={() => onSelection(title)}
        style={styles.button}>
        <LinearGradient
          colors={index === 0 ? BADGE_GRADIENT_FIRST : BADGE_GRADIENT_REST}
          // BACKGROUND_GRADIENT_MAP
          useAngle={true}
          angle={136.69}
          style={styles.item}>
          <View style={styles.detailContainer}>
            <Image source={resourcePath} style={styles.imageStyles} />
            <Text
              style={[
                styles.title,
                title.length > 30
                  ? {fontSize: normalize(12), lineHeight: normalize(16)}
                  : {},
              ]}>
              {BadgeNamesRecord[title]}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const ITEM_WIDTH = SCREEN_WIDTH / 3 - 20;

const styles = StyleSheet.create({
  border: {
    width: ITEM_WIDTH + 6,
    height: 156,
    marginLeft: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  item: {
    width: ITEM_WIDTH,
    height: 150,
    borderRadius: 8,
  },
  detailContainer: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imageStyles: {
    width: normalize(50),
    height: normalize(50),
  },
  title: {
    fontSize: normalize(15),
    fontWeight: '500',
    lineHeight: normalize(17.9),
    textAlign: 'center',
    color: 'white',
    marginHorizontal: '2%',
  },
  button: {
    alignSelf: 'center',
    marginTop: 3,
  },
});

export default BadgeItem;
