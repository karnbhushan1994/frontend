import * as React from 'react';

import {
  Modal,
  TouchableOpacity,
  Text,
  TextStyle,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { taggsShop } from 'assets/taggsShop';
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
}

const TaggBGModal = ({
  visible,
  onPress,
  onClose,
  setVisible,
  messageStyle,
  disabled,
  loader,
}: ModalProps): React.ReactElement => {
  const { container, content, lockIconContainer, XIconContainer, lockText, image } = styles;

  const close = () => {
    onClose && onClose();
    setVisible && setVisible(false);
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
            <Image source={taggsShop.popupBG} style={image} />
            <Text style={[lockText, messageStyle]}>{'Tagg Image Background'}</Text>
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
                  <Text style={styles.title}>{'20'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaggBGModal;
