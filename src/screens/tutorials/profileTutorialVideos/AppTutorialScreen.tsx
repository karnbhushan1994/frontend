import React, { useEffect, useRef, useState } from 'react';

import { AppState, Modal, StatusBar } from 'react-native';
import Video from 'react-native-video';

import { onBoardingStyles } from 'screens/onboarding/Styles';

import { Videos } from '../../../assets';
import { Background } from '../../../components';
import { BackgroundGradientType } from '../../../types';
import { styles } from './Style';

interface AppTutorialScreenProps {
  navigation: any;
  route: any;
}
const AppTutorialScreen: React.FC<AppTutorialScreenProps> = ({ route, navigation }) => {
  const videoRef = useRef(null);
  const [videoPaused, toggleVideoPaused] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const [watchedVideo, setWatchedVideo] = useState<boolean>(false);

  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active') {
      setAppActive(true);
    } else {
      setAppActive(false);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    appActive ? toggleVideoPaused(false) : toggleVideoPaused(true);
  }, [appActive]);

  const handleIntroVideoEnded = () => {
    navigation.navigate('ChooseSkinOnboardingScreen', {
      interests: route.params.interests,
    });
    setWatchedVideo(true);
  };

  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      {!watchedVideo && (
        <Modal transparent>
          <Video
            ref={videoRef}
            paused={videoPaused}
            onEnd={handleIntroVideoEnded}
            resizeMode={'cover'}
            volume={1}
            ignoreSilentSwitch={'ignore'}
            playInBackground={false}
            source={Videos.onboarding_video}
            style={styles.video}
          />
        </Modal>
      )}
      <StatusBar barStyle={'light-content'} />
    </Background>
  );
};

export default AppTutorialScreen;
