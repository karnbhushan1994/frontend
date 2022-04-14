import { BACKGROUND_GRADIENT_MAP, HOMEPAGE } from 'constants';

import React, { useEffect, useState } from 'react';

import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { SvgXml } from 'react-native-svg';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons/index';
import { images } from 'assets/images';
import { ColorPicker } from 'components/common/ColorPicker';
import LockedModal from 'components/modals/lockedModal';
import { TabColorTemplate } from 'components/pages';
import GradientForProfileBGTabModal from 'components/TaggBGModal/GradientForProfileBGTabModal';
import SimpleButton from 'components/widgets/SimpleButton';
import { makeAction } from 'makeAction';

//import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { loadSkinPermission, loadUserProfileInfo, updateUserSkin } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  BackgroundGradientType,
  Banner,
  RewardType,
  TaggScoreBannerText,
} from 'types';
import { gradientColorFormation, normalize, SCREEN_WIDTH, track } from 'utils';

const bgTypes = {
  GRADIENT: 'gradient',
  SOLID: 'solid',
  IMAGE: 'image',
  NONE: 'none',
};

const colorTypes = {
  BACKGROUND_COLOR: 'backgroundColor',
  TAB_COLOR: 'tabColor',
};

const chessBg = images.taggsShop.chessBg;

