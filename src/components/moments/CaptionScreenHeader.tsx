import React from 'react';

import { Text, View, StyleSheet, ViewProps } from 'react-native';

import { normalize } from 'utils';

interface CaptionScreenHeaderProps extends ViewProps {
  title: string;
}
const CaptionScreenHeader: React.FC<CaptionScreenHeaderProps> = ({ title, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{title}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: '90%',
  },
  header: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});
export default CaptionScreenHeader;
