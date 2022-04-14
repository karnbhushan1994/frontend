import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SCREEN_WIDTH, normalize} from '../../../utils';

interface BadgeHeaderProps {
  title: String;
}

const BadgeListHeader: React.FC<BadgeHeaderProps> = ({title}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: SCREEN_WIDTH * 0.75,
    marginHorizontal: SCREEN_WIDTH * 0.125,
    marginBottom: '2%',
    marginTop: '4%',
  },
  header: {
    fontSize: normalize(20),
    fontWeight: '700',
    lineHeight: normalize(23.87),
    color: '#fff',
    textAlign: 'center',
  },
});

export default BadgeListHeader;
