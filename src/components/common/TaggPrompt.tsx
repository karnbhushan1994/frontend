import React from 'react';

import { useNavigation } from '@react-navigation/core';
import { ImageStyle, StyleProp, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Image, View } from 'react-native-animatable';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { images } from 'assets/images';
import { normalize, SCREEN_HEIGHT } from 'utils';

type TaggPromptProps = {
  messageHeader: string;
  messageBody: string | Element;
  logoType: 'plus' | 'tagg' | 'invite_friends' | 'private_accounts' | 'chat';
  logoLink?: string;
  externalStyles?: Record<string, StyleProp<ImageStyle>>;
  hideCloseButton?: boolean;
  noPadding?: boolean;
  onClose: () => void;
};

const TaggPrompt: React.FC<TaggPromptProps> = ({
  messageHeader,
  messageBody,
  logoType,
  logoLink,
  externalStyles,
  hideCloseButton,
  noPadding,
  onClose,
}) => {
  /**
   * Generic prompt for Tagg
   */

  const logo = () => {
    switch (logoType) {
      case 'plus':
        return images.notificationPrompts.plus;
      case 'invite_friends':
        return images.notificationPrompts.inviteFriendsPrompt;
      case 'private_accounts':
        return images.notificationPrompts.privateAccountsPrompt;
      case 'chat':
        return images.notificationPrompts.messageNotification;
      case 'tagg':
      default:
        return images.main.logo_purple;
    }
  };

  const topPadding = { paddingTop: noPadding ? 0 : SCREEN_HEIGHT / 10 };
  const bottomPadding = { paddingBottom: noPadding ? 0 : SCREEN_HEIGHT / 50 };

  const navigation = useNavigation();

  return (
    <View style={[styles.container, topPadding, bottomPadding]}>
      <TouchableOpacity
        disabled={logoLink ? false : true}
        onPress={() => logoLink && navigation.navigate(logoLink)}>
        <Image style={externalStyles?.icon ? externalStyles.icon : styles.icon} source={logo()} />
      </TouchableOpacity>
      <Text style={styles.header}>{messageHeader}</Text>
      <Text style={styles.subtext}>{messageBody}</Text>
      {!hideCloseButton && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            onClose();
          }}>
          <SvgXml xml={icons.CloseOutline} height={'50%'} width={'50%'} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: SCREEN_HEIGHT / 4,
  },
  closeButton: {
    position: 'relative',
    height: '40%',
    bottom: SCREEN_HEIGHT / 6,
    aspectRatio: 1,
    alignSelf: 'flex-end',
  },
  icon: {
    width: normalize(40),
    height: normalize(40),
  },
  header: {
    color: 'black',
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '2%',
  },
  subtext: {
    color: 'gray',
    fontSize: normalize(12),
    fontWeight: '500',
    lineHeight: normalize(20),
    textAlign: 'center',
    marginTop: '2%',
    width: '95%',
  },
});
export default TaggPrompt;
