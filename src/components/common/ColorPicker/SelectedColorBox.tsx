import React, { useEffect, useState } from 'react';

import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';

import { TAGG_LIGHT_GREY_3, TAGG_LIGHT_GREY_2, HEX_COLOR } from '../../../constants';
import { normalize } from '../../../utils';

interface SelectedColorBoxProps {
  color: string;
  containerStyle?: ViewStyle;
  setSelectedColor: Function;
}

const SelectedColorBox: React.FC<SelectedColorBoxProps> = ({
  color,
  containerStyle,
  setSelectedColor,
}) => {
  const [value, setValue] = useState(color);
  const [isValidHex, setIsValidHex] = useState(true);
  const handleChange = (val: any) => {
    if (val.startsWith('#')) {
      setValue(val);
    } else {
      setValue('#' + val);
    }
  };
  const validate = () => {
    if (!isValidHex) {
      setSelectedColor(color);
      setValue(color);
    } else {
      setSelectedColor(value);
    }
  };

  useEffect(() => {
    if (value.trim().match(HEX_COLOR)) {
      setIsValidHex(true);
    } else {
      setIsValidHex(false);
    }
  }, [value]);

  useEffect(() => {
    setValue(color);
  }, [color]);

  return (
    <View style={[styles.selectedColorBoxContainer, containerStyle]}>
      <TextInput
        onChangeText={handleChange}
        value={value.toUpperCase()}
        style={styles.selectedColorBoxText}
        onBlur={validate}
      />
      {isValidHex && <View style={[styles.selectedColorBoxColor, { backgroundColor: value }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedColorBoxContainer: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(11),
    borderColor: TAGG_LIGHT_GREY_3,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedColorBoxText: {
    fontWeight: '600',
    fontSize: normalize(15),
    lineHeight: normalize(17.9),
    letterSpacing: normalize(0.03),
    color: TAGG_LIGHT_GREY_2,
    flex: 1,
  },
  selectedColorBoxColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    paddingRight: 16,
  },
});

export default SelectedColorBox;
