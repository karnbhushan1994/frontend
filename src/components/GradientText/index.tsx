import React from 'react';

import MaskedView from '@react-native-community/masked-view';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  colors: string[];
  [x: string]: any;
}

const GradientText = ({ colors, ...rest }: GradientTextProps) => (
  <MaskedView maskElement={<Text {...rest} />}>
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      <Text {...rest} style={[rest.style, { opacity: 0 // eslint-disable-line
          },
        ]}
      />
    </LinearGradient>
  </MaskedView>
);

export default GradientText;
