import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import { useDispatch, useSelector } from 'react-redux';

import { TaggBigInput, TemplateFourHeaderCard } from 'components';
import { ColorPicker } from 'components/common/ColorPicker';
import BioTemplateFive from 'components/templates/TemplateBios/BioTemplateFive';
import BioTemplateOne from 'components/templates/TemplateBios/BioTemplateOne';
import BioTemplateTwo from 'components/templates/TemplateBios/BioTemplateTwo';
import SimpleButton from 'components/widgets/SimpleButton';

import { MainStackParams } from 'routes';
import { patchEditProfile, udpateProfileSkinService } from 'services';
import { loadUserData } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { BackgroundGradientType, ScreenType, TemplateEnumType } from 'types';
import {
  getBioBgColors,
  getBioTextColor,
  getTokenOrLogout,
  gradientColorFormation,
  SCREEN_HEIGHT,
  StatusBarHeight,
} from 'utils';

import { BACKGROUND_GRADIENT_MAP, bioRegex } from '../../constants';

type AddTaggRouteProps = RouteProp<MainStackParams, 'EditBioTemplate'>;

type AddTaggNavigationProps = StackNavigationProp<MainStackParams, 'EditBioTemplate'>;
interface AddTaggProps {
  route: AddTaggRouteProps;
  navigation: AddTaggNavigationProps;
}

const bgTypes = {
  GRADIENT: 'gradient',
  SOLID: 'solid',
  IMAGE: 'image',
  NONE: 'none',
};

