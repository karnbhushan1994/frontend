import React, { Dispatch, SetStateAction } from 'react';

import { TouchableOpacity } from 'react-native';
import { CameraType } from 'react-native-camera';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { styles } from './styles';

interface FlipButtonProps {
  setCameraType: Dispatch<SetStateAction<keyof CameraType>>;
  cameraType: keyof CameraType;
}

/*
 * Toggles between back camera and front camera
 * Appears only when user has not taken a picture yet
 * Once user takes a picture, this button disappears to reveal the save button
 */
export const FlipButton: React.FC<FlipButtonProps> = ({ setCameraType, cameraType }) => (
  <TouchableOpacity
    onPress={() => setCameraType(cameraType === 'front' ? 'back' : 'front')}
    style={styles.saveButton}>
    <SvgXml xml={icons.Flip} width={40} height={40} />
  </TouchableOpacity>
);

export default FlipButton;
