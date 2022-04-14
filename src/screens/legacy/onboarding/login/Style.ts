import {StyleSheet} from 'react-native';
import {normalize} from 'react-native-elements';
import {WHITE} from '../../../constants';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../utils';

export const styles = StyleSheet.create({
  input: {
    height: 45,
    paddingLeft: 14,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    paddingRight: 14,
    width: '110%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 0,
    height: 45,
  },
  buttonContainer: {width: '80%'},
  button: {width: '100%'},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: '-30%',
    width: 280,
    height: 140,
    marginBottom: '5%',
    alignSelf: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
    marginTop: 15,
    marginBottom: 40,
  },
  forgotPasswordText: {
    fontSize: normalize(14),
    color: WHITE,
    fontWeight: '600',
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: normalize(17),
  },
  leftArrow: {
    flex: 0.15,
  },

  backArrow: {
    position: 'absolute',
    top: -SCREEN_HEIGHT / 4.5,
    left: -SCREEN_WIDTH / 2 + 20,
  },
});
