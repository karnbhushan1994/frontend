import React from 'react';

import { BlurView } from '@react-native-community/blur';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Overview {
  overview: any;
}

const Overview: React.FC<Overview> = ({ overview }) => (
  <>
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsTextContainer}>
          <Text style={styles.optionsText}>Total lifetime clicks</Text>
        </View>
        <View style={styles.optionsCount}>
          <Text style={styles.optionsCountText}>{overview?.lifeTime}</Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsTextContainer}>
          <Text style={styles.optionsText}>Click through rate</Text>
        </View>
        <View style={styles.optionsCount}>
          <Text style={styles.optionsCountText}>{overview?.rate}</Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsTextContainer}>
          <Text style={styles.optionsText}>Time to click</Text>
        </View>
        <View style={styles.optionsCount}>
          <Text style={styles.optionsCountText}>{overview?.time}</Text>
        </View>
      </View>
    </View>
    {!overview.view ? (
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={7}
        reducedTransparencyFallbackColor="white">
        <Image source={require('../../assets/widgetIcons/Lock.png')} style={styles.lockIcon} />
        <Text style={styles.lockText}>
          Almost here 👀 Keep earning tagg points to unlock this insight!
        </Text>
      </BlurView>
    ) : null}
  </>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 21,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  optionsTextContainer: {
    flex: 1,
  },
  optionsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#828282',
  },
  optionsCount: {
    width: 60,
    height: 25,
    alignItems: 'flex-end',
  },
  optionsCountText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  lockIcon: {
    width: 55,
    height: 55,
  },
  lockText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
});

export default Overview;
