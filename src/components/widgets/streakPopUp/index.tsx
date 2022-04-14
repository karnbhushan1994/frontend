import React from 'react';

import { Image, Modal, View } from 'react-native';
import { Text } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { RED_TOAST } from '../../../constants';

import styles from './styles';

const modalIcon = require('assets/taggsShop/modalIcon.png');

interface StreakPopUpProps {
  streakCount?: number;
  modalButtonPress?: (payload: boolean) => void;
  visible?: boolean;
}

const StreakPopUp: React.FC<StreakPopUpProps> = ({ streakCount, visible, modalButtonPress }) => (
  <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => {}}>
    <View style={styles.modalWrapper}>
      <View style={styles.modalCenterView}>
        <View style={styles.modalAbsoluteView}>
          <View style={styles.iconContainer}>
            <View>
              <Image source={modalIcon} style={styles.modalIcon} />
            </View>
            <View style={styles.modalStreakCountWrapper}>
              <Text style={{ color: RED_TOAST }}>{streakCount}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.modalTitleWrapper}>Challenge Streak</Text>
        <Text style={styles.modalInfo}>
          Your challenge streak is <Text style={styles.streakCountText}>{streakCount} days.</Text>{' '}
          This will increase everyday you participate in a challenge
        </Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => modalButtonPress && modalButtonPress(false)}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default StreakPopUp;
