import React, { FC, useContext, useRef, useState } from 'react';

import { ActionSheetCustom as AS } from '@alessiocancian/react-native-actionsheet';

import AsyncStorage from '@react-native-community/async-storage';

import { useNavigation } from '@react-navigation/native';
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SvgXml } from 'react-native-svg';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import LockedModal from 'components/modals/lockedModal';
import { AsyncAnalyticsStatusTextList, HOMEPAGE } from 'constants/constants';

import { ProfileContext, ProfileHeaderContext } from 'screens/profile/ProfileScreen';
import { updateTaggScore, updateAnalyticStatus } from 'store/actions';

import { RootState } from 'store/rootReducer';

import {
  AnalyticCategory,
  AnalyticVerb,
  ASYNC_STORAGE_KEYS,
  ProfileTutorialStage,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
} from '../../../types';

import { copyProfileLinkToClipboard, track } from '../../../utils';

import ShareProfileDrawer from '../ShareProfileDrawer';

type Props = {
  screenType?: string;
  momentCategories?: string[];
  activeTab: string;
  setIsLockVisible: any;
  onPress?: (sheetRef: any) => void;
  style: ViewStyle;
};

export const ActionSheet: FC<Props> = ({ activeTab, momentCategories, onPress, style }) => {
  // Test
  const { analyticsStatus = '' } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const { setIsEdit, isEdit } = useContext(ProfileContext);
  const [shareProfile, setShareProfile] = useState<boolean>(false);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);
  const actionSheetRef = useRef<AS>(null);
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const [isLockVisible, setIsLockVisible] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const {
    profile: { profile_tutorial_stage },
    username,
  } = useContext(ProfileHeaderContext);
  const [tintColor, setTintColor] = useState(
    Appearance.getColorScheme() === 'dark' ? 'white' : '#333333',
  );

  const options = [
    // <Text style={theme === 'dark' ? styles.shareButtonDark : styles.shareButtonLight}>
    //   Share Profiless
    // </Text>,
    <Text style={theme === 'dark' ? styles.shareButtonDark : styles.shareButtonLight}>
      View Insights
    </Text>,
    <Text style={theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight}>
      Add Taggs
    </Text>,
    isEdit ? (
      <Text style={theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight}>
        Discard Changes
      </Text>
    ) : (
      <Text style={theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight}>
        Edit Page
      </Text>
    ),
    <Text style={theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight}>Settings</Text>,
    <Text style={theme === 'dark' ? styles.cancelButtonDark : styles.cancelButtonLight}>
      Cancel
    </Text>,
  ];

  let options_indices: number[] = [];
  for (let i = 0; i < options.length; i++) {
    options_indices[i] = i;
  }
  const showActionSheet = async () => {
    actionSheetRef && onPress && onPress(actionSheetRef);
    await setTintColor(Appearance.getColorScheme() === 'dark' ? 'white' : '#333333');
    track('Fab', AnalyticVerb.Pressed, AnalyticCategory.Profile);
    actionSheetRef.current?.show();
  };
  const shareAsLink = async (callback: () => void) => {
    await copyProfileLinkToClipboard(username);
    callback();
  };
  const copyLinkCallback = async () => {
    // TaggToast(toast, TaggToastType.Success, TaggToastTextList.LINK_COPIED);
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

  return (
    <>
      {!isEdit && (
        <TouchableOpacity style={[styles.menuButton, style]} onPress={showActionSheet}>
          <SvgXml xml={icons.MenuButton} />
        </TouchableOpacity>
      )}
      <AS
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={options_indices[4]}
        tintColor={tintColor}
        styles={styles}
        onPress={async index => {
          if (profile_tutorial_stage === ProfileTutorialStage.SHOW_STEWIE_GRIFFIN) {
            // await dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_POST_MOMENT_1));
          }
          switch (index) {
            case 0:
              if (analyticsStatus === AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) {
                track('FabViewYourInsights', AnalyticVerb.Pressed, AnalyticCategory.Profile);
                navigation.navigate('InsightScreen');
              } else {
                setIsLockVisible(true);
                setMessage('Feature locked. Share your profile as a link-in-bio to unlock! :)');
              }
              break;
            case 1:
              track('FabAddTaggs', AnalyticVerb.Pressed, AnalyticCategory.Profile);
              navigation.navigate('TaggShop', { activeTab });
              break;
            case 2:
              track('FabEditPage', AnalyticVerb.Pressed, AnalyticCategory.Profile);
              if (activeTab === HOMEPAGE) {
                const options = {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                };
                ReactNativeHapticFeedback.trigger('impactLight', options);
                setIsEdit(!isEdit);
              } else {
                navigation.navigate('EditPageScreen', {
                  screenType: activeTab,
                  momentCategories,
                });
              }
              break;
            case 3:
              track('FabSettings', AnalyticVerb.Pressed, AnalyticCategory.Profile);
              navigation.navigate('SettingsScreen');
              //setMessage('');
              break;
          }
        }}
      />
      <ShareProfileDrawer isOpen={shareProfile} setIsOpen={setShareProfile} username={username} />
      <LockedModal
        message={message}
        buttonTitle="Share as link"
        visible={isLockVisible}
        setVisible={setIsLockVisible}
        onPress={() => shareAsLink(copyLinkCallback)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    right: 10,
    bottom: 94,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  buttonBox: {
    opacity: 1,
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#3A3B3C' : '#fff',
  },
  buttonTextLight: {
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
  },
  buttonTextDark: {
    fontWeight: '500',
    fontSize: 15,
    color: '#fff',
  },
  shareButtonLight: {
    color: '#8F01FF',
    fontWeight: '500',
    fontSize: 15,
  },
  shareButtonDark: {
    color: '#6EE7E7',
    fontWeight: '500',
    fontSize: 15,
  },
  cancelButtonLight: {
    color: '#698DD3',
    fontWeight: '600',
    fontSize: 18,
  },
  cancelButtonDark: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  cancelButtonBox: {
    backgroundColor: Appearance.getColorScheme() === 'dark' ? '#828282' : '#F0F0F0',
  },
});
