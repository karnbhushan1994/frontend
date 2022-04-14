import React from 'react';

import { Image, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { images } from 'assets/images';
import { normalize } from 'utils';

interface NavigationIconProps extends TouchableOpacityProps {
  tab: 'Home' | 'Search' | 'Upload' | 'Notifications' | 'Profile' | 'DiscoverMoments' | 'Chat';
  disabled?: boolean;
  newIcon?: boolean;
  isBigger?: boolean;
}

const NavigationIcon = (props: NavigationIconProps) => {
  const { tab, isBigger } = props;
  let imgSrc;
  switch (props.tab) {
    case 'Home':
      imgSrc = props.disabled ? images.navigation.home : images.navigation.homeClicked;
      break;
    case 'Search':
      imgSrc = props.disabled ? images.navigation.search : images.navigation.searchClicked;
      break;
    case 'Upload':
      imgSrc = props.disabled ? images.navigation.newUpload : images.navigation.newUpload;
      break;
    case 'Notifications':
      imgSrc = props.disabled
        ? props.newIcon
          ? images.navigation.newNotifications
          : images.navigation.notifications
        : images.navigation.notificationsClicked;
      break;
    case 'Chat':
      imgSrc = props.disabled
        ? props.newIcon
          ? images.navigation.chatNotification
          : images.navigation.chat
        : images.navigation.chatClicked;
      break;
    case 'Profile':
      imgSrc = props.disabled ? images.navigation.profile : images.navigation.profileClicked;
      break;
    case 'DiscoverMoments':
      imgSrc = props.disabled ? images.navigation.moment : images.navigation.momentClicked;
      break;
    default:
      imgSrc = null;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity {...props}>
        <Image
          source={imgSrc}
          style={
            tab === 'Notifications'
              ? styles.notificationBellStyle
              : isBigger
              ? styles.biggerIcon
              : styles.icon
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.4,
  },
  icon: {
    height: 28,
    width: 28,
  },
  biggerIcon: {
    height: 44,
    width: 44,
  },
  notificationBellStyle: {
    height: normalize(22),
    width: normalize(22),
  },
});

export default NavigationIcon;
