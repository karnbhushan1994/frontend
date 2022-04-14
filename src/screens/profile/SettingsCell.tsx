import React, { useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/core';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useDispatch, useSelector } from 'react-redux';

import LockedModal from 'components/modals/lockedModal';

import { makeAction } from 'makeAction';
import { updateAnalyticStatus } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  ASYNC_STORAGE_KEYS,
  Banner,
  TaggScoreBannerText,
} from 'types';
import { copyProfileLinkToClipboard, track } from 'utils';
import { normalize, SCREEN_WIDTH } from 'utils/layouts';

import {
  COMMUNITY_INVITE_LINK,
  AsyncAnalyticsStatusTextList,
  SETTINGS_OPTIONS,
  TAGG_PURPLE,
} from '../../constants';
import { COMMUNITY_GUIDELINES, PRIVACY_POLICY } from '../../constants/api';

type SettingsCellProps = {
  title: string;
  preimage: number;
  enabledpreimage: number;
  postimage: number;
  setIsLockVisible: any;
  analyticsStatus?: string;
};

const SettingsCell: React.FC<SettingsCellProps> = ({
  title,
  preimage,
  postimage,
  analyticsStatus,
  enabledpreimage,
}) => {
  const isInsights = title === SETTINGS_OPTIONS.ViewInsights;
  const [isLockVisible, setIsLockVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { username } = useSelector((state: RootState) => state.user.user);

  const shareAsLink = async (callback: () => void) => {
    await copyProfileLinkToClipboard(username);
    setIsLockVisible(false);
    callback();
  };
  const copyLinkCallback = async () => {
    setTimeout(() => {
      dispatch(makeAction(Banner.SHOW, true));
      dispatch(makeAction(Banner.TEXT, TaggScoreBannerText.PROFILE_LINK_READY_TO_SHARE));
      dispatch(makeAction(Banner.POINT, 'profileLink'));
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

  const getActions = (type: string) => {
    switch (type) {
      case SETTINGS_OPTIONS.JoinDiscord:
        // Navigate to discord invite
        Linking.openURL(COMMUNITY_INVITE_LINK);
        break;
      case SETTINGS_OPTIONS.ViewInsights:
        if (analyticsStatus === AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) {
          track('ViewYourInsights', AnalyticVerb.Pressed, AnalyticCategory.Settings);
          navigation.navigate('InsightScreen');
        } else {
          setIsLockVisible(true);
        }
        break;
      case SETTINGS_OPTIONS.CommunityGuidelines:
        track('ViewCommunityGuidelines', AnalyticVerb.Pressed, AnalyticCategory.Settings);
        openTaggLink(COMMUNITY_GUIDELINES);
        break;
      case SETTINGS_OPTIONS.PrivacyPolicy:
        track('ViewPrivacyPolicy', AnalyticVerb.Pressed, AnalyticCategory.Settings);
        openTaggLink(PRIVACY_POLICY);
        break;
      case SETTINGS_OPTIONS.BlockedProfiles:
        track('BlockedProfile', AnalyticVerb.Pressed, AnalyticCategory.Settings);
        navigation.navigate('BlockedProfiles');
        break;
      default:
        break;
    }
  };

  const openTaggLink = async (url: string) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: TAGG_PURPLE,
          preferredControlTintColor: 'white',
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  const getImageStyle = () => {
    if (isInsights && analyticsStatus !== AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) {
      return styles.disabledPreImageStyles;
    }
    return styles.preImageStyles;
  };

  const getPreImage = () => {
    if (isInsights && analyticsStatus === AsyncAnalyticsStatusTextList.ANALYTICS_ENABLED) {
      return enabledpreimage;
    }
    return preimage;
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => getActions(title)}
        style={styles.itemStyles}
        activeOpacity={isInsights ? 1.0 : 0.2}>
        <Image resizeMode={'cover'} style={getImageStyle()} source={getPreImage()} />
        <View style={styles.titleContainerStyles}>
          <Text style={/* isInsights ? styles.disabledTitleStyles : */ styles.titleStyles}>
            {title}
          </Text>
        </View>
        <View style={[styles.itemStyles, styles.subItemStyles]}>
          <Image style={styles.postImageStyles} source={postimage} />
        </View>
      </TouchableOpacity>
      <LockedModal
        message={'Feature locked. Share your profile as a link-in-bio to unlock! :)'}
        buttonTitle="Share as link"
        visible={isLockVisible}
        setVisible={setIsLockVisible}
        onPress={() => shareAsLink(copyLinkCallback)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  itemStyles: {
    marginTop: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subItemStyles: { position: 'absolute', right: 0 },
  preImageStyles: { width: SCREEN_WIDTH * 0.05, height: SCREEN_WIDTH * 0.05 },
  disabledPreImageStyles: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    tintColor: '#D0C6FF',
  },
  postImageStyles: { width: 10, height: 17 },
  titleContainerStyles: { marginLeft: '12%' },
  titleStyles: {
    fontSize: normalize(15),
    fontWeight: '600',
    lineHeight: normalize(17.9),
    color: 'white',
  },
  disabledTitleStyles: {
    fontSize: normalize(15),
    fontWeight: '600',
    lineHeight: normalize(17.9),
    color: '#D0C6FF',
  },
  subtitleStyles: { color: '#C4C4C4', marginRight: 13 },
});

export default SettingsCell;
