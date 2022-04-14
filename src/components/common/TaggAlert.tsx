import { TAGG_LIGHT_BLUE } from 'constants';

import React, { useEffect } from 'react';

import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaggAlertProps {
  title: string;
  subheading: string;
  acceptButtonText: string;
  alertVisible: boolean;
  setAlertVisible: (value: boolean) => void;
  handleAccept: () => void;
}

const TaggAlert: React.FC<TaggAlertProps> = ({
  title,
  subheading,
  acceptButtonText,
  alertVisible,
  setAlertVisible,
  handleAccept,
}) => {
  // initialize position to middle of screen in case measure fails
  const modalOpacity = React.useRef(new Animated.Value(0)).current;

  const showAlert = () =>
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

  const hideAlert = () =>
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();

  useEffect(() => {
    if (alertVisible) {
      showAlert();
    } else {
      hideAlert();
    }
  }, [alertVisible]);

  return (
    <Modal visible={alertVisible} transparent>
      <TouchableOpacity onPressOut={() => setAlertVisible(false)} style={styles.container}>
        <TouchableOpacity activeOpacity={1} style={styles.modalWrapper}>
          <Animated.View style={[styles.modal, { opacity: modalOpacity }]}>
            <View style={styles.infoBlock}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subTitle}>{subheading}</Text>
            </View>
            <View style={styles.buttonsBlock}>
              <TouchableOpacity style={[styles.button, styles.leftButton]} onPress={handleAccept}>
                <Text style={styles.delete}>{acceptButtonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAlertVisible(false)} style={styles.button}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.modalBG} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  horizontalPadding: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  modalWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalBG: {
    backgroundColor: '#000',
    opacity: 0.4,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modal: {
    position: 'absolute',
    width: '80%',
    zIndex: 1,
    opacity: 0,
  },
  infoBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 22,
    marginBottom: 4,
    borderRadius: 5,
    minHeight: 138,
  },
  buttonsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    minHeight: 45,
  },
  leftButton: {
    marginRight: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: '90%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: '86%',
    alignSelf: 'center',
    marginBottom: 8,
    color: '#989898',
  },
  delete: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: '#EE1D51',
  },
  cancel: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: TAGG_LIGHT_BLUE,
  },

  marginBottom: { marginBottom: 25 },
});

export default TaggAlert;
