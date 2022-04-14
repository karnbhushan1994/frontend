import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { Images } from '../../../assets';
import { Background, TaggInput } from '../../../components';
import Button from '../../../components/button';
import UpdateRequired from '../../../components/onboarding/UpdateRequired';
import {
  AUTOCAPITALIZE,
  ERROR_DOUBLE_CHECK_CONNECTION,
  ERROR_FAILED_LOGIN_INFO,
  ERROR_INVALID_LOGIN,
  ERROR_LOGIN_FAILED,
  ERROR_NOT_ONBOARDED,
  ERROR_SOMETHING_WENT_WRONG_REFRESH,
  GO_RETURNTYPE,
  ICON_SIZE,
  INVALID_WARNING,
  LIGHT_WHITE,
  LOGIN_ENDPOINT,
  LOGIN_TITLE,
  NEXT_RETURNTYPE,
  PASSWORD,
  PASSWORD_AUTOCOMPLETE,
  PASSWORD_TOOLTIP,
  SELECTIONCOLOR,
  USERNAME,
  usernameRegex,
  WHITE
} from '../../../constants';
import { OnboardingStackParams } from '../../../routes/onboarding';
import { RootState } from '../../../store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  BackgroundGradientType,
  UniversityType
} from '../../../types';
import { track, userLogin } from '../../../utils';
import { Behavior } from '../../../utils/helper';
import { styles } from './Style';
type VerificationScreenRouteProp = RouteProp<OnboardingStackParams, 'Login'>;
type VerificationScreenNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'Login'
>;
interface LoginProps {
  route: VerificationScreenRouteProp;
  navigation: VerificationScreenNavigationProp;
}
/**
 * Login screen.
 * @param navigation react-navigation navigation object.
 */
