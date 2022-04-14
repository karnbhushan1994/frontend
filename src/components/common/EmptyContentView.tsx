import React from 'react';

import { Image, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { images } from 'assets/images';

import { SCREEN_HEIGHT, normalize, SCREEN_WIDTH } from 'utils';

import { NOTIFICATION_GRADIENT } from '../../constants/constants';
import {
  UP_TO_DATE,
  NO_NEW_NOTIFICATIONS,
  FIRST_MESSAGE,
  START_CHATTING,
} from '../../constants/strings';
import { EmptyViewProps } from '../../types/index';

const EmptyContentView: React.FC<EmptyViewProps> = ({ viewType }) => {
  const _getNotificationImage = () => (
    <LinearGradient
      style={styles.backgroundLinearView}
      useAngle={true}
      angle={180}
      colors={NOTIFICATION_GRADIENT}>
      <Image source={images.main.empty_notifications} />
    </LinearGradient>
  );

  const _getChatImage = () => (
    <LinearGradient
      style={styles.backgroundLinearView}
      useAngle={true}
      angle={180}
      colors={NOTIFICATION_GRADIENT}>
      <Image style={styles.imageStyles} source={images.main.no_chats} />
    </LinearGradient>
  );

  const _getImageForType = () => {
    switch (viewType) {
      case 'Notification':
        return _getNotificationImage();
      case 'ChatList':
        return _getChatImage();
    }
  };

  const _getTextForNotification = () => (
    <>
      <View style={styles.topMargin}>
        <Text style={styles.upperTextStyle}>{UP_TO_DATE}</Text>
      </View>
      <View>
        <Text style={styles.bottomTextStyle}>{NO_NEW_NOTIFICATIONS}</Text>
      </View>
    </>
  );

  const _getTextForChat = () => (
    <View style={styles.chatTextStyles}>
      <View style={styles.topMargin}>
        <Text style={styles.upperTextStyle}>{START_CHATTING}</Text>
      </View>
      <View>
        <Text style={styles.bottomTextStyle}>{FIRST_MESSAGE}</Text>
      </View>
    </View>
  );

  const _getTextForType = () => {
    switch (viewType) {
      case 'Notification':
        return _getTextForNotification();
      case 'ChatList':
        return _getTextForChat();
    }
  };

  return (
    <View style={styles.container}>
      {_getImageForType()}
      {_getTextForType()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMargin: {
    marginTop: SCREEN_HEIGHT * 0.025,
    paddingBottom: '5%',
  },
  upperTextStyle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: normalize(23),
    lineHeight: normalize(40),
  },
  chatTextStyles: {
    width: '85%',
  },
  bottomTextStyle: {
    textAlign: 'center',
    color: '#808080',
    fontWeight: '600',
    fontSize: normalize(20),
    lineHeight: normalize(30),
  },
  imageStyles: {
    width: SCREEN_WIDTH * 0.72,
    height: SCREEN_WIDTH * 0.72,
  },
  backgroundLinearView: {
    borderRadius: (SCREEN_WIDTH * 0.72) / 2,
  },
});

export default EmptyContentView;
