import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

import { WHITE } from '../../../constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../utils';

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
  },
  loginStyle: {
    textDecorationLine: 'underline',
  },
  logoView: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsView: {
    height: '40%',
    width: '100%',
  },
  innerButtons: {
    height: 200,
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: '10%',
    marginBottom: '5%',
    paddingHorizontal: 30,
  },
  loginText: {
    color: WHITE,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: normalize(15),
  },
  skipView: {
    flex: 1,
  },
  skipTO: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '175%',
    marginLeft: '70%',
  },
  skipButton: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    paddingRight: '6%',
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  login: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
  },
  privacyPolicy: {
    color: WHITE,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: normalize(11),
  },
  policyTextView: {
    marginTop: 40,
  },
});
