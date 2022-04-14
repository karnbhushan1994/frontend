import React from 'react';

import { StyleSheet } from 'react-native';
import { Image, Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';
import { getMomentCategoryIconInfo, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { BACKGROUND_GRADIENT_MAP, HOMEPAGE } from '../../constants';

type MomentCategoryProps = {
  categoryType: string;
  onSelect: (category: string, isSelected: boolean, isAdded: boolean) => void;
  isSelected: boolean;
  isAdded: boolean;
};

const MomentCategory: React.FC<MomentCategoryProps> = ({
  categoryType,
  isSelected,
  isAdded,
  onSelect,
}) => {
  const { icon, bgColor } = getMomentCategoryIconInfo(categoryType);

  /**
   * The Linear Gradient helps us add a gradient border when the category is already added /selected by user
   * if(isAdded)
   *    gradient background
   * if(isSelected)
   *    white background
   * else
   *    transparent background
   */
  return (
    <LinearGradient
      colors={
        isAdded
          ? BACKGROUND_GRADIENT_MAP[0]
          : isSelected
          ? ['white', 'white']
          : ['transparent', 'transparent']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, styles.gradient]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          onSelect(categoryType, !isSelected, isAdded);
        }}
        style={[styles.container, styles.touchable, { backgroundColor: bgColor }]}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.label}>{categoryType === HOMEPAGE ? 'Home' : categoryType}</Text>
        {isAdded && <Image source={images.main.link_tick} style={styles.tick} />}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: SCREEN_WIDTH / 3.7,
    height: SCREEN_HEIGHT / 5.8,
    marginHorizontal: '2%',
    marginVertical: '2%',
  },
  touchable: {
    width: SCREEN_WIDTH / 4,
    height: SCREEN_HEIGHT / 6.2,
    marginHorizontal: '2%',
    marginVertical: '4%',
  },
  container: {
    borderRadius: 8,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginVertical: '8%',
  },
  label: {
    fontWeight: '500',
    color: 'white',
  },
  tick: {
    marginTop: '3%',
    width: 15,
    height: 15,
  },
});

export default MomentCategory;
