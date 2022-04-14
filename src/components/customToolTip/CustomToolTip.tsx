import React from 'react';

import { Text, View } from 'react-native';

import { styles } from './styles';

interface CustomToolTipProps {
  toolTipText: string;
}

export const CustomToolTip: React.FC<CustomToolTipProps> = ({
  toolTipText,
}: CustomToolTipProps): React.ReactElement => (
  <View style={styles.mainContainer}>
    <View style={styles.tipView} />
    <View style={styles.textContainer}>
      <Text style={styles.toolTipTextStyle}>{toolTipText}</Text>
    </View>
  </View>
);

export default CustomToolTip;
