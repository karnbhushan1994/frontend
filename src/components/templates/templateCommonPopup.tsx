import React, { FC, useContext } from 'react';

// import { useNavigation } from '@react-navigation/native';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { human, systemWeights } from 'react-native-typography';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { ProfileContext } from 'screens/profile/ProfileScreen';
// import { ProfileContext } from 'screens/profile/ProfileScreen';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { normalize, SCREEN_WIDTH, track } from 'utils';

interface CommonPopup {
  level: string;
  taggScore: any;
  description: string;
  title: string;
}
const CommonPopups: FC<CommonPopup> = ({ taggScore, description, title }) => {
  // const navigation = useNavigation();
  // const { ownProfile } = useContext(ProfileContext);
  const { ownProfile } = useContext(ProfileContext);
  const [gemModalVisible, setGemModalVisible] = React.useState<boolean>(false);
  return (
    <View>
      <Pressable
        onPress={() => {
          if (ownProfile) {
            track('UserATierIcon', AnalyticVerb.Pressed, AnalyticCategory.Profile);
          } else {
            track('UserBTierIcon', AnalyticVerb.Pressed, AnalyticCategory.Profile);
          }
          setGemModalVisible(true);
        }}>
        <SvgXml xml={icons.Tier1Outlined} width={15} height={15} />
      </Pressable>
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={gemModalVisible}
          onRequestClose={() => {
            // console.log('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => setGemModalVisible(!gemModalVisible)}>
            <View style={styles.modalView} onStartShouldSetResponder={() => true}>
              <View style={styles.tierIcon}>
                <SvgXml xml={icons.Tier1Outlined} width={50} height={50} />
              </View>
              <View>
                <Text style={styles.modalHeader}>{title}</Text>
              </View>
              <View>
                <Text style={styles.modalDescription}>{description}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.tagScorePoint}>Tagg Coin: {taggScore}</Text>
                <Image source={images.main.score_coin} style={styles.coin} />
              </View>
              <View>
                <Pressable
                  style={[styles.buttonmodal, styles.buttonClose]}
                  onPress={() => setGemModalVisible(!gemModalVisible)}>
                  <Text style={styles.textStyleClose}>Close</Text>
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
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
    borderRadius: 20,
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
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    width: SCREEN_WIDTH / 1.5,
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
    marginTop: -80,
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
    marginVertical: 30,
  },
  coin: {
    width: 22,
    height: 22,
    bottom: -1,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommonPopups;
