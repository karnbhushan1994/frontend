import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

import { WHITE, LIGHT_ORANGE, TAGG_LIGHT_BLUE, LIGHT_PURPLE_WHITE } from '../../constants';
import { HeaderHeight, SCREEN_WIDTH } from '../../utils';

export const onBoardingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftArrow: {
    flex: 0.15,
  },
  textView: {
    flex: 0.35,
    paddingTop: 10,
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  formHeader: {
    color: WHITE,
    fontSize: 25,
    fontWeight: '700',
  },
  formSubHeader: {
    color: LIGHT_PURPLE_WHITE,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  backArrow: {
    width: normalize(29),
    height: normalize(25),
    position: 'absolute',
    top: HeaderHeight * 1,
    left: 20,
  },
  formContainer: {
    flex: 0.45,
    alignItems: 'center',
  },
  tiktokFormContainer: {
    flex: 0.45,
    alignItems: 'center',
    paddingLeft: 30,
  },
  input: {
    minWidth: '100%',
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  invalidColor: {
    color: LIGHT_ORANGE,
  },
  passWarning: {
    fontSize: 14,
    marginTop: 5,
    color: LIGHT_ORANGE,
    maxWidth: 350,
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    alignItems: 'center',
    paddingTop: 40,
  },
  showPassContainer: {
    marginTop: '3%',
    marginLeft: '8%',
    borderBottomWidth: 1,
    paddingBottom: '1%',
    alignSelf: 'flex-start',
    borderBottomColor: WHITE,
  },
  showPass: {
    color: 'white',
  },
  iconContainer: {
    width: '85%',
    height: '15%',
  },
  imageView: {
    position: 'absolute',
    right: 0,
    top: 5,
  },
  imageStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tiktokIcon: {
    position: 'absolute',
    left: 30,
    height: '15%',
    width: 32,
    borderBottomWidth: 1,
    paddingRight: 10,
    borderColor: WHITE,
    justifyContent: 'center',
  },
  labelStyle: { color: TAGG_LIGHT_BLUE },
  buttonConainer: { width: 150, height: 40, borderRadius: 5, marginTop: 60 },
  nextButtonStyle: { width: '100%', borderRadius: 5 },
  birthday: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 5,
  },
  BirthdayContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  BirthdayContainer1: {
    width: '100%',
    padding: 20,
    justifyContent: 'flex-end',
    marginTop: 40,
  },
  birthDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  arrowImage: {
    height: 20,
    width: 20,
  },
  nextBtn: {
    backgroundColor: '#8F01FF',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 2.5,
    borderRadius: 5,
  },
  nextBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
  },
});
