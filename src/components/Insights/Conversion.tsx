import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

interface Conversion {
  clickConversion: string;
  clickThroughRate: string;
}

const ConversionInsight: React.FC<Conversion> = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Conversion</Text>
    <View style={styles.individualContainer}>
      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>Click Conversion</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{'50.5k'}</Text>
      </View>
    </View>
    <View style={styles.individualContainer}>
      <View style={styles.optionsTextContainer}>
        <Text style={styles.optionsText}>Click Through Rate</Text>
      </View>
      <View style={styles.optionsCount}>
        <Text style={styles.optionsCountText}>{'52%'}</Text>
      </View>
    </View>
  </View>
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
  individualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#212121',
  },
  individualImg: {
    width: 40,
    height: 40,
  },
});

export default ConversionInsight;
