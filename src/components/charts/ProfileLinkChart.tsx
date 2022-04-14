import React from 'react';

import { BlurView } from '@react-native-community/blur';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { images } from 'assets/images';

const LockedContaier = () => (
  <TouchableOpacity onPress={() => {}} style={styles.lockButton}>
    <Image source={images.settings.lock} style={styles.lock} />
    <Text style={styles.lockText}>
      This insight is locked. Keep growing your Tagg score to unlock!
    </Text>
  </TouchableOpacity>
);

export const ProfileLinkChart = ({
  linkClicks,
  onPress,
  isLocked,
}: {
  linkClicks: any;
  onPress: any;
  isLocked: boolean;
}) => (
  <View>
    <View style={styles.lockContainer}>{isLocked && <LockedContaier />}</View>
    {isLocked && (
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
    )}
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>Profile Link</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.total}>{linkClicks.totalClicks}</Text>
        <Text style={styles.subTotal}>Total clicks</Text>
      </View>
      <View style={styles.tools}>
        <Text style={styles.topMoments}>Click Conversion</Text>
        <View style={styles.arrow}>
          <Text style={styles.topMoments}>{linkClicks.clickConversion}</Text>
          <SvgXml xml={icons.ArrowRight} width={18} height={18} />
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { marginHorizontal: 18, marginTop: 15 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 20 },
  tools: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  totalContainer: { marginVertical: 10 },
  topMoments: { fontSize: 15, fontWeight: '600', marginRight: 10 },
  total: { fontSize: 18, fontWeight: '700', color: '#333333' },
  subTotal: { fontSize: 13, fontWeight: '600', color: '#828282' },
  arrow: { width: 100, justifyContent: 'flex-end', flexDirection: 'row' },
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    alignSelf: 'center',
  },
  lockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '80%',
  },
  lock: {
    width: 80,
    height: 80,
    marginVertical: 16,
  },
  lockText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#828282',
    fontWeight: '600',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
