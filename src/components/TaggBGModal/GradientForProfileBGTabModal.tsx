import * as React from 'react';

import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { normalize } from 'utils';

import { styles } from './styles';

interface ModalProps {
  visible?: boolean;
  disabled?: boolean;
  loader?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  setVisible?: Function;
  message: string;
  buttonTitle: string;
  messageStyle: TextStyle;
  type: string;
}

const GradientForProfileBGTabModal = ({
  visible,
  onPress,
  onClose,
  setVisible,
  messageStyle,
  disabled,
  loader,
  type,
}: ModalProps): React.ReactElement => {
  const { container, content, lockIconContainer, XIconContainer, lockText, image } = styles;

  const close = () => {
    onClose && onClose();
    setVisible && setVisible(false);
  };
  const config: any = {
    BG: {
      unlockTitle: 'Profile Gradient',
      lockTitle: 'Gradient Background',
      image: images.main.gradient_background,
    },
    Tab: {
      unlockTitle: 'Tab Gradient',
      lockTitle: 'Gradient Tabs',
      image: images.main.gradient_tab,
    },
  };
  return (
    <Modal visible={visible} animationType={'fade'} transparent>
      <View style={container}>
        <View style={content}>
          <TouchableOpacity activeOpacity={0.5} onPress={close} style={XIconContainer}>
            <SvgXml
              xml={icons.CloseOutline}
              color={'black'}
              height={normalize(30)}
              width={normalize(30)}
            />
          </TouchableOpacity>
          <View style={lockIconContainer}>
            <Image source={config[type].image} style={image} />
            <Text style={[lockText, messageStyle]}>
              {disabled ? config[type].lockTitle : config[type].unlockTitle}
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              disabled={disabled}
              style={[styles.buttonContainer, disabled && styles.disabled]}
              onPress={onPress}>
              {loader ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Text style={styles.title}>{'Unlock'}</Text>
                  <Image source={images.main.score_coin} style={styles.iconImage} />
                  <Text style={styles.title}>{'25'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GradientForProfileBGTabModal;
