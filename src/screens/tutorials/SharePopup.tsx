import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { human, systemWeights } from 'react-native-typography';

import { useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { main } from 'assets/images/main';
import ShareProfileDrawer from 'components/widgets/ShareProfileDrawer';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { normalize, SCREEN_WIDTH, track } from 'utils';

interface SharePopups {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}
const SharePopup: React.FC<SharePopups> = ({ setVisible }) => {
  const [shareProfile, setShareProfile] = useState<boolean>(false);
  const { username } = useSelector((state: RootState) => state.user.user);
  const handleDismiss = () => {
    setVisible(false);
  };
  const onShare = () => {
    setVisible(false);
    setShareProfile(true);
    track('ShareProfilePopUp', AnalyticVerb.Pressed, AnalyticCategory.Profile);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={false}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <TouchableOpacity style={styles.centeredView} onPress={handleDismiss}>
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            <View style={styles.closeButton}>
              <Pressable onPress={handleDismiss}>
                <SvgXml xml={icons.CloseOutline} height={30} width={30} color={'black'} />
              </Pressable>
            </View>
            <View>
              <Image source={main.confetti} style={styles.mainImage} />
            </View>
            <View>
              <Text style={styles.modalHeader}>Share Profile</Text>
            </View>
            <View>
              <Text style={styles.modalDescription}>
                It would be pretty fucking crazy to let such creativity go unseen! 🥴
              </Text>
            </View>
            <View>
              <Pressable style={[styles.buttonmodal, styles.buttonClose]} onPress={onShare}>
                <Text style={styles.textStyleClose}>Share</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {!!shareProfile && (
        <ShareProfileDrawer isOpen={shareProfile} setIsOpen={setShareProfile} username={username} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    textAlign: 'center',
  },
  gradientStyle: {
    borderRadius: normalize(5),
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  //modal css
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonmodal: {
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    width: SCREEN_WIDTH / 2.5,
    marginTop: 20,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#618CD9',
  },
  textStyleClose: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tierIcon: {
    backgroundColor: '#F2F2F2',
    padding: 20,
    borderRadius: 50,
  },
  modalHeader: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 25,
  },
  modalDescription: {
    color: '#505050',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    maxWidth: SCREEN_WIDTH / 1.5,
  },
  tagScorePoint: {
    color: '#618CD9',
    textAlign: 'center',
    fontSize: 16,
    padding: 30,
  },
  mainImage: {
    height: 100,
    width: 270,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
export default SharePopup;
