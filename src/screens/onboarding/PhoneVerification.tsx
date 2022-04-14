import React, { useContext, useEffect, useMemo, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-animatable';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { normalize } from 'react-native-elements';
import { useDispatch } from 'react-redux';

import { profileTutorialStageUpdated } from 'store/reducers/userReducer';

import { Images } from '../../assets';
import { ArrowButton, Background, CustomToolTip, LoadingIndicator } from '../../components';
import {
  codeRegex,
  PHONE_VERIFICATION_DIGITS,
  TAGG_ERROR_RED,
  TAGG_SUCCESS_GREEN,
} from '../../constants';
import { ERROR_SOMETHING_WENT_WRONG } from '../../constants/strings';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { sendOtp, verifyOtp, updateLoginCount } from '../../services';

import {
  AnalyticCategory,
  AnalyticVerb,
  ASYNC_STORAGE_KEYS,
  BackgroundGradientType,
  ProfileTutorialStage,
} from '../../types';
import { HeaderHeight, SCREEN_WIDTH, track, userLogin } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type PhoneVerificationRouteProp = RouteProp<OnboardingStackParams, 'PhoneVerification'>;
type PhoneVerificationNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'PhoneVerification'
>;
interface PhoneVerificationProps {
  route: PhoneVerificationRouteProp;
  navigation: PhoneVerificationNavigationProp;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { setIsVip, setUserId, setToken, setUsername } = useContext(OnboardingContext);
  const [value, setValue] = React.useState('');
  const ref = useBlurOnFulfill({ value, cellCount: PHONE_VERIFICATION_DIGITS });
  const [valueProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { phone, login } = route.params;
  const PHONE_VERIFICATION_TOOLTIP = 'Invalid code';
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>();

  // Auto sumbit when user enters 4 digit code
  useEffect(() => {
    if (value.length === 4) {
      handleVerification();
    }
  }, [value]);

  const handleSuccess = async (callback: () => void) => {
    setIsValid(true);
    setShowToolTip(false);
    setTimeout(callback, 300);
  };

  const handleUpdateProfileTutorialStage = async (stage?: ProfileTutorialStage) => {
    if (stage !== undefined) {
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS.PROFILE_TUTORIAL_STAGE, `${stage}`);
      dispatch({
        type: profileTutorialStageUpdated.type,
        payload: { stage },
      });
    }
  };

  const handleVerification = async () => {
    if (!codeRegex.test(value)) {
      setShowToolTip(true);
      setToolTipState(PHONE_VERIFICATION_TOOLTIP);
      return;
    }
    try {
      const response = await verifyOtp(phone, value);
      if (!response) {
        setShowToolTip(true);
        setToolTipState(PHONE_VERIFICATION_TOOLTIP);
        return;
      }

      const {
        user_id,
        token,
        username,
        is_vip,
        is_onboarded,
        is_profile_onboarded,
        profile_tutorial_stage,
      } = response;

      await handleUpdateProfileTutorialStage(profile_tutorial_stage);

      // user is already regstered, storing these info so we can login later
      if (user_id && token && username) {
        setUserId(user_id);
        setToken(token);
        setUsername(username);
      }

      // can login
      if (is_onboarded && is_profile_onboarded && user_id && token && username) {
        track('PhoneVerificationStep', AnalyticVerb.Finished, AnalyticCategory.Login, {
          user: {
            userId: user_id,
            username,
          },
        });
        updateLoginCount(user_id, token);
        handleSuccess(() => userLogin(dispatch, { userId: user_id, username }, token));
        return;
      }

      // not on waitlist, but needs to onboard profile
      if (is_onboarded && !is_profile_onboarded) {
        track('PhoneVerificationStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding, {
          is_onboarded,
        });
        if (!!token) {
          await AsyncStorage.setItem('token', token);
        }
        handleSuccess(() => navigation.navigate('Permissions'));
        return;
      }

      // not on waitlist, attemp to onboard user
      if (!is_onboarded && !is_profile_onboarded) {
        track('PhoneVerificationStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding, {
          is_onboarded,
          is_vip,
        });
        setIsVip(is_vip);
        handleSuccess(() => navigation.navigate('Signup'));
        return;
      }

      setShowToolTip(false);
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    } catch (error) {
      console.log(error);
      setShowToolTip(false);
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
  };

  const footer = useMemo(
    () => (
      <ArrowButton
        style={styles.backArrow}
        direction="backward"
        onboarding={true}
        onPress={() => {
          navigation.goBack();
          track(
            'PhoneVerificationStep',
            AnalyticVerb.Canceled,
            login ? AnalyticCategory.Login : AnalyticCategory.Onboarding,
          );
        }}
      />
    ),
    [],
  );

  const handleResendCode = () => {
    sendOtp(phone);
    setToolTipState('');
    setShowToolTip(false);
    setValue('');
    track(
      'PhoneVerificationStep',
      AnalyticVerb.Selected,
      login ? AnalyticCategory.Login : AnalyticCategory.Onboarding,
    );
  };

  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      <KeyboardAvoidingView behavior={Behavior(Platform.OS)} style={styles.form}>
        <Text style={onBoardingStyles.formHeader}>Enter 4 digit code</Text>
        <Text style={styles.description}>We sent you a 4 digit code through text</Text>
        <View style={styles.body}>
          <CodeField
            ref={ref}
            {...valueProps}
            value={value}
            onChangeText={setValue}
            cellCount={PHONE_VERIFICATION_DIGITS}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[
                  styles.cellRoot,
                  isFocused && styles.focusCell,
                  isValid && styles.validCellRoot,
                  showToolTip && styles.invalidCellRoot,
                ]}>
                <Text
                  style={[
                    styles.cellText,
                    isValid && styles.validCellText,
                    showToolTip && styles.invalidCellText,
                  ]}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          {showToolTip && (
            <View>
              <CustomToolTip toolTipText={toolTipState} />
            </View>
          )}
        </View>
        {isValid === true ? (
          <Image source={Images.SignUp.GreenCheck} style={styles.verifiedImage} />
        ) : (
          <>
            <TouchableOpacity style={styles.resendView} onPress={handleResendCode}>
              <Text style={styles.resend}>Resend Code</Text>
            </TouchableOpacity>
          </>
        )}
        <LoadingIndicator />
      </KeyboardAvoidingView>
      {footer}
    </Background>
  );
};