const EditPageScreen: React.FC = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [activeBgType, setActiveBgType] = useState<string>();
  const [activeColorFor, setActiveColorFor] = useState<string>(colorTypes.BACKGROUND_COLOR);
  const [colorPickerColors, setColorPickerColors] = useState<string[]>(['#FFFFFF', '#FFFFFF']);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState<boolean>(false);
  const [isLockVisible, setIsLockVisible] = useState<boolean>(false);
  const [isGradientBgModalVisible, setIsGradientBgModalVisible] = useState<Boolean>(false);
  const [isGradientTabModalVisible, setIsGradientTabModalVisible] = useState<Boolean>(false);
  const {
    skin: {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      template_type: templateChoice,
      bio_text_color: bioTextColor,
    },
  } = useSelector((state: RootState) => state.user.profileTemplate);
  const { userId } = useSelector((state: RootState) => state.user.user);

  // const cover = useSelector((state: RootState) => state.user.cover);
  const tagg_score = useSelector((state: RootState) => state.user.profile.tagg_score);
  const skinPermission = useSelector((state: RootState) => state.user.skinPermission);
  const isTabGradientUnlock = skinPermission.tab_permission;
  const isBgGradientUnlock = skinPermission.background_permission;
  const [oldTaggScore, setOldTaggScore] = useState<number>(tagg_score);
  // const { cover } = useContext(ProfileHeaderContext);

  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(primaryColor);
  const [selectedTabColor, setSelectedTabColor] = useState<string>(secondaryColor);

  const [linerColorList, setLinerColorList] = useState<string[]>(['#828282', '#828282']);
  const [tabLinerColorList, setTabLinerColorList] = useState<string[]>(['#828282', '#828282']);
  useEffect(() => {
    if (bioTextColor) {
      setColorPickerColors([bioTextColor, bioTextColor]);
    }
  }, [bioTextColor]);

  useEffect(() => {
    if (primaryColor) {
      setSelectedBackgroundColor(primaryColor);
      setLinerColorList(gradientColorFormation(primaryColor));
    }
  }, [primaryColor]);

  useEffect(() => {
    if (secondaryColor) {
      setSelectedTabColor(secondaryColor);
      setTabLinerColorList(gradientColorFormation(secondaryColor));
    }
  }, [secondaryColor]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
    const getSkinPermssion = async () => {
      await Promise.all([dispatch(loadSkinPermission())]);
    };
    getSkinPermssion();
  }, []);

  useEffect(() => {
    // Display banner if score increased compared to score since the page was visited
    if (oldTaggScore < tagg_score) {
      // const options = {
      //   enableVibrateFallback: true,
      //   ignoreAndroidSystemSettings: false,
      // };
      // ReactNativeHapticFeedback.trigger('impactLight', options);
      const pointsEarned = tagg_score - oldTaggScore;
      setTimeout(() => {
        dispatch(makeAction(Banner.SHOW, true));
        dispatch(makeAction(Banner.TEXT, TaggScoreBannerText.PAGE_EDIT));
        dispatch(makeAction(Banner.POINT, `+ ${pointsEarned}`));
      }, 800);
      setOldTaggScore(tagg_score);
    }
  }, [tagg_score]);

  const handleSave = async () => {
    await Promise.all([
      dispatch(
        updateUserSkin(
          templateChoice,
          selectedBackgroundColor,
          selectedTabColor,
          colorPickerColors[0],
        ),
      ),
    ]);
    await Promise.all([dispatch(loadUserProfileInfo(userId))]);
    track('SavePage', AnalyticVerb.Finished, AnalyticCategory.EditAPage);
    navigation.navigate('Profile', { showShareModalParm: false });
  };

  const customCallBack = async (colors: string[]) => {
    if (activeBgType === bgTypes.SOLID && activeColorFor === colorTypes.BACKGROUND_COLOR) {
      setSelectedBackgroundColor(colors[0]);
      setLinerColorList(['#828282', '#828282']);
    } else if (activeBgType === bgTypes.SOLID && activeColorFor === colorTypes.TAB_COLOR) {
      setSelectedTabColor(colors[0]);
      setTabLinerColorList(['#828282', '#828282']);
    } else if (
      activeBgType === bgTypes.GRADIENT &&
      activeColorFor === colorTypes.BACKGROUND_COLOR
    ) {
      setSelectedBackgroundColor(`${colors[0]},${colors[1]}`);
      setLinerColorList(colors);
    } else if (activeBgType === bgTypes.GRADIENT && activeColorFor === colorTypes.TAB_COLOR) {
      setSelectedTabColor(`${colors[0]},${colors[1]}`);
      setTabLinerColorList(colors);
    }
  };

  const setTheme = async (primaryColor: string, secondaryColor: string) => {
    if (activeBgType === bgTypes.SOLID) {
      setSelectedBackgroundColor(primaryColor);
      setSelectedTabColor(secondaryColor);
      if (activeColorFor === colorTypes.BACKGROUND_COLOR) {
        setColorPickerColors([primaryColor]);
      } else {
        setColorPickerColors([secondaryColor]);
      }
    }
  };

  const fontColorSelection = () => {
    if (templateChoice === 'THREE' || templateChoice === 'FIVE') {
      return setIsLockVisible(true);
    }
    setIsColorPickerVisible(true);
  };
  const onSelectGradientBackground = () => {
    if (templateChoice === 'TWO') {
      return setIsLockVisible(true);
    } else if (!isBgGradientUnlock) {
      return setIsGradientBgModalVisible(true);
    }
    setActiveColorFor(colorTypes.BACKGROUND_COLOR);
    setActiveBgType(bgTypes.GRADIENT);
    setIsColorPickerVisible(true);
  };
  const onSelectTabGradient = () => {
    if (templateChoice === 'TWO') {
      return setIsLockVisible(true);
    } else if (!isTabGradientUnlock) {
      return setIsGradientTabModalVisible(true);
    }
    track('TabGradientColor', AnalyticVerb.Pressed, AnalyticCategory.EditAPage);
    setActiveBgType(bgTypes.GRADIENT);
    setActiveColorFor(colorTypes.TAB_COLOR);
    setIsColorPickerVisible(true);
  };

  return (
    <>
      <LinearGradient
        colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
        style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listContainer}>
            <View style={styles.topBlock}>
              <TabColorTemplate
                primaryColor={selectedBackgroundColor}
                secondaryColor={selectedTabColor}
                bioTextColor={colorPickerColors[0]}
              />
            </View>
            <View style={styles.bottomBlock}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  Edit {route.params.screenType === HOMEPAGE ? 'Homepage' : route.params.screenType}
                </Text>
                <Text style={styles.description}>Change background color and fonts</Text>
              </View>
              {isColorPickerVisible && (
                <ColorPicker
                  linerColors={
                    activeColorFor === colorTypes.BACKGROUND_COLOR
                      ? linerColorList
                      : tabLinerColorList
                  }
                  gradient={activeBgType === bgTypes.GRADIENT}
                  colorPickerColors={colorPickerColors}
                  setIsModalVisible={setIsColorPickerVisible}
                  setColorPickerColors={setColorPickerColors}
                  customCallBack={customCallBack}
                  showThemes={activeBgType !== bgTypes.GRADIENT}
                  setTheme={setTheme}
                />
              )}
              {
                <>
                  <Text style={styles.bgColorText}>Background Color</Text>
                  <View style={styles.bgBlock}>
                    {templateChoice !== 'TWO' && (
                      <TouchableWithoutFeedback onPress={onSelectGradientBackground}>
                        <View style={[styles.bgType]}>
                          <LinearGradient
                            colors={
                              linerColorList[0] === linerColorList[1]
                                ? ['#828282', '#828282']
                                : linerColorList
                            }
                            style={styles.bgTypeGradient}>
                            <View style={styles.bgTextContainer}>
                              {!isBgGradientUnlock && (
                                <SvgXml xml={icons.WhiteLock} width={14} height={14} />
                              )}
                              <Text style={styles.bgTypeText}>Gradient</Text>
                            </View>
                          </LinearGradient>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                    <TouchableWithoutFeedback
                      onPress={() => {
                        track(
                          'BackgroundSolidColor',
                          AnalyticVerb.Pressed,
                          AnalyticCategory.EditAPage,
                        );
                        setActiveBgType(bgTypes.SOLID);
                        setActiveColorFor(colorTypes.BACKGROUND_COLOR);
                        setColorPickerColors([selectedBackgroundColor]);
                        setIsColorPickerVisible(true);
                      }}>
                      <View
                        style={[
                          styles.bgType,
                          /* eslint-disable */
                          {
                            backgroundColor:
                              selectedBackgroundColor.length > 7
                                ? '#828282'
                                : selectedBackgroundColor,
                          },
                          styles.activeBgType,
                          selectedBackgroundColor.length > 7 && styles.solidBlackBorder,
                          /* eslint-enable */
                        ]}>
                        <Text
                          style={[
                            styles.bgTypeText,
                            (selectedBackgroundColor == '#FFFFFF' ||
                              selectedBackgroundColor == 'white') &&
                              styles.solidBlack,
                          ]}>
                          Solid
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    {templateChoice === 'FOUR' && (
                      <TouchableWithoutFeedback onPress={() => setIsLockVisible(true)}>
                        <View
                          style={[
                            styles.bgType,
                            styles.bgTypeImage,
                            // styles.activeBgType,
                            // activeBgType === bgTypes.IMAGE ? styles.activeBgType : {},
                          ]}>
                          <Image source={chessBg} style={styles.bgImage} />
                          <View style={styles.bgTypeImageViewLocked}>
                            <SvgXml xml={icons.WhiteLock} width={14} height={14} />
                            <Text style={styles.bgTypeText}>Image</Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  </View>
                </>
              }
              <Text style={styles.bgColorText}>Tab Color</Text>
              <View style={styles.bgBlock}>
                {templateChoice !== 'TWO' && (
                  <TouchableWithoutFeedback onPress={onSelectTabGradient}>
                    <View style={[styles.bgType]}>
                      <LinearGradient
                        colors={
                          tabLinerColorList[0] === tabLinerColorList[1]
                            ? ['#828282', '#828282']
                            : tabLinerColorList
                        }
                        style={styles.bgTypeGradient}>
                        <View style={styles.bgTextContainer}>
                          {!isTabGradientUnlock && (
                            <SvgXml xml={icons.WhiteLock} width={14} height={14} />
                          )}
                          <Text style={styles.bgTypeText}>Gradient</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                <TouchableWithoutFeedback
                  onPress={() => {
                    track('TabSolidColor', AnalyticVerb.Pressed, AnalyticCategory.EditAPage);
                    setActiveBgType(bgTypes.SOLID);
                    setActiveColorFor(colorTypes.TAB_COLOR);
                    setColorPickerColors([selectedTabColor]);
                    setIsColorPickerVisible(true);
                  }}>
                  <View
                    style={[
                      styles.bgType,
                      /* eslint-disable */
                      {
                        backgroundColor: selectedTabColor.length > 7 ? '#828282' : selectedTabColor,
                      },
                      /* eslint-enable */
                      styles.activeBgType,
                      selectedTabColor.length > 7 && styles.solidBlackBorder,
                    ]}>
                    <Text
                      style={[
                        styles.bgTypeText,
                        (selectedTabColor == '#FFFFFF' || selectedTabColor == 'white') &&
                          styles.solidBlack,
                      ]}>
                      Solid
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <TouchableOpacity onPress={fontColorSelection} style={styles.fontContainer}>
                {(templateChoice === 'THREE' || templateChoice === 'FIVE') && (
                  <SvgXml xml={icons.Lock} width={15} height={15} />
                )}
                <Text style={styles.fontText}>Font +</Text>
              </TouchableOpacity>
              {route.params.screenType === HOMEPAGE && (
                <TouchableOpacity
                  style={styles.changeSkinButton}
                  onPress={() => {
                    track('ChangeSkinsScreen', AnalyticVerb.Pressed, AnalyticCategory.Settings);
                    navigation.navigate('ChangeSkinsScreen');
                  }}>
                  <Text style={styles.changeSkinText}>{'Change Profile Skin'}</Text>
                  <SvgXml
                    xml={icons.FrontArrow}
                    width={normalize(13)}
                    height={normalize(13)}
                    color={'black'}
                  />
                </TouchableOpacity>
              )}
              <SimpleButton
                title={'Save'}
                onPress={handleSave}
                containerStyles={
                  // data?.link_type === VideoLinkWidgetLinkTypes.TIKTOK
                  //   ? styles.buttonContainerMT
                  //   : styles.
                  styles.buttonContainer
                }
                disabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <LockedModal
        visible={isLockVisible}
        setVisible={setIsLockVisible}
        onPress={() => setIsLockVisible(false)}
      />
      <GradientForProfileBGTabModal
        visible={isGradientBgModalVisible}
        disabled={tagg_score <= 25}
        setVisible={setIsGradientBgModalVisible}
        onPress={() => {
          setIsGradientBgModalVisible(false);
          setTimeout(() => {
            navigation.navigate('UnwrapReward', {
              rewardUnwrapping: RewardType.PROFILE_GRADIENT_BG_COLOR,
              screenType: route.params.screenType,
            });
          }, 500);
        }}
        type={'BG'}
      />
      <GradientForProfileBGTabModal
        visible={isGradientTabModalVisible}
        disabled={tagg_score <= 25}
        setVisible={setIsGradientTabModalVisible}
        onPress={() => {
          setIsGradientTabModalVisible(false);
          setTimeout(() => {
            navigation.navigate('UnwrapReward', {
              rewardUnwrapping: RewardType.TAB_GRADIENT_BG_COLOR,
              screenType: route.params.screenType,
            });
          }, 500);
        }}
        type={'Tab'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
    color: 'red',
  },
  deleteSection: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  fontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  deleteText: {
    color: '#EF1F51',
  },
  changeSkinText: {
    color: 'black',
    fontSize: normalize(15),
    fontWeight: '600',
    lineHeight: normalize(21),
  },
  changeSkinButton: {
    width: SCREEN_WIDTH * 0.92,
    height: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    marginBottom: '5%',
  },
  container: {
    flex: 1,
  },
  bgTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    display: 'flex',
    marginTop: 80,
    paddingTop: 10,
    height: '150%',
    paddingBottom: 160,
  },
  topBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleTopLogo: {
    height: 44,
    width: 44,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bottomBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: '4%',
    height: 400,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    flex: 1,
  },
  logo: {
    width: normalize(172),
    height: normalize(166),
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 10,
  },
  description: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 25,
    color: 'grey',
  },
  titleWithSmallMarginBottom: {
    marginBottom: 10,
  },
  subTitle: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 30,
    color: '#828282',
  },
  inputContainer: {
    marginBottom: 24,
  },
  fontText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 21,
    width: 80,
    color: '#828282',
  },
  bgBlock: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  bgColorText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  bgType: {
    height: 47,
    width: 75,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  headerBg: {
    height: 48,
    width: 130,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  activeBgType: {
    borderWidth: 2,
    borderColor: '#6EE7E7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  solidBlackBorder: { borderColor: '#828282' },
  solidBlack: { color: '#333333' },
  white: { color: '#333333' },
  bgTypeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
    alignSelf: 'center',
    zIndex: 1,
    marginLeft: 2,
  },
  bgTypeGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#828282',
  },
  bgTypeSolid: {
    backgroundColor: '#FA263D',
  },
  bgTypeSolidGrey: {
    backgroundColor: '#BDBDBD',
  },
  bgTypeImage: {
    backgroundColor: 'rgba(0,0,0,0.73)',
  },
  bgImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.5,
    // backgroundColor: 'red',
    borderRadius: 8,
  },
  bgTypeNone: {
    backgroundColor: '#BDBDBD',
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  buttonContainerMT: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '40%',
  },
  bgTypeImageViewLocked: {
    height: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: { height: normalize(10), marginRight: '5%' },
});

export default EditPageScreen;
