import React, { useState } from 'react';

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { images } from 'assets/images';

import { handlePressForAuthBrowser, registerNonIntegratedSocialLink } from 'services';

import { LinkerType, ScreenType } from 'types';

import {
  INTEGRATED_SOCIAL_LIST,
  SOCIAL_FONT_COLORS,
  TAGG_ICON_DIM,
} from '../../constants/constants';
import { ERROR_LINK, SUCCESS_LINK } from '../../constants/strings';

import { SocialLinkModal } from '../common';
import SocialIcon from '../common/SocialIcon';

interface SocialMediaLinkerProps extends TouchableOpacityProps {
  social: LinkerType;
}

const SocialMediaLinker: React.FC<SocialMediaLinkerProps> = ({ social: { label } }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);

  switch (label) {
    case 'Instagram':
      var font_color = SOCIAL_FONT_COLORS.INSTAGRAM;
      break;
    case 'Facebook':
      var font_color = SOCIAL_FONT_COLORS.FACEBOOK;
      break;
    case 'Twitter':
      var font_color = SOCIAL_FONT_COLORS.TWITTER;
      break;
    case 'Twitch':
      var font_color = SOCIAL_FONT_COLORS.TWITCH;
      break;
    case 'Pinterest':
      var font_color = SOCIAL_FONT_COLORS.PINTEREST;
      break;
    case 'Whatsapp':
      var font_color = SOCIAL_FONT_COLORS.WHATSAPP;
      break;
    case 'Linkedin':
      var font_color = SOCIAL_FONT_COLORS.LINKEDIN;
      break;
    case 'Snapchat':
      var font_color = SOCIAL_FONT_COLORS.SNAPCHAT;
      break;
    case 'Youtube':
      var font_color = SOCIAL_FONT_COLORS.YOUTUBE;
      break;
    default:
      var font_color = '#fff';
  }

  const linkNonIntegratedSocial = async (username: string) => {
    if (await registerNonIntegratedSocialLink(label, username)) {
      Alert.alert(SUCCESS_LINK(label));
      setAuthenticated(true);
    } else {
      // If we display too fast the alert will get dismissed with the modal
      setTimeout(() => {
        Alert.alert(ERROR_LINK(label));
      }, 500);
    }
  };

  const modelOrAuthBrowser = async () => {
    // check if it's integrated
    if (INTEGRATED_SOCIAL_LIST.indexOf(label) >= 0) {
      handlePressForAuthBrowser(label).then(success => {
        setAuthenticated(success);
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={modelOrAuthBrowser} style={styles.container}>
      <SocialIcon social={label} style={styles.icon} screenType={ScreenType.Profile} />
      <Text style={[styles.label, { color: font_color }]}>{label}</Text>
      {authenticated && <Image source={images.main.link_tick} style={styles.tick} />}
      <SocialLinkModal
        social={label}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        completionCallback={linkNonIntegratedSocial}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '28%',
    maxHeight: 150,
    backgroundColor: '#4c409a',
    borderRadius: 8,
    marginHorizontal: '2%',
    marginVertical: '2%',
    alignItems: 'center',
    paddingVertical: '2%',
  },
  icon: {
    width: TAGG_ICON_DIM,
    height: TAGG_ICON_DIM,
    marginVertical: '8%',
  },
  label: {
    fontWeight: '500',
  },
  tick: {
    marginTop: '5%',
  },
});
export default SocialMediaLinker;
