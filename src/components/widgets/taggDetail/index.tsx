import React from 'react';

import { Image, ImageProps, Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-animatable';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { WidgetType } from 'types';

import { ButtonWithGradientBackground } from '../buttonWithGradientBackground';
import styles from './styles';

interface TaggDetailViewProps {
  modalButtonPress?: (payload: boolean) => void;
  onClose?: (payload: boolean) => void;
  visible?: boolean;
  logo?: ImageProps;
  available?: boolean;
  data?: WidgetType;
}

const TaggDetailView: React.FC<TaggDetailViewProps> = ({
  visible,
  modalButtonPress,
  logo,
  available,
  data,
  onClose,
}) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
    <View style={styles.modalWrapper}>
      <View style={styles.container}>
        {true && (
          <TouchableOpacity
            style={styles.closeIconWrapper}
            onPress={() => onClose && onClose(false)}>
            <SvgXml xml={icons.CloseOutline} height={40} width={40} color={'#000'} />
          </TouchableOpacity>
        )}
        <View>
          {
            <>
              <Text style={styles.title}>{data && data.title} Tagg</Text>
              <Text style={styles.subTitle}>{`Redirect people to your ${data?.title}`}</Text>
            </>
          }

          <View style={styles.imgWrapper}>
            {logo ? (
              <Image source={logo} style={styles.bottomImage} resizeMode={'contain'} />
            ) : null}
          </View>
        </View>
        <ButtonWithGradientBackground
          onPress={() => modalButtonPress && modalButtonPress(false)}
          title={'Add Tagg'}
          buttonStyles={styles.buttonStyles}
          // disabled
          // looked
          buttonStartIcon={images.main.Lock}
          disabled={!available}
        />
        {/* Disabled for now */}
        {/* {available ? (
          <View style={styles.bottomContainer}>
            <View style={styles.bottomContainerLeftChild}>
              <Text style={styles.bottomContainerTitle}>Unlock another version!</Text>
              <Text style={styles.bottomContainerSubTitle}>
                Build up your tagg points in order to unlock another version of this Tagg
              </Text>
            </View>
            <View style={styles.bottomContainerRightChild}>
              <Image source={images.main.profile_img} style={styles.bottomContainerImage} />
              <View style={styles.bottomContainerBottom}>
                <SvgXml xml={icons.Lock} width={20} />
                <View style={styles.width}>
                  <ProgressLiner completed={50} quantity={100} lightMode height={10} />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.warning}>
            You’ve run out of link taggs. Continue building your Tagg score to earn more links.
          </Text>
        )} */}
      </View>
    </View>
  </Modal>
);

export default TaggDetailView;
