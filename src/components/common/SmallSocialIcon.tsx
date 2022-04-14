import React from 'react';

import { Image } from 'react-native';

import { images } from 'assets/images';

interface SmallSocialIconProps {
  social: string;
  style: object;
}
/**
 * An image component that returns the <Image> of the icon for a specific social media platform.
 */
const SmallSocialIcon: React.FC<SmallSocialIconProps> = ({ social: social, style: style }) => {
  switch (social) {
    case 'Instagram':
      var icon = images.socials.instagramSmall;
      break;
    case 'Facebook':
      var icon = images.socials.facebookIconSmall;
      break;
    case 'Twitter':
      var icon = images.socials.twitterSmall;
      break;
    // TODO: Missing icon assets
    // case 'Twitch':
    //   var icon = require('assets/socials/twitch-icon-small.png');
    //   break;
    // case 'Pinterest':
    //   var icon = require('assets/socials/pinterest-icon-small.png');
    //   break;
    // case 'Whatsapp':
    //   var icon = require('assets/socials/whatsapp-icon-small.png');
    //   break;
    // case 'Linkedin':
    //   var icon = require('assets/socials/linkedin-icon-small.png');
    //   break;
    case 'Snapchat':
      var icon = images.socials.snapchatSmall;
      break;
    case 'Youtube':
      var icon = images.socials.youtubeSmall;
      break;
    case 'TikTok':
      var icon = images.socials.tiktokSmall;
      break;
    default:
      var icon = images.socials.logo;
      break;
  }
  return <Image style={style} source={icon} />;
};

export default SmallSocialIcon;
