import React, { Dispatch, SetStateAction } from 'react';

import { BlurView } from '@react-native-community/blur';
import { Text, TouchableOpacity, View } from 'react-native';
import { FlashMode } from 'react-native-camera';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { track } from 'utils';

import { styles } from './styles';

interface FlashButtonProps {
  flashMode: keyof FlashMode;
  setFlashMode: Dispatch<SetStateAction<keyof FlashMode>>;
}

/*
 * Toggles between flash on/off modes
 */
export const FlashButton: React.FC<FlashButtonProps> = ({ flashMode, setFlashMode }) => (
  <>
    <BlurView blurType={'ultraThinMaterialDark'} blurAmount={1} style={styles.blurView} />
    <TouchableOpacity
      onPress={() => {
        const newState = flashMode === 'on' ? 'off' : 'on';
        track('ToggleFlash', AnalyticVerb.Pressed, AnalyticCategory.Camera, {
          newState,
        });
        setFlashMode(newState);
      }}
      style={styles.flashButtonContainerBackground}>
      <View
        style={[
          styles.flashButtonContainer,
          // eslint-disable-next-line react-native/no-inline-styles
          { opacity: flashMode === 'off' ? 0.5 : 1 },
        ]}>
        {flashMode === 'off' ? (
          <SvgXml xml={icons.FlashOff} height={30} width={20} color={'white'} />
        ) : (
          <SvgXml xml={icons.FlashOn} height={30} width={20} color={'white'} />
        )}
        <Text style={styles.saveButtonLabel}>Flash</Text>
      </View>
    </TouchableOpacity>
  </>
);

export default FlashButton;
