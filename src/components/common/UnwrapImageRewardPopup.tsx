import React, { Dispatch, SetStateAction, useState } from 'react';

import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { images } from 'assets/images';

import { images as rewardImages } from 'assets/rewards';

import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';

import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface UnwrapImageRewardPopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}
// let dynamicPopupData = [
//   {
//     btn: 'Unwrap',
//     image: rewardImages.PresentGIF,
//     mainHeading: 'You Did that!',
//     subHeading: 'open your present',
//   },
//   {
//     btn: 'Continue',
//     image: rewardImages.instagramtaggimg,
//     mainHeading: 'Background',
//     subHeading: 'Add some flavor to your taggs with your own background!',
//   },
//   {
//     btn: 'Done',
//     image: rewardImages.unlockimage,
//     mainHeading: 'Check it out',
//     subHeading: 'Edit a tagg to try it out!',
//   },
// ];
let dynamicPopupData = [
  {
    btn: 'Unwrap',
    image: rewardImages.PresentGIF,
    mainHeading: 'You Did that!',
    subHeading: 'open your present',
  },
  {
    btn: 'Continue',
    image: images.main.fontpopup,
    mainHeading: 'Font Color',
    subHeading:
      'Did someone say aesthetic? 😋 Change the color of your font on taggs for more uniqueness!',
  },
  {
    btn: 'Done',
    image: rewardImages.unlockimage,
    mainHeading: 'Check it out',
    subHeading: 'Edit a tagg to try it out!',
  },
];
let count = 0;
const UnwrapImageRewardPopup: React.FC<UnwrapImageRewardPopupProps> = ({ visible, setVisible }) => {
  const [mainBtnText, setmainBtnText] = useState<string>('Unwrap');
  const [mainHeadingText, setmainHeadingText] = useState<string>('You Did that!');
  const [subHeadingText, setsubText] = useState<string>('open your present');
  const [rewardImage, setrewardImage] = useState<string>(rewardImages.PresentGIF);
  const handleDismiss = () => {
    setVisible(false);
    setmainBtnText(dynamicPopupData[0].btn);
    setmainHeadingText(dynamicPopupData[0].mainHeading);
    setsubText(dynamicPopupData[0].subHeading);
    setrewardImage(dynamicPopupData[0].image);
    count = 0;
  };

  const handleUnwrap = () => {
    count++;
    if (count == 1) {
      setmainBtnText(dynamicPopupData[1].btn);
      setmainHeadingText(dynamicPopupData[1].mainHeading);
      setsubText(dynamicPopupData[1].subHeading);
      setrewardImage(dynamicPopupData[1].image);
    }
    // if (count == 2) {
    //   setmainBtnText(dynamicPopupData[2].btn);
    //   setmainHeadingText(dynamicPopupData[2].mainHeading);
    //   setsubText(dynamicPopupData[2].subHeading);
    //   setrewardImage(dynamicPopupData[2].image);
    // }
    if (count == 2) {
      setmainBtnText(dynamicPopupData[0].btn);
      setmainHeadingText(dynamicPopupData[0].mainHeading);
      setsubText(dynamicPopupData[0].subHeading);
      setrewardImage(dynamicPopupData[0].image);
      count = 0;
      setVisible(false);
    }
  };
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          //console.log('Modal has been closed.');
        }}>
        <TouchableOpacity style={styles.centeredView} onPress={handleDismiss}>
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            <View>
              <Text style={styles.modalHeader}>{mainHeadingText}</Text>
            </View>
            <View>
              <Text style={styles.modalDescription}>{subHeadingText}</Text>
            </View>
            <View style={styles.mainAssetsContainer}>
              {count == 0 && <SvgXml xml={rewardImages.Confetti} width={SCREEN_WIDTH} style={{}} />}
              {count == 1 && <SvgXml xml={rewardImages.Confetti} width={SCREEN_WIDTH} style={{}} />}
              <View style={styles.imageContainer}>
                {count == 0 && (
                  <Image resizeMode={'cover'} style={styles.image} source={rewardImage} />
                )}
                {count == 1 && (
                  <Image resizeMode={'cover'} style={styles.image1} source={rewardImage} />
                )}
                {count == 2 && (
                  <Image resizeMode={'cover'} style={styles.image2} source={rewardImage} />
                )}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <ButtonWithGradientBackground
                onPress={handleUnwrap}
                title={mainBtnText}
                buttonStyles={styles.buttonStyles}
                buttonTextStyles={styles.buttonTextStyles}
                //buttonStartIcon={images.main.Lock}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  //modal css
  centeredView: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    //margin: 20,
    backgroundColor: 'white',
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
  modalHeader: {
    color: '#8F27F1',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    marginTop: 25,
  },
  modalDescription: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: '600',
  },
  closeButton: {
    padding: 20,
    width: SCREEN_WIDTH,
    marginTop: 20,
  },
  mainAssetsContainer: {
    height: SCREEN_HEIGHT * 0.3,
    top: '10%',
    zIndex: -1,
  },
  imageContainer: {
    position: 'absolute',
    top: -50,
    height: 350,
    width: 350,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    height: 350,
    width: 350,
    resizeMode: 'contain',
  },
  image1: {
    position: 'absolute',
    top: 70,
    //left: 50,
    height: 250,
    width: 350,
    resizeMode: 'contain',
  },
  image2: {
    position: 'absolute',
    top: 0,
    height: 250,
    width: 350,
    resizeMode: 'contain',
  },
  buttonContainer: { bottom: isIPhoneX() ? '20%' : '18%', position: 'absolute' },
  buttonStyles: {
    width: 300,
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonTextStyles: {
    fontWeight: '700',
    fontSize: normalize(18),
    lineHeight: normalize(25),
    color: 'white',
  },
});
export default UnwrapImageRewardPopup;
