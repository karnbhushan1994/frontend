import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { ProfileInsightsEnum } from 'types';

interface FriendTotal {
  total: number;
  insights: ProfileInsightsEnum;
}

const ProfileViewTotal: React.FC<FriendTotal> = ({ total, insights }) => (
  <View style={styles.container}>
    <Text style={styles.total}>{total}</Text>
    <Text style={styles.totalText}>Profile views</Text>
    <Text style={styles.totalSubText}>Over the last {insights} days</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
});

export default ProfileViewTotal;
