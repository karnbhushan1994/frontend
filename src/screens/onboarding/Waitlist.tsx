import React from 'react';

import { useIsFocused } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { normalize } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

import { Videos } from '../../assets';
import Button from '../../components/button';
import {
  INVITE_TEXT,
  SIGNIN_TITLE,
  TAGG_PURPLE,
  WAITING_IG_TEXT,
  WAITING_LIST,
  WAITING_LIST_GRADIENT,
  WAITING_LIST_SUBTEXT,
} from '../../constants';
import { OnboardingStackParams } from '../../routes';

type WaitlistNavigationProps = StackNavigationProp<OnboardingStackParams, 'Waitlist'>;
interface WaitlistProps {
  navigation: WaitlistNavigationProps;
}

const Waitlist: React.FC<WaitlistProps> = ({ navigation }: WaitlistProps): React.ReactElement => {
  const focused = useIsFocused();
  return (
    <>
      <Video
        volume={0}
        resizeMode={'cover'}
        ignoreSilentSwitch={'ignore'}
        repeat={true}
        playInBackground={false}
        source={Videos.moments_login_video}
        style={styles.video}
        paused={!focused}
      />
      <View style={styles.uperView} />
      <View style={styles.lowerView}>
        <LinearGradient colors={WAITING_LIST_GRADIENT} style={styles.container}>
          <View style={styles.waitListText}>
            <Text style={styles.textStyle}>{WAITING_LIST}</Text>
            <Text style={styles.subTextStyle}>{WAITING_LIST_SUBTEXT}</Text>
          </View>
          <View style={styles.signView}>
            <Text style={styles.gotInvite}>{INVITE_TEXT}</Text>
            <Button
              buttonStyle={styles.button}
              onPress={() => {
                navigation.navigate('Phone', {
                  login: true,
                });
              }}
              style={styles.loginButton}
              title={SIGNIN_TITLE}
              applyGradient={false}
            />
          </View>
          <View style={styles.igInviteContainer}>
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL('https://instagram.com/taggapp')}>
              <Image style={styles.igIcon} source={require('../../assets/icons/Instagram.png')} />
            </TouchableWithoutFeedback>

            <Text style={styles.subTextStyle}>{WAITING_IG_TEXT}</Text>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: { width: '100%' },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
  },
  uperView: {
    flex: 0.4,
  },
  lowerView: {
    flex: 0.6,
  },
  waitListText: {
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  textStyle: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: normalize(26),
    paddingBottom: 10,
    letterSpacing: 1,
  },
  subTextStyle: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: normalize(10),
    width: '90%',
    paddingBottom: 40,
    letterSpacing: 1,
    alignSelf: 'center',
  },
  signView: {
    flex: 0.3,
    marginTop: 0,
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 15,
    flex: 0.4,
    width: '45%',
    backgroundColor: TAGG_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: normalize(15),
  },
  gotInvite: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: normalize(14),
  },
  igInviteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  igIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});
export default Waitlist;
