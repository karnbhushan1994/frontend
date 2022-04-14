import React, { useEffect, useRef, useState } from 'react';

import LottieView from 'lottie-react-native';
import { Animated, Image, PanResponder, Pressable, Text } from 'react-native';
import { View } from 'react-native-animatable';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch } from 'react-redux';

import { tutorialGIFs } from 'assets/profileTutorialVideos';
import { makeAction } from 'makeAction';
import { Banner } from 'types';
import { validateImageLink } from 'utils';

import { images } from '../../assets/images';

import { styles } from './styles';

interface BannerProps {
  actionText?: string;
  point?: string;
  bannerImg?: any;
  show?: boolean;
  onPress?: () => void;
}

const BannerComponent = ({
  show,
  actionText,
  // point,
  bannerImg,
}: BannerProps): React.ReactElement => {
  const dispatch = useDispatch();
  const [showBanner, setShowBanner] = useState<boolean>(false);
  // const [animateBanner, setanimateBanner] = useState<string>('');
  const [validImage, setValidImage] = React.useState<boolean>(true);

  const closeBanner = (gestureState: any) => {
    const y = gestureState && gestureState.dy ? gestureState.dy - 100 : -150;
    Animated.spring(pan, {
      toValue: { x: 0, y },
      useNativeDriver: true,
    }).start();
  };
  React.useEffect(() => {
    checkAvatar(bannerImg.uri);
  }, [bannerImg.uri]);
  const checkAvatar = async (url: string | undefined) => {
    const valid = await validateImageLink(url);
    if (valid !== validImage) {
      setValidImage(valid);
    }
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        // console.log(gestureState.dy);
        if (gestureState.dy < -40) {
          console.log('go up');
          closeBanner(gestureState);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        closeBanner(gestureState);
      },
    }),
  ).current;

  const opacity = pan.y.interpolate({
    inputRange: [0, 34, 40],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (show) {
      pan.setValue({ x: 0, y: 0 });
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactLight', options);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        closeBanner(null);
        dispatch(makeAction(Banner.EMPTY, ''));
      }, 3000);
    }
  }, [show]);

  const {
    bannerContainer,
    bannerContent,
    bannerImage,
    userAvatar,
    bannerTextContainer,
    bannerText,
    bannerPoint,
    lottieset,
    // bannerPointText,
  } = styles;
  return (
    <>
      {showBanner && (
        <Animated.View //animation={animateBanner}
          {...panResponder.panHandlers}
          style={[bannerContainer, { transform: [{ translateY: pan.y }], opacity }]}>
          <Pressable
            onPress={() => {
              closeBanner(null);
              console.log('tapOnBanner');
            }}
            style={bannerContent}>
            <View style={bannerContent}>
              {/* <View style={bannerImage}>
              {bannerImg.uri === 'https://tagg-dev.s3.us-east-2.amazonaws.com/smallProfilePicture/spp-f9f80416-a20d-4085-b8f7-6378d683e895.jpeg' ? (
                 <Image style={userAvatar} source={images.main.profile_default} />
                ) :  <Image source={bannerImg} style={userAvatar} />}
              </View> */}
              <View style={bannerImage}>
                {validImage !== true ? (
                  <Image style={userAvatar} source={images.main.profile_default} />
                ) : (
                  <Image source={bannerImg} style={userAvatar} />
                )}
              </View>
              <View style={bannerTextContainer}>
                <Text style={bannerText}>{actionText}</Text>
              </View>
              <View style={bannerPoint}>
                <LottieView style={lottieset} source={tutorialGIFs.coin} autoPlay loop />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};

export default BannerComponent;
