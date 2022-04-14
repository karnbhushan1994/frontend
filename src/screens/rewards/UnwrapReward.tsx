import React, { useEffect } from 'react';

import { RouteProp } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { images as rewardImages } from 'assets/rewards';
import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';
import { MainStackParams } from 'routes';
import { unwrapRewardService } from 'services/UserProfileService';
import { updateRewardsStore } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { getTokenOrLogout, isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

type UnwrapRewardRouteProps = RouteProp<MainStackParams, 'UnwrapReward'>;

type UnwrapRewardNavigationProps = StackNavigationProp<MainStackParams, 'UnwrapReward'>;

interface UnwrapRewardProps {
  route: UnwrapRewardRouteProps;
  navigation: UnwrapRewardNavigationProps;
}
const UnwrapReward: React.FC<UnwrapRewardProps> = ({ route, navigation }) => {
  const { rewardUnwrapping, screenType } = route.params;
  const dispatch = useDispatch();
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, [navigation]);

  const onPress = async () => {
    const token = await getTokenOrLogout(dispatch);
    const success = await unwrapRewardService(token, userId, rewardUnwrapping);
    if (success) {
      dispatch(updateRewardsStore(userId));
      navigation.navigate('RewardReceived', {
        rewardUnwrapped: rewardUnwrapping,
        screenType,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainView}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{'You did that!'}</Text>
          <Text style={styles.subheading}>{'Open your present'}</Text>
        </View>
        <View style={styles.mainAssetsContainer}>
          <SvgXml xml={rewardImages.Confetti} width={SCREEN_WIDTH} style={{}} />
          <View style={styles.imageContainer}>
            <Image resizeMode={'cover'} style={styles.image} source={rewardImages.PresentGIF} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonWithGradientBackground
            onPress={onPress}
            title={'Unwrap'}
            buttonStyles={styles.buttonStyles}
            buttonTextStyles={styles.buttonTextStyles}
            buttonStartIcon={images.main.Lock}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { bottom: isIPhoneX() ? '25%' : '18%', position: 'absolute' },
  safearea: { backgroundColor: 'white' },
  mainView: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    top: '10%',
    width: SCREEN_WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    lineHeight: normalize(47),
    fontSize: normalize(34),
    fontWeight: '700',
    color: '#8F00FF',
  },
  subheading: {
    lineHeight: normalize(28),
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#000',
  },
  mainAssetsContainer: {
    height: SCREEN_HEIGHT * 0.3,
    top: '20%',
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
  buttonStyles: {
    width: 280,
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonTextStyles: {
    fontWeight: '700',
    fontSize: normalize(18),
    lineHeight: normalize(25),
    color: 'white',
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 24,
    left: 14,
  },
  image: {
    position: 'absolute',
    top: 0,
    height: 350,
    width: 350,
  },
});

export default UnwrapReward;
