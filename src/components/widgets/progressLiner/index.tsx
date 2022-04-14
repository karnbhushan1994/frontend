import React, { FC } from 'react';

import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import logger from 'utils/logger';

import styles from './styles';

interface ProgressLinerProps {
  completed: number;
  quantity: number;
  height?: number;
  lightMode?: boolean;
  blackMode?: boolean;
}

const ProgressLiner: FC<ProgressLinerProps> = ({
  completed,
  quantity,
  height,
  lightMode,
  blackMode,
}) => {
  const heightStyle = {
    height,
  };

  const lineWidth = {
    width: `${100 - (completed / quantity) * 100}%`,
  };
  logger.log(lineWidth);
  const lightModeStyles = {
    backgroundColor: '#E0E0E0',
  };

  const blackModeStyles = {
    backgroundColor: '#000',
  };

  return (
    <View style={[styles.mainContainer, height ? heightStyle : {}]}>
      <View style={styles.gradientWrapper}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0.2, 1]}
          style={styles.linearGradient}
          colors={['#6EE7E7', '#8F01FF']}
        />
      </View>
      <View
        style={[
          styles.lineStyles,
          lineWidth,
          lightMode && lightModeStyles,
          blackMode && blackModeStyles,
        ]}
      />
    </View>
  );
};

export default ProgressLiner;
