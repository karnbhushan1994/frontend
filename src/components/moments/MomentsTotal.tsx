import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { ProfileInsightsEnum } from 'types';

interface MomentTotal {
  total: number;
  rangeDay: ProfileInsightsEnum;
}

const MomentsTotal: React.FC<MomentTotal> = ({ total, rangeDay }) => (
  <View style={styles.container}>
    <Text style={styles.total}>{total}</Text>
    <Text style={styles.totalText}>Moment views</Text>
    <Text style={styles.totalSubText}>Over the last {rangeDay} day period</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginVertical: 7,
  },
  totalSubText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    marginTop: 8,
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

export default MomentsTotal;
