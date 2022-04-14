import { PROFILE_CUTOUT_TOP_Y } from '../../../constants';

import React, { useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { UniversityIcon } from 'profile';
import { UniversityIconProps } from 'profile/UniversityIcon';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { normalize } from 'utils';
import {images} from "assets/images";

interface BadgeTutorialProps {
  uniIconProps: UniversityIconProps;
  setShowBadgeTutorial: Function;
}

const BadgeTutorial: React.FC<BadgeTutorialProps> = ({ uniIconProps, setShowBadgeTutorial }) => {
  const [showModal, setShowModal] = useState(true);
  const { layout, university, university_class } = uniIconProps;

  const onTap = async () => {
    await AsyncStorage.setItem('hasSeenBadgeTutorial', 'true');
    setShowBadgeTutorial(false);
    setShowModal(false);
  };
  return (
    <Modal animationType="fade" transparent visible={showModal} presentationStyle="overFullScreen">
      <TouchableOpacity onPress={onTap} style={styles.viewWrapper}>
        <View style={styles.textContainerStyles}>
          <Text style={styles.textStyles}>Tap on the university icon to edit your badges!</Text>
        </View>
        <View
          style={{
            left: layout?.left,
            top: PROFILE_CUTOUT_TOP_Y * 1.02 - (layout?.top || 0),
            width: layout?.width,
            height: layout?.height,
          }}>
          <UniversityIcon
            {...{
              university,
              university_class,
              needsShadow: true,
            }}
          />
          <Image source={images.main.badgeTutorial} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
  },
  textContainerStyles: { top: '30%', width: '60%', alignSelf: 'center' },
  textStyles: {
    color: 'white',
    fontWeight: '700',
    fontSize: normalize(20),
    lineHeight: normalize(25),
    textAlign: 'center',
  },
});

export default BadgeTutorial;