const styles = StyleSheet.create({
  body: { marginTop: '18%' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    top: '20%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 3,
  },
  resend: {
    textDecorationLine: 'underline',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  codeFieldRoot: {
    width: 141,
    marginHorizontal: 'auto',
    marginBottom: '3%',
  },
  cellRoot: {
    width: normalize(18),
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  validCellRoot: {
    borderBottomColor: TAGG_SUCCESS_GREEN,
  },
  invalidCellRoot: {
    borderBottomColor: TAGG_ERROR_RED,
  },
  cellText: {
    color: '#fff',
    fontSize: normalize(16),
    textAlign: 'center',
  },
  validCellText: {
    color: TAGG_SUCCESS_GREEN,
  },
  invalidCellText: {
    color: TAGG_ERROR_RED,
  },
  focusCell: {
    borderBottomColor: '#78a0ef',
    borderBottomWidth: 2,
  },
  loadingIndicator: {
    marginVertical: '5%',
  },
  backArrow: {
    width: normalize(29),
    height: normalize(25),
    position: 'absolute',
    top: HeaderHeight * 1.5,
    left: 20,
  },
  resendView: {
    marginTop: '5%',
  },
  description: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    marginHorizontal: '10%',
    marginTop: '6%',
    width: SCREEN_WIDTH * 0.55,
    textAlign: 'center',
  },
  verifiedImage: {
    width: 64,
    height: 64,
    marginTop: 25,
  },
});
export default PhoneVerification;
