import { AsyncAnalyticsStatusTextList, SHARE_PROFILE_BUTTON_TEXT } from 'constants';

import React, { FC, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { useDispatch, useSelector } from 'react-redux';

import { tutorialAssets } from 'assets/tutorial-assets';
import { ProfileContext, ProfileHeaderContext } from 'screens/profile/ProfileScreen';

import { updateTaggScore, updateAnalyticStatus, updateProfileTutorialStage } from 'store/actions';
import { showTutorialPopup } from 'store/reducers';

import { RootState } from 'store/rootReducer';
import {
  ASYNC_STORAGE_KEYS,
  ProfileTutorialStage,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
  TemplateEnumType,
} from 'types';

import { onCopyProfileLink, SCREEN_WIDTH } from 'utils';

type TutorialModalProps = {
  visible: boolean;
  onPress?: () => void;
  onDismiss?: () => void;
  type: string;
  templateType: string;
};

const TutorialModal: FC<TutorialModalProps> = ({ visible, onDismiss, type, templateType }) => {
  const isAddTagg = type === 'addTagg';
  const text = isAddTagg
    ? 'Click here to start adding taggs'
    : 'Share profile link in your social media bios';
  const image = isAddTagg ? tutorialAssets.addTaggGif : tutorialAssets.shareProfileGif;

  const navigation = useNavigation();

  const { analyticsStatus = '' } = useSelector((state: RootState) => state.user);
  const { userId: loggedInUserId, username } = useSelector((state: RootState) => state.user.user);

  const [marginTop, setMarginTop] = useState<number>(250);

  const dispatch = useDispatch();
  const {
    profile: { profile_tutorial_stage },
  } = useContext(ProfileHeaderContext);
  const { ownProfile } = useContext(ProfileContext);

  const {
    profileTemplate: {
      skin: { template_type },
    },
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (profile_tutorial_stage === ProfileTutorialStage.SHOW_STEWIE_GRIFFIN && ownProfile) {
      if (isAddTagg) {
        setMarginTop(300);
        navigation.getParent()?.setOptions({
          tabBarVisible: false,
        });
        dispatch(showTutorialPopup(true));
      } else if (type === 'share') {
        if (template_type === TemplateEnumType.One) {
          setMarginTop(150);
        } else if (template_type === TemplateEnumType.Two) {
          setMarginTop(-330);
        } else if (template_type === TemplateEnumType.Three) {
          setMarginTop(-310);
        } else if (template_type === TemplateEnumType.Four) {
          setMarginTop(-390);
        } else if (template_type === TemplateEnumType.Five) {
          setMarginTop(90);
        }

        navigation.getParent()?.setOptions({
          tabBarVisible: false,
        });
        dispatch(showTutorialPopup(true));
      } else {
        navigation.getParent()?.setOptions({
          tabBarVisible: true,
        });
        dispatch(showTutorialPopup(false));
      }
    } else {
      if (ownProfile) {
        navigation.getParent()?.setOptions({
          tabBarVisible:
            analyticsStatus === AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED ? false : true,
        });
        dispatch(showTutorialPopup(false));
      }
    }
  }, [profile_tutorial_stage, ownProfile, isAddTagg, type]);

  const copyLinkCallback = async () => {
    setTimeout(() => {
      dispatch(
        updateTaggScore(
          TaggScoreActionsEnum.PROFILE_SHARE,
          loggedInUserId,
          TaggScoreBannerText.PROFILE_LINK_READY_TO_SHARE,
        ),
      );
    }, 500);
    const asyncAnalyticsStatus = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED);
    if (
      !asyncAnalyticsStatus ||
      (asyncAnalyticsStatus !== AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED &&
        asyncAnalyticsStatus !== AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) ||
      !analyticsStatus
    ) {
      AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.ANALYTICS_ENABLED,
        AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED,
      );
      dispatch(updateAnalyticStatus(AsyncAnalyticsStatusTextList.PROFILE_LINK_COPIED));
    }
  };
  const onClose = () => {
    if (type === 'share') {
      dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_POST_MOMENT_1));
      onCopyProfileLink(username, copyLinkCallback);
      onDismiss && onDismiss();
    }
  };

  const ShareButton = () => {
    switch (templateType) {
      case TemplateEnumType.One:
        return (
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.longButton]} onPress={onClose}>
              <Text style={[styles.buttonText]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
            </TouchableOpacity>
          </View>
        );
      case TemplateEnumType.Two:
        return (
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.longButtonTwo]} onPress={onClose}>
              <Text style={[styles.buttonTextTwo]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
            </TouchableOpacity>
          </View>
        );
      case TemplateEnumType.Three:
        return (
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.longButtonThree]} onPress={onClose}>
              <Text style={[styles.buttonTextThree]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
            </TouchableOpacity>
          </View>
        );
      case TemplateEnumType.Four:
        return (
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.longButtonFour]} onPress={onClose}>
              <Text style={[styles.buttonTextFour]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
            </TouchableOpacity>
          </View>
        );
      case TemplateEnumType.Five:
        return (
          <View style={styles.buttonView}>
            <TouchableOpacity style={[styles.longButtonFive]} onPress={onClose}>
              <Text style={[styles.buttonTextFive]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
            </TouchableOpacity>
          </View>
        );
    }
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity style={[styles.longButton]} onPress={onClose}>
          <Text style={[styles.buttonText]}>{SHARE_PROFILE_BUTTON_TEXT}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (visible && isAddTagg) {
    return (
      <TouchableWithoutFeedback>
        <Animatable.View animation="fadeIn" style={styles.modalContainer}>
          <BlurView
            style={styles.blurredView}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={[styles.popupContainer, { marginTop }]}>
            <Image source={image} style={styles.image} />
            <Text style={styles.text}>{text}</Text>
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  } else if (visible && type === 'share') {
    return (
      <TouchableWithoutFeedback style={styles.topModalContainer}>
        <Animatable.View animation="fadeIn" style={styles.topModalContainer}>
          <BlurView
            style={styles.blurredView}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={[styles.popupContainer, { marginTop }]}>
            <Image source={image} style={styles.image} />
            <Text style={styles.text}>{text}</Text>
          </View>
          <ShareButton />
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }
  return null;
};

export default TutorialModal;

const styles = StyleSheet.create({
  topModalContainer: {
    zIndex: 999999999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  popupContainer: {
    width: 300,
    height: 212,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  blurredView: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 220,
    height: 120,
    resizeMode: 'cover',
  },
  text: {
    width: '80%',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
  },
  coinPopupContainer: {
    flex: 1,
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  coinEarnTextImage: {
    resizeMode: 'center',
  },
  earningText: {
    width: '70%',
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    lineHeight: 28,
    textAlign: 'center',
  },
  doneText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    lineHeight: 28,
    textAlign: 'center',
  },
  btnContainer: {
    marginTop: 64,
    marginBottom: 50,
    width: '85%',
    alignItems: 'flex-start',
  },
  doneBtn: {},
  coinContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coin: {
    width: 300,
    height: 300,
  },
  //template1
  longButton: {
    width: '92%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#892101',
  },
  longButtonTwo: {
    width: '90%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#698DD3',
  },
  longButtonThree: {
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.44,
    backgroundColor: '#FFFFFF',
  },
  longButtonFour: {
    width: '90%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  longButtonFive: {
    width: '95%',
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonTextTwo: {
    color: 'white',
    fontWeight: '700',
  },
  buttonTextThree: {
    color: 'black',
    fontWeight: '700',
  },
  buttonTextFour: {
    color: '#698DD3',
    fontWeight: '700',
  },
  buttonTextFive: {
    color: 'black',
    fontWeight: '700',
  },
  buttonView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