const EditBioTemplate: React.FC<AddTaggProps> = () => {
  const navigation = useNavigation();

  const { userId, username } = useSelector((state: RootState) => state.user.user);
  const [activeBgType, setActiveBgType] = useState('');

  const {
    skin: {
      template_type: templateChoice,
      bio_text_color: bioTextColor,
      bio_color_start: bioColorStart,
      bio_color_end: bioColorEnd,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      id: skinId,
    },
  } = useSelector((state: RootState) => state.user.profileTemplate);

  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  const { biography } = useSelector((state: RootState) => state.user.profile);

  const [isValidBio, setIsValidBio] = useState<boolean>(true);
  const [bio, setBio] = useState<string>('');

  const [bioColors, setBioColors] = useState<string[]>(['#FFFFFF', '#FFFFFF']);
  const [textColors, setTextColor] = useState<string[]>(['#FFFFFF']);

  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [isFontSelected, setIsFontSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!activeBgType || activeBgType === bgTypes.NONE) {
      setBioColors(
        getBioBgColors(
          primaryColor,
          secondaryColor,
          templateChoice,
          bioColorStart,
          bioColorEnd,
          activeBgType === bgTypes.NONE,
        ),
      );
    }
  }, [bioColorStart, bioColorEnd, activeBgType, primaryColor, secondaryColor, templateChoice]);

  useEffect(() => {
    setTextColor(
      gradientColorFormation(
        getBioTextColor(primaryColor, secondaryColor, templateChoice, bioTextColor),
      ),
    );
  }, [bioTextColor]);

  useEffect(() => {
    setBio(biography);
  }, [biography]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, []);

  const dispatch = useDispatch();

  const BioPreview = useMemo(
    () =>
      (templateChoice === TemplateEnumType.One && (
        <BioTemplateOne
          disable={true}
          biography={bio}
          bioColorStart={bioColors[0]}
          bioColorEnd={bioColors[1]}
          bioTextColor={textColors[0]}
        />
      )) ||
      (templateChoice === TemplateEnumType.Two && (
        <BioTemplateTwo
          disable={true}
          userXId={undefined}
          screenType={ScreenType.Profile}
          biography={bio}
          bioTextColor={textColors[0]}
          containerStyle={styles.extraPadding}
        />
      )) ||
      (templateChoice === TemplateEnumType.Four && (
        <TemplateFourHeaderCard
          disable={true}
          userXId={undefined}
          screenType={ScreenType.Profile}
          biography={bio}
          cardColorStart={bioColors[0]}
          cardColorEnd={bioColors[1]}
          bioTextColor={textColors[0]}
        />
      )) ||
      (templateChoice === TemplateEnumType.Five && (
        <BioTemplateFive
          disable={true}
          userXId={undefined}
          screenType={ScreenType.Profile}
          biography={bio}
          bioTextColor={textColors[0]}
        />
      )),
    [templateChoice, textColors, bioColors, bio, activeBgType],
  );

  const handleSubmit = useCallback(async () => {
    if (!attemptedSubmit) {
      setAttemptedSubmit(true);
    }
    let invalidFields: boolean = false;
    const request = new FormData();

    if (bio) {
      if (isValidBio) {
        request.append('biography', bio.trim());
      } else {
        setAttemptedSubmit(false);
        setTimeout(() => setAttemptedSubmit(true));
        invalidFields = true;
      }
    }

    if (invalidFields) {
      return;
    }

    patchEditProfile(request, userId);

    const token = await getTokenOrLogout(dispatch);

    const requestBody: Object = {
      bio_color_start:
        activeBgType !== bgTypes.NONE && activeBgType !== ''
          ? bioColors[0]
          : activeBgType === ''
          ? bioColorStart
          : null,
      bio_color_end:
        activeBgType === bgTypes.GRADIENT && activeBgType !== ''
          ? bioColors[1]
          : activeBgType === ''
          ? bioColorEnd
          : null,
      bio_text_color: bioTextColor !== textColors[0] ? textColors[0] : bioTextColor,
    };
    udpateProfileSkinService(skinId, token, requestBody);
    dispatch(loadUserData({ userId, username }));
    navigation.goBack();
  }, [userId, navigation, bio, activeBgType, bioColors, textColors]);

  const handleBioUpdate = (newBio: string) => {
    let isValidBioTemp: boolean = bioRegex.test(newBio);
    setBio(newBio);
    setIsValidBio(isValidBioTemp);
  };

  const handleClosePicker = (value: boolean) => {
    setColorPickerVisible(value);
    setIsFontSelected(value);
  };

  return (
    <LinearGradient
      colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
      style={styles.container}>
      {console.log('Edit bio template is rendering!')}
      <StatusBar barStyle={'light-content'} />
      <TouchableWithoutFeedback
        accessible={false}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerBarSpacing} />
          <View style={styles.listContainer}>
            {colorPickerVisible && (textColors || bioColors) && (
              <ColorPicker
                gradient={isFontSelected ? false : activeBgType === bgTypes.GRADIENT}
                colorPickerColors={isFontSelected ? textColors : bioColors}
                setColorPickerColors={isFontSelected ? setTextColor : setBioColors}
                setIsModalVisible={handleClosePicker}
                setActiveBgType={setActiveBgType}
                isBioFontSelected={true}
              />
            )}
            <View style={styles.bioPreviewView}>{BioPreview}</View>
            <View style={styles.bottomBlock}>
              <Text style={styles.bioHeader}>Bio Header</Text>
              <Text style={styles.bioSubHeader}>Change bio color and fonts</Text>
              <Text style={styles.addTextTitle}>Add text</Text>
              <View style={styles.inputContainer}>
                <TaggBigInput
                  placeHolderColor={'#828282'}
                  textInputStyle={styles.bioInput}
                  containerStyle={styles.bioInputView}
                  accessibilityHint="Enter a bio."
                  accessibilityLabel="Bio input field."
                  placeholder="Bio"
                  autoCompleteType="off"
                  textContentType="none"
                  autoCapitalize="none"
                  returnKeyType="default"
                  onChangeText={handleBioUpdate}
                  blurOnSubmit={false}
                  valid={isValidBio}
                  attemptedSubmit={attemptedSubmit}
                  invalidWarning={'Bio must be less than 75 characters'}
                  value={bio}
                />
                <View style={styles.bioInputFooterView}>
                  <Text style={styles.bioInputFooter}>{`${bio.length}/75`}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsFontSelected(true);
                  setColorPickerVisible(true);
                }}>
                <Text style={styles.fontText}>Font +</Text>
              </TouchableOpacity>
              {templateChoice === TemplateEnumType.One ||
              templateChoice === TemplateEnumType.Four ? (
                <>
                  <Text style={styles.bgColorText}>Background Color</Text>
                  <View style={styles.bgBlock}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setActiveBgType(bgTypes.GRADIENT);
                        setColorPickerVisible(true);
                      }}>
                      <View
                        style={[
                          styles.bgType,
                          activeBgType === bgTypes.GRADIENT ? styles.activeBgType : {},
                        ]}>
                        <LinearGradient
                          colors={
                            activeBgType == ''
                              ? bioColorEnd
                                ? [bioColorStart, bioColorEnd]
                                : ['#e1e1e1', '#b7b7b7']
                              : activeBgType == 'gradient'
                              ? [bioColors[0], bioColors[1]]
                              : ['#e1e1e1', '#b7b7b7']
                          }
                          start={{ x: 0.0, y: 1.0 }}
                          end={{ x: 1.0, y: 1.0 }}
                          style={styles.bgTypeGradient}>
                          <View>
                            <Text style={styles.bgTypeText}>Gradient</Text>
                          </View>
                        </LinearGradient>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setActiveBgType(bgTypes.SOLID);
                        setColorPickerVisible(true);
                      }}>
                      <View
                        style={[
                          styles.bgType,
                          //styles.bgTypeSolidGrey,
                          activeBgType === bgTypes.SOLID ? styles.activeBgType : {},
                          {
                            backgroundColor:
                              activeBgType == ''
                                ? bioColorEnd
                                  ? '#BDBDBD'
                                  : bioColorStart
                                  ? bioColorStart
                                  : bioColors[0] || '#BDBDBD'
                                : activeBgType == 'solid'
                                ? bioColors[0]
                                : '#BDBDBD',
                          },
                        ]}>
                        <Text style={styles.bgTypeText}>Solid</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setActiveBgType(bgTypes.NONE);
                      }}>
                      <View
                        style={[
                          styles.bgType,
                          styles.bgTypeNone,
                          activeBgType === bgTypes.NONE ? styles.activeBgType : {},
                        ]}>
                        <Text style={styles.bgTypeText}>None</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </>
              ) : null}
              <SimpleButton title={'Save'} onPress={handleSubmit} disabled={!isValidBio} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bioInputFooter: {
    color: '#828282',
    alignSelf: 'flex-end',
  },
  bioInputFooterView: {
    backgroundColor: '#e8e8e8',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: '1%',
    paddingHorizontal: '3%',
  },
  bioInputView: {
    backgroundColor: '#E8E8E8',
    margin: 0,
    width: '100%',
    paddingVertical: '1%',
    paddingHorizontal: '3%',
    alignSelf: 'flex-end',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  bioInput: {
    color: 'black',
    width: '100%',
  },
  addTextTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 10,
    color: '#000000',
  },
  bioSubHeader: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 30,
    color: '#828282',
  },
  bioPreviewView: {
    paddingHorizontal: '4%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioHeader: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: '2%',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    display: 'flex',
    height: '150%',
  },
  bottomBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: '4%',
    height: 450,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 20,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  fontText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 21,
    marginBottom: 24,
    width: 80,
  },
  bgBlock: {
    flexDirection: 'row',
    marginBottom: 54,
  },
  bgColorText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  bgType: {
    height: 48,
    width: 70,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
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
  bgTypeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
    alignSelf: 'center',
    zIndex: 1,
  },
  bgTypeGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTypeSolid: {
    backgroundColor: '#FA263D',
  },
  bgTypeSolidGrey: {
    backgroundColor: '#BDBDBD',
  },
  bgTypeNone: {
    backgroundColor: '#BDBDBD',
  },
  extraPadding: { paddingHorizontal: '2%' },
  headerBarSpacing: {
    height: StatusBarHeight + SCREEN_HEIGHT * 0.06,
  },
  innerContainer: {
    flex: 1,
    height: '150%',
  },
});

export default EditBioTemplate;
