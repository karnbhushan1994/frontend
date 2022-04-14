import React from 'react';

import { Image } from 'react-native';

import { images } from 'assets/images';

interface SocialIconProps {
  social: string;
  style: object;
  whiteRing: boolean | undefined;
}
/**
 * An image component that returns the <Image> of the icon for a specific social media platform.
 */
const SocialIcon: React.FC<SocialIconProps> = ({ social: social, style: style, whiteRing }) => {
  switch (social) {
    case 'Instagram':
      var icon = images.socials.instagramShare;
      if (whiteRing) {
        icon = images.socials.instagramWhiteBG;
      }
      break;
    case 'Messenger':
      var icon = images.socials.messenger;
      break;
    case 'Stories':
      var icon = images.socials.instagram;
      if (whiteRing) {
        icon = images.socials.instagramWhiteBG;
      }
      break;
    case 'Facebook':
      var icon = images.socials.facebookIcon;
      break;
    case 'Twitter':
      var icon = images.socials.twitterShare;
      break;
    case 'Twitch':
      var icon = images.socials.twitch;
      break;
    case 'Pinterest':
      var icon = images.socials.pinterest;
      break;
    case 'Whatsapp':
      var icon = images.socials.whatsapp;
      break;
    case 'Linkedin':
      var icon = images.socials.linkedin;
      break;
    case 'Snapchat':
      var icon = images.socials.snapchat;
      break;
    case 'Youtube':
      var icon = images.socials.youtube;
      break;
    case 'TikTok':
      var icon = images.socials.tiktok;
      break;
    case 'SMS':
      var icon = images.socials.sms;
      break;
    default:
      var icon = images.socials.logo;
      break;
  }
  return <Image style={style} source={icon} />;
};

export default SocialIcon;
