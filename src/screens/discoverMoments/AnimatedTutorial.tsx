import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isIPhoneX, SCREEN_WIDTH } from 'utils';

const AnimatedTutorial: React.FC = () => {
  const navigation = useNavigation();

  const handleCloseAnimationTutorial = async () => {
    navigation.goBack();
  };

  // don't dismiss the tutorial if swipe gesture isn't sufficiently large
  const activeOffsetY: number = -15;

  return (
    <SafeAreaView>
      <TapGestureHandler onEnded={handleCloseAnimationTutorial}>
        <PanGestureHandler onActivated={handleCloseAnimationTutorial} {...{ activeOffsetY }}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{'Swipe up to discover more people!'}</Text>
            </View>
            <Image source={require('assets/gifs/swipe-animation.gif')} style={styles.swipeGif} />
          </View>
        </PanGestureHandler>
      </TapGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    top: '2.55%',
    left: '5%',
  },
  text: {
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    position: 'relative',
    top: '100%',
  },
  textContainer: {
    width: isIPhoneX() ? SCREEN_WIDTH * 0.5 : SCREEN_WIDTH * 0.6,
    alignSelf: 'center',
    top: isIPhoneX() ? '65%' : '45%',
  },
  swipeGif: {
    width: 333,
    height: 250,
    left: '22.5%',
    top: isIPhoneX() ? '75%' : '45%',
  },

  //Styles to adjust moment container
  momentScrollContainer: {
    backgroundColor: 'transparent',
  },
  momentContainer: {
    top: '62%',
    backgroundColor: 'transparent',
  },
  momentHeaderText: {
    paddingBottom: '5%',
  },
  momentHeader: {
    backgroundColor: 'transparent',
  },
});

export default AnimatedTutorial;
