import * as React from 'react';

import { Modal, TouchableOpacity, Text, TextStyle, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import SimpleButton from 'components/widgets/SimpleButton';
import { normalize } from 'utils';

import { styles } from './styles';

interface ModalProps {
  visible?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  setVisible?: Function;
  message: string;
  description: string;
  buttonTitle: string;
  icon: React.ReactElement;
  messageStyle: TextStyle;
  isDisable: boolean;
}

const LockedModal = ({
  visible,
  onPress,
  onClose,
  setVisible,
  message = '',
  buttonTitle = '',
  icon,
  description = '',
  messageStyle,
  isDisable,
}: ModalProps): React.ReactElement => {
  const { container, content, lockIconContainer, XIconContainer, lockText, buttonContainer } =
    styles;

  const close = () => {
    onClose && onClose();
    setVisible && setVisible(false);
  };

  const onOpen = () => {
    onPress && onPress();
    close();
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
            {icon ? (
              icon
            ) : (
              <SvgXml xml={icons.BlackLock} height={normalize(80)} width={normalize(80)} />
            )}
            <Text style={[lockText, messageStyle]}>
              {message
                ? message
                : 'This feature is locked. Keep growing your Tagg score to unlock!'}
            </Text>
            {description !== '' && <Text style={styles.description}>{description}</Text>}
          </View>
          <SimpleButton
            title={buttonTitle ? buttonTitle : 'Continue'}
            onPress={onOpen}
            containerStyles={buttonContainer}
            disabled={isDisable}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LockedModal;
