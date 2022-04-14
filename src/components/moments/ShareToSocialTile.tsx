import { AsyncAnalyticsStatusTextList, TaggToastTextList } from 'constants';

import React from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';

import { updateTaggScore, updateAnalyticStatus } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  ASYNC_STORAGE_KEYS,
  MomentPostType,
  ShareToType,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
  TaggToastType,
} from 'types';
import { isIPhoneX, normalize, SCREEN_WIDTH, track } from 'utils';
import { shareProfileToSocial, shareToSocial } from 'utils/share';

import { SocialIcon } from '../common';
import { TaggToast } from '../toasts';

interface ShareToSocialTileProps {
  shareTo: ShareToType;
  moment?: MomentPostType;
  isVideo?: boolean;
  incrementMomentShareCount?: () => void;
  setIsOpen?: (value: boolean) => void | undefined;
  username?: string;
}

const ShareToSocialTile: React.FC<ShareToSocialTileProps> = ({
  shareTo,
  moment,
  isVideo,
  username,
  setIsOpen,
  incrementMomentShareCount,
}) => {
  const { analyticsStatus = '' } = useSelector((state: RootState) => state.user);
  const { userId: loggedInUserId } = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  // To display copy link toast
  const toast = useToast();

  const getIcon = () => {
    switch (shareTo) {
      case 'Search':
        return (
          <SvgXml xml={icons.ReShareSearchIcon} width={normalize(35)} height={normalize(35)} />
        );

      case 'Others':
        return (
          <SvgXml xml={icons.ReShareOthersIcon} width={normalize(35)} height={normalize(35)} />
        );

      case 'Copy Link':
        return (
          <SvgXml xml={icons.ReShareCopyLinkIcon} width={normalize(35)} height={normalize(35)} />
        );

      default:
        return <SocialIcon social={shareTo} style={styles.avatarStyle} whiteRing={false} />;
    }
  };

  const copyLinkCallback = async () => {
    if (moment) {
      TaggToast(toast, TaggToastType.Success, TaggToastTextList.LINK_COPIED);
    } else {
      //TaggToast(toast, TaggToastType.Success, TaggToastTextList.PROFILE_LINK_COPIED);
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
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const share = async () => {
    // Sharing a moment
    if (moment) {
      // if (moment.user.id !== loggedInUserId) {
      await dispatch(
        updateTaggScore(
          TaggScoreActionsEnum.MOMENT_SHARE,
          loggedInUserId,
          TaggScoreBannerText.MOMENT_SHARE,
        ),
      );
      incrementMomentShareCount();
      // }
      track('ShareToSocial', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
        momentId: moment.moment_id,
        social: shareTo,
      });
      await shareToSocial(
        shareTo,
        moment,
        isVideo,
        shareTo === 'Copy Link' ? copyLinkCallback : undefined,
      );
    }
    // Sharing a profile
    else {
      // Need to integrate profile sharing analytics to mixpanel
      await shareProfileToSocial(
        shareTo,
        username,
        shareTo === 'Copy Link' ? copyLinkCallback : undefined,
      );
    }
  };

  return (
    <TouchableOpacity onPress={share} style={styles.containerStyle}>
      {getIcon()}
      <View style={styles.nameContainerStyle}>
        <Text style={styles.nameStyle}>{shareTo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: '100%',
    paddingHorizontal: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    width: isIPhoneX() ? 80 : 70,
  },
  avatarStyle: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: 35,
  },
  nameStyle: {
    fontSize: normalize(10),
    lineHeight: normalize(15),
    color: '#828282',
    textAlign: 'center',
  },
  nameContainerStyle: {
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    marginTop: 10,
  },
  toastIconStyle: { paddingLeft: normalize(30) },
  toastTextStyle: {
    fontSize: normalize(14),
    lineHeight: normalize(16.7),
  },
  toastStyle: {
    position: 'absolute',
    top: 70,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#3EC23B',
    zIndex: 100,
  },
});

export default ShareToSocialTile;
