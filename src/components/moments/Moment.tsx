import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-animatable';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { MomentType, ScreenType } from 'types';
import { normalize, SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

import MomentTile from './MomentTile';

interface MomentProps {
  title: string;
  images: MomentType[] | undefined;
  userXId: string | undefined;
  screenType: ScreenType;
  handleMomentCategoryDelete: (_: string) => void;
  shouldAllowDeletion: boolean;
  showUpButton: boolean;
  showDownButton: boolean;
  move?: (direction: 'up' | 'down', title: string) => void;
  externalStyles?: Record<string, StyleProp<ViewStyle>>;
}

const Moment: React.FC<MomentProps> = ({
  title,
  images,
  userXId,
  screenType,
  handleMomentCategoryDelete,
  shouldAllowDeletion,
  showUpButton,
  showDownButton,
  move,
  externalStyles,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, externalStyles?.container]}>
      <View style={[styles.header, externalStyles?.header]}>
        <Text style={[styles.titleText, externalStyles?.titleText]} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.buttonsContainer}>
          {!userXId && (
            <View style={styles.row}>
              {showUpButton && move && (
                <SvgXml
                  xml={icons.UpIcon}
                  width={19}
                  height={19}
                  onPress={() => move('up', title)}
                  color={TAGG_LIGHT_BLUE}
                  style={styles.horizontalMargin}
                />
              )}
              {showDownButton && move && (
                <SvgXml
                  xml={icons.DownIcon}
                  width={19}
                  height={19}
                  onPress={() => move('down', title)}
                  color={TAGG_LIGHT_BLUE}
                  style={styles.horizontalMargin}
                />
              )}
            </View>
          )}
          {!userXId && (
            <View style={styles.row}>
              {shouldAllowDeletion && (
                <SvgXml
                  xml={icons.DeleteLogo}
                  onPress={() => handleMomentCategoryDelete(title)}
                  width={19}
                  height={19}
                  style={[styles.horizontalMargin, styles.deleButtonAdjustment]}
                />
              )}
            </View>
          )}
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scrollContainer, externalStyles?.scrollContainer]}>
        {images &&
          images.map((imageObj: MomentType) => (
            <MomentTile
              key={imageObj.moment_id}
              moment={imageObj}
              userXId={userXId}
              screenType={screenType}
            />
          ))}
        {(images === undefined || images.length === 0) && !userXId && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CameraScreen', {
                screenType: ScreenType.Profile,
                selectedCategory: title,
              })
            }>
            <LinearGradient colors={['rgba(105, 141, 211, 1)', 'rgba(105, 141, 211, 0.3)']}>
              <View style={styles.defaultImage}>
                <SvgXml xml={icons.PlusIconWhite} color={'white'} width={24} height={24} />
                <Text style={styles.defaultImageText}>
                  Add a moment of your {title?.toLowerCase()}!
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
  },
  header: {
    flex: 1,
    padding: '3%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: TAGG_LIGHT_BLUE,
    maxWidth: '70%',
  },
  scrollContainer: {
    height: SCREEN_WIDTH / 3.25,
    backgroundColor: '#eee',
  },
  defaultImage: {
    aspectRatio: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  defaultImageText: {
    fontSize: 14,
    paddingTop: 10,
    color: 'white',
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 50,
    alignItems: 'center',
  },
  row: { flexDirection: 'row' },
  horizontalMargin: { marginHorizontal: 4 },
  deleButtonAdjustment: { top: 2 },
});

export default Moment;
