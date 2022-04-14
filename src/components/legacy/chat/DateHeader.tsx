import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { getFormatedDate, normalize } from 'utils';

interface DateHeaderProps {
  date: object;
}

const DateHeader: React.FC<DateHeaderProps> = ({ date }) => (
  <View style={styles.dateContainer}>
    <Text style={styles.dateHeader}>{getFormatedDate(date)}</Text>
  </View>
);

const styles = StyleSheet.create({
  dateHeader: {
    color: '#7A7A7A',
    fontWeight: '600',
    fontSize: normalize(11),
    textAlign: 'center',
    marginVertical: '5%',
  },
  dateContainer: { backgroundColor: 'transparent' },
});

export default DateHeader;
