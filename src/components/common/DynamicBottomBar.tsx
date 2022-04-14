import React, { FC } from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isIPhoneX, MediaContentDisplayRatio, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

const DynamicBottomBar: FC<ViewProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return isIPhoneX() ? (
    <View style={[styles.iphoneXContainer, { marginBottom: insets.bottom }]}>{children}</View>
  ) : (
    <View style={styles.iphone8Container}>{children}</View>
  );
};

const styles = StyleSheet.create({
  iphoneXContainer: {
    height: SCREEN_HEIGHT - SCREEN_WIDTH / MediaContentDisplayRatio,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25,
    bottom: 0,
  },
  iphone8Container: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25,
    bottom: 30,
  },
});

export default DynamicBottomBar;
