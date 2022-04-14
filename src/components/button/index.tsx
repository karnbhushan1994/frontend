import * as React from 'react';

import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { normalize } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { BACKGROUND_GRADIENT_MAP, BUTTON_GRADIENT_STYLE, TAGG_PURPLE } from '../../constants';

interface ButtonProps {
  onPress?: () => void;
  title: string;
  GRADIENT_MAP?: number;
  applyGradient?: boolean;
  Icon?: NodeRequire | Object;
  style?: Object;
  gradientStyle?: Object;
  labelStyle?: Object;
  iconStyle?: Object;
  buttonStyle?: Object;
  disabled?: boolean;
}

const Button = ({
  onPress,
  title,
  style,
  iconStyle,
  GRADIENT_MAP,
  gradientStyle,
  labelStyle,
  applyGradient,
  Icon,
  buttonStyle,
  disabled,
}: ButtonProps): React.ReactElement => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.btn, style]}>
    {applyGradient ? (
      <LinearGradient
        style={[styles.gradientStyle, gradientStyle]}
        colors={BACKGROUND_GRADIENT_MAP[GRADIENT_MAP]}
        start={BUTTON_GRADIENT_STYLE.start}
        end={BUTTON_GRADIENT_STYLE.end}>
        <Text style={[styles.labelStyle, labelStyle]}>{title}</Text>
      </LinearGradient>
    ) : (
      <View style={styles.btnView}>
        {Icon && (
          <View style={styles.icon}>
            <Image source={Icon} style={[styles.img, iconStyle]} />
          </View>
        )}
        <View style={[styles.text, buttonStyle]}>
          <Text style={[styles.labelStyle, labelStyle]}>{title}</Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  btn: {
    height: 55,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
  },
  gradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {
    height: '100%',
    width: '100%',
    backgroundColor: TAGG_PURPLE,
    flexDirection: 'row',
    borderRadius: 6,
  },
  labelStyle: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: normalize(15),
  },
  img: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
  },
  text: {
    height: '100%',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Button;
