import React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { images } from 'assets/images';

import { handlePressForAuthBrowser } from 'services';
import { LinkerType, ScreenType } from 'types';

import { SOCIAL_FONT_COLORS } from '../../constants/constants';

import SocialIcon from '../common/SocialIcon';

interface SocialMediaLinkerProps extends TouchableOpacityProps {
  social: LinkerType;
}

const SocialMediaLinker: React.FC<SocialMediaLinkerProps> = ({ social: { label } }) => {
  const [state, setState] = React.useState({
    socialLinked: false,
  });

  const handlePress = async () => {
    setState({
      ...state,
      socialLinked: await handlePressForAuthBrowser(label),
    });
  };

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

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.container}>
      <SocialIcon social={label} style={styles.icon} screenType={ScreenType.Profile} />
      <Text style={[styles.label, { color: font_color }]}>{label}</Text>
      {state.socialLinked && <Image source={images.main.link_tick} style={styles.tick} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '28%',
    height: '100%',
    backgroundColor: '#4c409a',
    borderRadius: 8,
    marginHorizontal: '2%',
    marginVertical: '2%',
    alignItems: 'center',
  },
  icon: {
    top: '15%',
  },
  label: {
    fontWeight: '500',
    top: '25%',
  },
  tick: {
    top: '30%',
  },
});
export default SocialMediaLinker;
