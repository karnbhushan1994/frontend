import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dmAssets } from 'assets/discoverMoments';
import { NotificationBell } from 'components';
import { ScreenType } from 'types';

import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

const NoMoreMomentsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.notification, { top: isIPhoneX() ? insets.top + 5 : insets.top + 10 }]}>
        <NotificationBell screenType={ScreenType.DiscoverMoments} style={{}} />
      </View>
      <Image
        source={dmAssets.NoMoreMoments}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
      />
      <View style={styles.textView}>
        <Text style={styles.title}>{'Daily limit reached'}</Text>
        <Text style={styles.subTitle1}>
          {
            'The number of moments from other creators\nshown at a time is limited so you can explore their\nprofiles'
          }
        </Text>
        <Text style={styles.subTitle2}>{'🔔 We’ll notify you when there are more moments'}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    zIndex: 999,
    right: normalize(isIPhoneX() ? 15 : 10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textView: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: normalize(20),
    lineHeight: normalize(28),
    letterSpacing: normalize(0.5),
    marginBottom: '3%',
  },
  subTitle1: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(13),
    lineHeight: normalize(18),
    letterSpacing: normalize(0.5),
    marginBottom: '50%',
  },
  subTitle2: {
    color: '#fff',
    fontWeight: '700',
    fontSize: normalize(13),
    lineHeight: normalize(18),
  },
  mainView: { position: 'absolute', top: 100, zIndex: 1 },
});

export default NoMoreMomentsScreen;
