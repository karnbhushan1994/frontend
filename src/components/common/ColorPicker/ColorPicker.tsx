import React, { useEffect, useState } from 'react';

import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

// import { bgTypes } from 'screens/widgets/AddTagg';

import {
  HUE_SELECTOR_WIDTH,
  TAGG_BG_TRANSPARENT_BLACK,
  TAGG_LIGHT_BLUE,
  SKIN_THEMES,
  SUGGESTED_COLORS,
} from '../../../constants';
import { normalize } from '../../../utils';
import { SCREEN_WIDTH } from '../../../utils/layouts';
import GradientBar from './GradientBar';
import HsvSelector from './HsvSelector';
import SelectedColorBox from './SelectedColorBox';

interface ColorPickerProps {
  gradient?: boolean;
  colorPickerColors: string[];
  setIsModalVisible: Function;
  setColorPickerColors: Function;
  font?: boolean;
  customCallBack?: Function;
  isBioFontSelected?: boolean;
  showThemes?: boolean | undefined;
  setTheme?: Function | undefined;
  setActiveBgType?: any;
  linerColors?: string[];
}
const ColorPicker: React.FC<ColorPickerProps> = ({
  gradient,
  colorPickerColors,
  setIsModalVisible,
  setColorPickerColors,
  setTheme,
  font,
  customCallBack,
  // isBioFontSelected,
  showThemes,
  // setActiveBgType,
  linerColors,
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>(
    linerColors?.length && gradient
      ? [linerColors[0], linerColors[1]]
      : gradient
      ? [colorPickerColors[0], colorPickerColors[1]]
      : [colorPickerColors[0]],
  );
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  useEffect(() => {
    setTimeout(() => {
      if (linerColors?.length && gradient) {
        setSelectedColors([linerColors[0], linerColors[1]]);
        setSelectedColor(linerColors[0]);
        return;
      }
      setSelectedColors(
        gradient ? [colorPickerColors[0], colorPickerColors[1]] : [colorPickerColors[0]],
      );
      setSelectedColor(colorPickerColors[0]);
    }, 500);
  }, [colorPickerColors, linerColors]);

  const [colorIndex, setColorIndex] = useState<number>(0);
  const [selectedFont, setSelectedFont] = useState(0);

  const CloseButton = () => (
    <TouchableOpacity
      style={styles.crossButtonView}
      onPress={() => {
        // if (colorPickerColors[0] === colorPickerColors[1]) {
        //   setActiveBgType(bgTypes.SOLID);
        // } else {
        //   setActiveBgType(bgTypes.GRADIENT);
        // }
        setIsModalVisible(false);
      }}>
      <SvgXml xml={icons.CloseOutline} style={styles.crossButtonStyles} color={'#000'} />
    </TouchableOpacity>
  );

  const DoneButton = () => (
    <TouchableOpacity
      style={styles.doneButton}
      onPress={() => {
        if (customCallBack) {
          customCallBack(selectedColors);
        }
        setColorPickerColors(gradient ? selectedColors : [selectedColors[0], selectedColors[0]]);
        setIsModalVisible(false);
      }}>
      <Text style={styles.doneButtonText}>Done</Text>
    </TouchableOpacity>
  );

  const setSelectedColor = (color: string) => {
    let localSelectedColors: string[] = [...selectedColors];
    localSelectedColors[colorIndex] = color;
    setSelectedColors(localSelectedColors);
  };

  return (
    <Modal animationType="fade" transparent visible={true} presentationStyle="overFullScreen">
      <View style={styles.mainViewWrapper}>
        <View style={styles.innerMainViewWrapper}>
          <View style={styles.mainView}>
            <View style={styles.contentView}>
              <CloseButton />
              <View style={styles.pickerHeader}>
                <Text style={styles.headerText}>Enter Hex Code</Text>
                <View style={styles.selectedColorBoxView}>
                  {selectedColors.map((_, index) => (
                    <SelectedColorBox
                      color={selectedColors[index]}
                      setSelectedColor={setSelectedColor}
                      containerStyle={
                        gradient ? styles.selectedColorBoxSmall : styles.selectedColorBoxLarge
                      }
                    />
                  ))}
                </View>
              </View>
              {gradient === true && (
                <GradientBar
                  selectedColors={selectedColors}
                  colorIndex={colorIndex}
                  setColorIndex={setColorIndex}
                />
              )}

              <HsvSelector
                colorIndex={colorIndex}
                containerStyle={styles.colorPickerView}
                selectedColor={selectedColors[colorIndex]}
                setSelectedColor={setSelectedColor}
                setSelectedTheme={setSelectedTheme}
                selectedTheme={selectedTheme}
              />
              <View style={styles.suggestedColorsContainer}>
                {SUGGESTED_COLORS.map((color, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedColor(color);
                    }}
                    style={[styles.colorCircle, { backgroundColor: color }]}
                  />
                ))}
              </View>
              {/* {isBioFontSelected ? (
                <View style={styles.typographyLock}>
                  <SvgXml xml={icons.Lock} width={20} height={20} />
                  <Text style={styles.typographyText}>Typography</Text>
                </View>
              ) : null} */}
              {font && (
                <View style={styles.typographyBlock}>
                  <Text style={styles.typographyBlockTitle}>Typography</Text>
                  <View style={styles.typographyVersionsContainer}>
                    <TouchableOpacity onPress={() => setSelectedFont(1)}>
                      <LinearGradient
                        colors={
                          selectedFont === 1 ? ['#A634FF', '#6EE7E7'] : ['#E8E8E8', '#E8E8E8']
                        }
                        start={{ x: 0.0, y: 1.0 }}
                        end={{ x: 1.0, y: 1.0 }}
                        style={styles.gradient}>
                        <Text
                          style={[
                            styles.fontMontserrat,
                            selectedFont === 1 && styles.selectedFontText,
                          ]}>
                          Aa
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedFont(2)}>
                      <LinearGradient
                        colors={
                          selectedFont === 2 ? ['#A634FF', '#6EE7E7'] : ['#E8E8E8', '#E8E8E8']
                        }
                        start={{ x: 0.0, y: 1.0 }}
                        end={{ x: 1.0, y: 1.0 }}
                        style={styles.gradient}>
                        <Text
                          style={[
                            styles.fontMontserrat,
                            selectedFont === 2 && styles.selectedFontText,
                          ]}>
                          Aa
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedFont(3)}>
                      <LinearGradient
                        colors={
                          selectedFont === 3 ? ['#A634FF', '#6EE7E7'] : ['#E8E8E8', '#E8E8E8']
                        }
                        start={{ x: 0.0, y: 1.0 }}
                        end={{ x: 1.0, y: 1.0 }}
                        style={styles.gradient}>
                        <Text
                          style={[
                            styles.fontMontserrat,
                            selectedFont === 3 && styles.selectedFontText,
                          ]}>
                          Aa
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {showThemes && (
                <View style={styles.themeContainer}>
                  <Text style={styles.themesTitle}>Themes</Text>
                  <View style={styles.themesInnerContainer}>
                    {SKIN_THEMES.map((skinTheme, i) => (
                      <TouchableOpacity
                        style={[styles.singleThemeContainer]}
                        onPress={() => {
                          if (setTheme) {
                            setSelectedTheme(skinTheme.name);
                            setTheme(skinTheme.primaryColor, skinTheme.secondaryColor);
                          }
                        }}
                        key={i}>
                        <View
                          style={[
                            styles.selectedTheme,
                            skinTheme.name === selectedTheme ? styles.selectedThemeBackground : {},
                          ]}>
                          <View style={styles.circleContainer}>
                            <View
                              style={[styles.circle, { backgroundColor: skinTheme.secondaryColor }]}
                            />
                            <View
                              style={[styles.circle, { backgroundColor: skinTheme.primaryColor }]}
                            />
                          </View>
                          <Text style={styles.themeTitle}>{skinTheme.name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              <DoneButton />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  crossButtonStyles: {
    marginVertical: 8,
  },
  themeTitle: { color: 'grey', marginTop: 2 },
  themeContainer: { marginHorizontal: 20, marginBottom: 25 },
  themesTitle: { fontWeight: 'bold' },
  themesInnerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  circleContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  selectedTheme: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  selectedThemeBackground: {
    backgroundColor: 'lightgrey',
  },
  singleThemeContainer: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  circle: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 30,
    marginHorizontal: 8,
  },
  colorCircle: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    height: 30,
    width: 30,
  },
  suggestedColorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  crossButtonView: { width: 25, height: 25, left: 0, marginBottom: '5%' },
  mainViewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TAGG_BG_TRANSPARENT_BLACK,
  },
  innerMainViewWrapper: {
    position: 'absolute',
    top: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TAGG_BG_TRANSPARENT_BLACK,
  },
  mainView: {
    backgroundColor: '#FFF',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingTop: 10,
    width: SCREEN_WIDTH * 0.95,
    paddingBottom: 25,
  },
  contentView: { width: HUE_SELECTOR_WIDTH + 20, alignSelf: 'center' },
  colorPickerView: {
    alignSelf: 'center',
    flexDirection: 'column',
    marginBottom: 24,
  },
  pickerHeader: {
    marginTop: 12,
  },
  headerText: {
    paddingHorizontal: 8,
    fontWeight: 'bold',
  },
  selectedColorBoxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: 14,
  },
  selectedColorBoxSmall: { width: '45%' },
  selectedColorBoxLarge: { width: '100%' },
  doneButton: {
    backgroundColor: TAGG_LIGHT_BLUE,
    width: SCREEN_WIDTH * 0.75,
    height: 37,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(6),
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: normalize(15),
    lineHeight: normalize(17.91),
    letterSpacing: normalize(1.3),
    fontWeight: '700',
  },
  typographyBlock: {
    height: 80,
    marginHorizontal: 14,
  },
  typographyBlockTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 8,
  },
  typographyLock: {
    height: 30,
    marginBottom: 15,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typographyText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#828282',
    marginHorizontal: 10,
  },
  typographyVersionsContainer: {
    flexDirection: 'row',
  },
  gradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    minWidth: 42,
    alignItems: 'center',
  },
  fontMontserrat: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  selectedFontText: {
    color: '#fff',
  },
});

export default ColorPicker;
