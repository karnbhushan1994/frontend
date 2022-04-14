import React from 'react';

import { View, StyleSheet } from 'react-native';

export const Divider = () => <View style={styles.content} />;
const styles = StyleSheet.create({
  content: {
    borderBottomColor: '#cccccc33',
    borderBottomWidth: 10,
  },
});
