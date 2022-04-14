import React from 'react';

import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { styles } from './styles';

interface SaveButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/*
 * Appears when a picture has been taken,
 * On click, saves the captured image to "Recents" album on device gallery
 */
export const SaveButton: React.FC<SaveButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.saveButton, style]}>
    <SvgXml xml={icons.Save} width={40} height={40} />
  </TouchableOpacity>
);

export default SaveButton;
