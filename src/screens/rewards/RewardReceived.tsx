import { default as React, useEffect } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import LottieView from 'lottie-react-native';

import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { useDispatch, useSelector } from 'react-redux';

import { lotties } from 'assets/gamification/lotties';
import { images } from 'assets/images';
import { images as rewardImages } from 'assets/rewards';
import { taggsShop } from 'assets/taggsShop';
import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';

import * as RootNavigation from 'RootNavigation';
import { MainStackParams } from 'routes';
import { changeAnalyticsStatusApi, unlockBackgroundTagg, unlockBgTbGradient } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, RewardType } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

type RewardReceivedRouteProps = RouteProp<MainStackParams, 'RewardReceived'>;

type RewardReceivedNavigationProps = StackNavigationProp<MainStackParams, 'RewardReceived'>;

interface RewardReceivedProps {
  route: RewardReceivedRouteProps;
  navigation: RewardReceivedNavigationProps;
}
const RewardReceived: React.FC<RewardReceivedProps> = ({ route, navigation }) => {
  const { rewardUnwrapped } = route.params;
  const userId = useSelector((state: RootState) => state.user.user.userId);
  const dispatch = useDispatch();
  const RewardReceivedTextBundle = {
    FIRST_MOMENT_POSTED: {
      title: 'Coin Earned',
      subHeading: 'Bonus for posting your first\nmoment!',
      icon: lotties.earned50Coins,
      imageStyle: styles.image,
    },
    SHARE_PROFILE_TO_ENABLE_ANALYTICS: {
      title: 'Insights',
      subHeading: 'Take a look at how your profile is doing',
      icon: images.main.insight_image,
      imageStyle: styles.analytics_image,
    },
    IMAGE_BACKGROUNG_TO_MOMENT_TAGG: {
      title: 'Background',
      subHeading:
        'Forget about boring colors, add \nsome flavor to your taggs with your \nown photos!',
      icon: taggsShop.popupBG,
      imageStyle: styles.popupBG_image,
    },
    PROFILE_GRADIENT_BG_COLOR: {
      title: 'Profile Gradient',
      subHeading: 'Spice up your profile with your own\nunique color combinations',
      icon: images.main.profile_gradient,
      imageStyle: styles.popupBG_image,
    },
    TAB_GRADIENT_BG_COLOR: {
      title: 'Tab Gradient',
      subHeading: 'Create new and exciting colors to\nshow off your pages!',
      icon: images.main.tab_gradient,
      imageStyle: styles.popupBG_image,
    },
  };
  const onContinuePress = () => {
    if (rewardUnwrapped === RewardType.SHARE_PROFILE_TO_ENABLE_ANALYTICS) {
      navigation.popToTop();
      track('ViewYourInsights', AnalyticVerb.Pressed, AnalyticCategory.Settings);
      RootNavigation.navigate('InsightScreen');
      dispatch(changeAnalyticsStatusApi('UNBLOCKED'));
    } else if (rewardUnwrapped === RewardType.IMAGE_BACKGROUNG_TO_MOMENT_TAGG) {
      dispatch(unlockBackgroundTagg(userId));
      navigation.pop(2);
    } else if (
      rewardUnwrapped === RewardType.PROFILE_GRADIENT_BG_COLOR ||
      rewardUnwrapped === RewardType.TAB_GRADIENT_BG_COLOR
    ) {
      dispatch(unlockBgTbGradient(rewardUnwrapped, userId));
      navigation.pop(2);
    } else {
      navigation.popToTop();
    }
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safearea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainView}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{RewardReceivedTextBundle[rewardUnwrapped].title}</Text>
          <Text style={styles.subHeading}>
            {RewardReceivedTextBundle[rewardUnwrapped].subHeading}
          </Text>
        </View>
        <View style={styles.mainAssetsContainer}>
          {rewardUnwrapped !== 'FIRST_MOMENT_POSTED' && (
            <SvgXml xml={rewardImages.Confetti} width={SCREEN_WIDTH} style={{}} />
          )}
          <View style={styles.imageContainer}>
            {rewardUnwrapped !== 'FIRST_MOMENT_POSTED' ? (
              <Image
                resizeMode={'cover'}
                style={RewardReceivedTextBundle[rewardUnwrapped].imageStyle}
                source={RewardReceivedTextBundle[rewardUnwrapped].icon}
              />
            ) : (
              <LottieView
                style={styles.lottie}
                source={RewardReceivedTextBundle[rewardUnwrapped].icon}
                autoPlay
                loop
              />
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonWithGradientBackground
            onPress={onContinuePress}
            title={'Continue'}
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
  lottie: { top: '-8%', width: 300, height: 300, alignSelf: 'center' },
  earned50Points: {
    paddingBottom: 30,
    fontSize: normalize(26),
    color: '#0CB209',
    fontWeight: '700',
    textAlign: 'center',
  },
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
  subHeading: {
    lineHeight: normalize(28),
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#000',
    paddingTop: '3%',
    textAlign: 'center',
  },
  mainAssetsContainer: {
    height: SCREEN_HEIGHT * 0.3,
    top: '20%',
    zIndex: -1,
  },
  imageContainer: {
    position: 'absolute',
    height: 245,
    width: 245,
    alignSelf: 'center',
    margin: 10,
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
  image: {
    position: 'absolute',
    height: 245,
    width: 245,
    alignSelf: 'center',
    margin: 10,
  },
  analytics_image: {
    position: 'absolute',
    height: 206,
    width: 314,
    alignSelf: 'center',
    marginTop: 30,
  },
  popupBG_image: {
    position: 'absolute',
    height: 246,
    width: 246,
    alignSelf: 'center',
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 24,
    left: 14,
  },
  buttonContainer: { bottom: isIPhoneX() ? '25%' : '18%', position: 'absolute' },
});

export default RewardReceived;
