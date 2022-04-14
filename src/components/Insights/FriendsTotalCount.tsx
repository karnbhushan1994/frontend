import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

interface FriendTotal {
  total: string;
}

const FriendsTotalCount: React.FC<FriendTotal> = ({ total }) => (
  <View style={styles.container}>
    <Text style={styles.total}>{total}</Text>
    <Text style={styles.totalText}>Friends Count</Text>
    <Text style={styles.totalSubText}>Number of friends accepted</Text>
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
});

export default FriendsTotalCount;
