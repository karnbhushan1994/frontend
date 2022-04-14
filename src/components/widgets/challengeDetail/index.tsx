import React from 'react';

import { Image, Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { images } from 'assets/images';

import { ButtonWithGradientBackground } from '../buttonWithGradientBackground';
import ProgressLiner from '../progressLiner';
import styles from './styles';

const logoWhite = images.main.logo_white;

const challengeDetail1 = images.taggsShop.challengeDetail1;
const challengeDetail2 = images.taggsShop.challengeDetail2;
const challengeDetail3 = images.taggsShop.challengeDetail3;
const challengeDetail4 = images.taggsShop.challengeDetail4;

interface ChallengeDetailViewProps {
  modalButtonPress?: (payload: boolean) => void;
  onClose?: (payload: boolean) => void;
  visible?: boolean;
  completed?: number;
  quantity?: number;
}

const ChallengeDetailView: React.FC<ChallengeDetailViewProps> = ({
  visible,
  modalButtonPress,
  completed,
  quantity,
  onClose,
}) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
    <View style={styles.modalWrapper}>
      <View style={styles.blocksWrapper}>
        <View style={styles.topBlock}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 1]}
            style={styles.linearGradient}
            colors={['#6EE7E7', '#8F01FF']}>
            <Image source={logoWhite} style={styles.topImage} />
            <TouchableOpacity style={styles.closeButton} onPress={() => onClose && onClose(false)}>
              <SvgXml xml={icons.CloseOutline} height={40} width={40} color={'white'} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View>
          <Text style={styles.title}>Moments Mania!</Text>
          <Text style={styles.info}>Post 4 moments a day for a week to earn more tagg points!</Text>
          <View style={styles.imagesWrapper}>
            <Image source={challengeDetail1} style={styles.bottomImage} />
            <Image source={challengeDetail2} style={styles.bottomImage} />
            <Image source={challengeDetail3} style={styles.bottomImage} />
            <Image source={challengeDetail4} style={styles.bottomImage} />
          </View>
          <View style={styles.progressBlock}>
            <View style={styles.linerWrapper}>
              <ProgressLiner
                completed={completed || 0}
                quantity={quantity || 0}
                height={12}
                lightMode
              />
            </View>
            <Text style={styles.quantity}>{`${completed}/${quantity}`}</Text>
          </View>
        </View>
        <ButtonWithGradientBackground
          onPress={() => modalButtonPress && modalButtonPress(false)}
          title={'Continue'}
          buttonStyles={styles.button}
        />
      </View>
    </View>
  </Modal>
);

export default ChallengeDetailView;
