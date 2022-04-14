import React from 'react';

import { StyleSheet, Text, View, Image } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { images } from 'assets/images';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

export const HomeOffline = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.noInternet}>Discover Moments</Text>
    </View>
    <View style={styles.mainView}>
      <Image source={images.main.wifiImg} style={styles.wifiImg} />
      <Text style={styles.noInternet}>No internet connection</Text>
      <Text style={styles.tryagain}>Connect to internet and try again</Text>
      <TouchableOpacity style={styles.retry}>
        {/* // Click of retry not add bacause netinfo module listener automatically reconnect */}
        <Text style={styles.btnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  </View>
);
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000',
  },
  wifiImg: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternet: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  tryagain: {
    color: '#696969',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 15,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  retry: {
    backgroundColor: '#828282',
    padding: 8,
    borderRadius: 5,
    width: SCREEN_WIDTH / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
