import React from 'react';

import moment from 'moment';
import { StyleSheet, Text } from 'react-native';

interface DateLabelProps {
  timestamp: string;
  type: 'default' | 'short' | 'small';
  decorate?: (date: string) => string;
}

const DateLabel: React.FC<DateLabelProps> = ({ timestamp, type, decorate = date => `${date}` }) => {
  let parsedDate = moment(timestamp);

  if (!parsedDate) {
    return <React.Fragment />;
  }

  switch (type) {
    case 'default':
      return (
        <Text style={styles.default}>{decorate(parsedDate.format('h:mm a • MMM D, YYYY'))}</Text>
      );

    case 'short':
      return <Text style={styles.default}>{decorate(parsedDate.format('MMM D'))}</Text>;

    case 'small':
      return <Text style={styles.smallAndBlue}>{decorate(parsedDate.format('MMM D'))}</Text>;
  }
};

const styles = StyleSheet.create({
  default: {
    fontSize: 15,
    color: '#c4c4c4',
  },
  smallAndBlue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8FA9C2',
  },
});

export default DateLabel;
