import React, { useState } from 'react';

import {
  Modal,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  ViewProps,
} from 'react-native';

import { RadioCheckbox, CenteredView, OverlayView } from '../common';
import TermsAndConditionsText from './TermsAndConditionsText';

interface TermsConditionsProps extends ViewProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}
const TermsConditions: React.FC<TermsConditionsProps> = props => {
  // boolean representing if modal is visible
  const [modalVisible, setModalVisible] = useState(false);
  // destructure props
  const { accepted, onChange } = props;
  /**
   * Hides the modal.
   */
  const hideModal = (): void => {
    if (modalVisible) {
      setModalVisible(false);
    }
  };
  /**
   * Sets `accepted` to `true` and hides the modal.
   */
  const handleAccept = (): void => {
    onChange(true);
    hideModal();
  };
  /**
   * Toggles the value of `accepted`.
   */
  const toggleAccepted = (): void => {
    onChange(!accepted);
  };

  return (
    <View {...props}>
      <View style={styles.body}>
        <RadioCheckbox checked={accepted} onPress={toggleAccepted} />
        <View style={styles.bodyPrompt}>
          <Text style={styles.bodyPromptText}>Accept </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.bodyPromptText, styles.bodyPromptTextUnderline]}>
              Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <OverlayView>
          <CenteredView>
            <View style={styles.modalView}>
              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollViewContent}>
                <Text style={styles.tcHeader}>
                  End User License Agreement (EULA) & Terms of Service
                </Text>
                <TermsAndConditionsText />
              </ScrollView>
              <View style={styles.modalActions}>
                <Button title="Accept" onPress={handleAccept} />
                <View style={styles.modalActionsDivider} />
                <Button title="Close" onPress={hideModal} />
              </View>
            </View>
          </CenteredView>
        </OverlayView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyPrompt: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  bodyPromptText: {
    fontSize: 16,
    color: '#fff',
  },
  bodyPromptTextUnderline: {
    textDecorationLine: 'underline',
  },
  modalView: {
    width: '85%',
    height: '55%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderRadius: 8,
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalScrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    marginBottom: 10,
  },
  tcHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  modalActionsDivider: {
    height: '60%',
    backgroundColor: '#0160Ca',
    width: 1,
  },
});

export default TermsConditions;
