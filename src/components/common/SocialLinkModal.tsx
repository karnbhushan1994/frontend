import React from 'react';

import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { AnalyticCategory, AnalyticVerb, ScreenType } from 'types';
import { normalize, SCREEN_WIDTH, track } from 'utils';

import CenteredView from './CenteredView';
import SocialIcon from './SocialIcon';
import TaggSquareButton from './TaggSquareButton';

interface SocialLinkModalProps {
  social: string;
  modalVisible: boolean;
  setModalVisible: (_: boolean) => void;
  completionCallback: (username: string) => void;
}

const SocialLinkModal: React.FC<SocialLinkModalProps> = ({
  social,
  modalVisible,
  setModalVisible,
  completionCallback,
}) => {
  const [username, setUsername] = React.useState('');

  const onClosePress = () => {
    track('LinkNonIntegratedSocialModal', AnalyticVerb.Closed, AnalyticCategory.Profile, {
      social,
    });
    setModalVisible(false);
  };

  const onSubmit = () => {
    if (username !== '') {
      setModalVisible(!modalVisible);
      setUsername('');
      completionCallback(username);
    }
  };

  return (
    <CenteredView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <CenteredView>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
              <SvgXml xml={icons.CloseOutline} height={'100%'} width={'100%'} color={'grey'} />
            </TouchableOpacity>
            <SocialIcon style={styles.icon} social={social} screenType={ScreenType.Profile} />
            <Text style={styles.titleLabel}>{social}</Text>
            <Text style={styles.descriptionLabel}>
              Insert your {social.toLowerCase()} username to link your {social.toLowerCase()}{' '}
              account to your profile!
            </Text>
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholder={'Username'}
              style={styles.textInput}
              onChangeText={setUsername}
              selectionColor={'grey'}
              value={username}
            />
            <TaggSquareButton
              title={'Submit'}
              onPress={onSubmit}
              buttonStyle={'gradient'}
              buttonColor={'white'}
              labelColor={'white'}
            />
          </View>
        </CenteredView>
      </Modal>
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: '10%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    marginTop: '8%',
    width: '85%',
    paddingBottom: '2%',
    borderBottomWidth: 0.4,
    borderBottomColor: '#C4C4C4',
    fontSize: normalize(20),
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    height: normalize(20),
    width: normalize(20),
    left: '5%',
    top: '5%',
  },
  icon: {
    top: -(normalize(70) / 3),
    height: normalize(70),
    width: normalize(70),
    borderRadius: 30,
    position: 'absolute',
  },
  titleLabel: {
    marginTop: '8%',
    fontSize: normalize(17),
    fontWeight: '600',
    lineHeight: 20,
  },
  descriptionLabel: {
    width: SCREEN_WIDTH * 0.7,
    marginTop: '3%',
    fontSize: normalize(11),
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
    color: '#828282',
  },
});

export default SocialLinkModal;