const Login: React.FC<LoginProps> = ({navigation}: LoginProps) => {
  // ref for focusing on input fields
  const inputRef = useRef();

  // login form state
  const [form, setForm] = React.useState({
    username: '',
    password: '',
    isValidUser: false,
    isValidPassword: false,
    attemptedSubmit: false,
    token: '',
  });
  const {newVersionAvailable} = useSelector(
    (state: RootState) => state.appInfo,
  );
  /**
   * Redux Store stuff
   * Get the dispatch reference
   */

  const dispatch = useDispatch();

  /**
   * Updates the state of username. Also verifies the input of the username field by ensuring proper length and appropriate characters.
   */

  const handleUsernameUpdate = (val: string) => {
    val = val.trim();
    let validLength: boolean = val.length >= 3;
    let validChars: boolean = usernameRegex.test(val);

    if (validLength && validChars) {
      setForm({
        ...form,
        username: val,
        isValidUser: true,
      });
    } else {
      setForm({
        ...form,
        username: val,
        isValidUser: false,
      });
    }
  };

  /**
   * Updates the state of password. Also verifies the input of the password field by ensuring proper length.
   */
  const handlePasswordUpdate = (val: string) => {
    let validLength: boolean = val.trim().length >= 8;

    if (validLength) {
      setForm({
        ...form,
        password: val,
        isValidPassword: true,
      });
    } else {
      setForm({
        ...form,
        password: val,
        isValidPassword: false,
      });
    }
  };

  /*
   * Handles tap on username keyboard's "Next" button by focusing on password field.
   */
  const handleUsernameSubmit = () => {
    const passwordField: any = inputRef.current;
    if (passwordField) {
      passwordField.focus();
    }
  };

  /**
  * Handler for the Let's Start button or the Go button on the keyboard.
    Makes a POST request to the Django login API and presents Alerts based on the status codes that the backend returns.
  * Stores token received in the response, into client's AsynStorage
  */
  const handleLogin = async () => {
    track('LoginButton', AnalyticVerb.Pressed, AnalyticCategory.Login);
    if (!form.attemptedSubmit) {
      setForm({
        ...form,
        attemptedSubmit: true,
      });
    }
    try {
      if (form.isValidUser && form.isValidPassword) {
        const {username, password} = form;
        let response = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        });

        let statusCode = response.status;
        let data: {
          token: string;
          UserID: string;
          isOnboarded: boolean;
          university: string;
        } = await response.json();

        if (statusCode === 200) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('userId', data.UserID);
          await AsyncStorage.setItem('username', username);
        }

        if (statusCode === 200 && data.isOnboarded) {
          //Stores token received in the response into client's AsynStorage
          try {
            track('Login', AnalyticVerb.Finished, AnalyticCategory.Login, {
              user: {
                userId: data.UserID,
                username,
              },
            });
            userLogin(dispatch, {userId: data.UserID, username});
          } catch (err) {
            Alert.alert(ERROR_INVALID_LOGIN);
          }
        } else if (
          statusCode === 200 &&
          data.university === UniversityType.Empty
        ) {
          track('Login', AnalyticVerb.Failed, AnalyticCategory.Login, {
            reason: 'Missing basic profile info',
          });
          /**
           * A user account was created during onboarding step 2 but user didn't
           * finish step 3, thus does not have a universtiy.
           * Redirecting user back to onboarding to finish the process
           */
          navigation.navigate('ProfileInfoOnboarding', {
            userId: data.UserID,
            username: username,
          });
        } else if (statusCode === 200 && !data.isOnboarded) {
          track('Login', AnalyticVerb.Failed, AnalyticCategory.Login, {
            reason: 'Not onboarded',
          });
          /**
           * A user account was created and finished the onboarding process but
           * did not have an invitation code at the time so the user's account
           * is not activated (isOnboarded) yet.
           */
          navigation.navigate('InvitationCodeVerification', {
            userId: data.UserID,
            username: username,
          });
          setTimeout(() => {
            Alert.alert(ERROR_NOT_ONBOARDED);
          }, 500);
        } else if (statusCode === 401) {
          track('Login', AnalyticVerb.Failed, AnalyticCategory.Login, {
            reason: 'Invalid credentials',
          });
          Alert.alert(ERROR_FAILED_LOGIN_INFO);
        } else {
          track('Login', AnalyticVerb.Failed, AnalyticCategory.Login, {
            reason: 'Unknown',
          });
          Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
        }
      } else {
        track(
          'InvalidPasswordOrUsername',
          AnalyticVerb.Failed,
          AnalyticCategory.Login,
        );
        setForm({...form, attemptedSubmit: false});
        setTimeout(() => setForm({...form, attemptedSubmit: true}));
      }
    } catch (error) {
      track('Login', AnalyticVerb.Failed, AnalyticCategory.Login);
      Alert.alert(ERROR_LOGIN_FAILED, ERROR_DOUBLE_CHECK_CONNECTION);
      return {
        name: 'Login error',
        description: error,
      };
    }
  };

  /**
   * Login screen forgot password button.
   */
  const ForgotPassword = () => (
    <TouchableOpacity
      style={styles.forgotPassword}
      onPress={() => navigation.navigate('PasswordResetRequest')}>
      <Text style={styles.forgotPasswordText}>Forgot password</Text>
    </TouchableOpacity>
  );

  return (
    <Background
      centered
      style={styles.container}
      gradientType={BackgroundGradientType.Light}>
      <StatusBar barStyle="light-content" />
      <UpdateRequired visible={newVersionAvailable} />
      <KeyboardAvoidingView
        behavior={Behavior(Platform.OS)}
        style={styles.keyboardAvoidingView}>
        <View style={styles.leftArrow}>
          <Icon
            onPress={() => navigation.navigate('LandingPage')}
            name="chevron-left"
            size={ICON_SIZE}
            color={LIGHT_WHITE}
            style={styles.backArrow}
          />
        </View>
        <Image source={Images.LandingPageBg.Logo} style={styles.logo} />
        <TaggInput
          placeholder={USERNAME}
          returnKeyType={NEXT_RETURNTYPE}
          autoCapitalize={AUTOCAPITALIZE}
          onChangeText={handleUsernameUpdate}
          onSubmitEditing={handleUsernameSubmit}
          blurOnSubmit={false}
          valid={form.isValidUser}
          invalidWarning={INVALID_WARNING}
          attemptedSubmit={form.attemptedSubmit}
          autoCorrect={false}
          placeholderTextColor={WHITE}
          style={styles.input}
          containerStyle={styles.inputContainer}
          selectionColor={SELECTIONCOLOR}
        />

        <TaggInput
          placeholder={PASSWORD}
          autoCompleteType={PASSWORD_AUTOCOMPLETE}
          textContentType={PASSWORD_AUTOCOMPLETE}
          returnKeyType={GO_RETURNTYPE}
          autoCapitalize={AUTOCAPITALIZE}
          secureTextEntry
          onChangeText={handlePasswordUpdate}
          onSubmitEditing={handleLogin}
          valid={form.isValidPassword}
          invalidWarning={PASSWORD_TOOLTIP}
          attemptedSubmit={form.attemptedSubmit}
          ref={inputRef}
          autoCorrect={false}
          placeholderTextColor={WHITE}
          style={styles.input}
          selectionColor={SELECTIONCOLOR}
          containerStyle={styles.inputContainer}
        />
        <View style={styles.buttonContainer}>
          <ForgotPassword />
        </View>
        <Button
          style={styles.buttonContainer}
          onPress={handleLogin}
          buttonStyle={styles.button}
          title={LOGIN_TITLE}
        />
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Login;
