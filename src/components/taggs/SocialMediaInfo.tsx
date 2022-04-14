import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { ScreenType } from 'types';
import { handleOpenSocialUrlOnBrowser } from 'utils';

import { SocialIcon } from '../common';

interface SocialMediaInfoProps {
  fullname: string;
  type: string;
  handle?: string;
}

const SocialMediaInfo: React.FC<SocialMediaInfoProps> = ({ fullname, type, handle }) => (
  <View style={styles.container}>
    {handle && type !== 'Facebook' ? (
      <Text
        style={styles.handle}
        onPress={() => {
          handleOpenSocialUrlOnBrowser(handle, type);
        }}>
        {' '}
        @{handle}{' '}
      </Text>
    ) : (
      <></>
    )}
    <View style={styles.row}>
      <View />
      <SocialIcon style={styles.icon} social={type} screenType={ScreenType.Profile} />
      <Text
        style={styles.name}
        onPress={() => {
          handleOpenSocialUrlOnBrowser(handle, type);
        }}>
        {fullname}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  handle: {
    color: 'white',
    fontSize: 12,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 5,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default SocialMediaInfo;
