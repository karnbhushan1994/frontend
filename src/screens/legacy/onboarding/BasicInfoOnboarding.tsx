import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { normalize } from 'react-native-elements';
import Animated, { EasingNode, useValue } from 'react-native-reanimated';

import {
  ArrowButton,
  Background,
  CustomToolTip,
  TaggInput,
  TaggSquareButton,
} from '../../../components';
import {
  emailRegex,
  fullNameRegex,
  LIGHT_ORANGE,
  passwordRegex,
  phoneRegex,
  TAGG_LIGHT_BLUE_2,
  usernameRegex,
  WHITE,
} from '../../../constants';
import {
  ERROR_NEXT_PAGE,
  ERROR_PHONE_IN_USE,
  ERROR_TWILIO_SERVER_ERROR,
  PASSWORD_TOOLTIP,
  PHONENUMBER_TOOLTIP,
  SIGNUP_TOOLTIP,
  USERNAME_TOOLTIP,
} from '../../../constants/strings';
import { OnboardingStackParams } from '../../../routes';
import { sendOtpStatusCode, validateOnboardingInfo } from '../../../services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../../types';
import { HeaderHeight, SCREEN_HEIGHT, SCREEN_WIDTH, track } from '../../../utils';

type BasicInfoOnboardingRouteProp = RouteProp<OnboardingStackParams, 'BasicInfoOnboarding'>;
type BasicInfoOnboardingNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'BasicInfoOnboarding'
>;
interface BasicInfoOnboardingProps {
  route: BasicInfoOnboardingRouteProp;
  navigation: BasicInfoOnboardingNavigationProp;
}

const BasicInfoOnboarding: React.FC<BasicInfoOnboardingProps> = ({ route }) => {
  const { isPhoneVerified } = route.params;
  const navigation = useNavigation();
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [valid, setValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [passVisibility, setPassVisibility] = useState(false);
  const [autoCapitalize, setAutoCap] = useState<
    'none' | 'sentences' | 'words' | 'characters' | undefined
  >('none');
  const [fadeValue, setFadeValue] = useState<Animated.Value<number>>(new Animated.Value(0));
  const [toolTip, setToolTip] = useState(false);
  const [toolTipState, setToolTipState] = useState('');
  const fadeButtonValue = useValue<number>(0);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  });

  const fadeFormIn = () => {
    setFadeValue(new Animated.Value(0));
  };

  const fadeButtonTo = (target: number) => {
    Animated.timing(fadeButtonValue, {
      toValue: target,
      duration: 100,
      easing: EasingNode.linear,
    }).start();
  };

  useEffect(() => {
    const fade = async () => {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1000,
        easing: EasingNode.linear,
      }).start();
    };
    fade();
  }, [fadeValue]);

  useEffect(() => {
    if (valid) {
      fadeButtonTo(1);
    } else {
      fadeButtonTo(0);
    }
  }, [valid]);

  const goToPhoneVerification = async () => {
    if (!attemptedSubmit) {
      setAttemptedSubmit(true);
    }
    try {
      if (valid) {
        const { phone } = form;
        const code = await sendOtpStatusCode(phone);
        if (code) {
          switch (code) {
            case 200:
              const { fullName } = form;
              track('PhoneNumberStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
              navigation.navigate('PhoneVerification', {
                fullName: fullName,
                phone,
              });
              break;
            case 409:
              Alert.alert(ERROR_PHONE_IN_USE);
              break;
            default:
              Alert.alert(ERROR_TWILIO_SERVER_ERROR);
          }
        } else {
          setAttemptedSubmit(false);
          setTimeout(() => {
            setAttemptedSubmit(true);
          });
        }
      }
    } catch (error) {
      Alert.alert(ERROR_NEXT_PAGE);
      return {
        name: 'Navigation error',
        description: error,
      };
    }
  };
  // 0 = first name, 1 = last name, 2 = username, 3 = phone #
  const handleNameUpdate = (name: string, nameType: number) => {
    switch (nameType) {
      case 0:
        let isValidName: boolean = fullNameRegex.test(name);
        if (isValidName === false) {
          setToolTip(true);
        } else {
          setToolTip(false);
        }
        setForm({
          ...form,
          fullName: name,
        });
        setAutoCap('words');
        setValid(isValidName);
        setToolTipState(SIGNUP_TOOLTIP);
        break;
      case 2:
        const validUsername = usernameRegex.test(name);
        if (validUsername === false) {
          setToolTip(true);
        } else {
          setToolTip(false);
        }
        setForm({
          ...form,
          username: name,
        });
        setValid(validUsername);
        setAutoCap('none');
        setToolTipState(USERNAME_TOOLTIP);

        break;
    }
  };
  const handlePhoneUpdate = (phone: string) => {
    const validPhone = phoneRegex.test(phone);

    if (validPhone === false) {
      setToolTip(true);
    } else {
      setToolTip(false);
    }
    setForm({
      ...form,
      phone,
    });
    setAutoCap('none');
    setValid(validPhone);
    setToolTipState(PHONENUMBER_TOOLTIP);
  };
  const handleEmailUpdate = (email: string) => {
    const validEmail = emailRegex.test(email);
    email = email.trim();
    setForm({
      ...form,
      email,
    });
    setAutoCap('none');
    setValid(validEmail);
  };
  const handlePasswordUpdate = (password: string) => {
    const validPassword = passwordRegex.test(password);
    if (validPassword === false) {
      setToolTip(true);
    } else {
      setToolTip(false);
    }
    setForm({
      ...form,
      password,
    });
    setAutoCap('none');
    setValid(validPassword);
    setToolTipState(PASSWORD_TOOLTIP);
  };
  const formSteps: {
    placeholder: string;
    onChangeText: (text: string) => void;
    value: string;
  }[] = [
    {
      placeholder: 'Full Name',
      onChangeText: text => handleNameUpdate(text, 0),
      value: form.fullName,
    },
    {
      placeholder: 'Username',
      onChangeText: text => handleNameUpdate(text, 2),
      value: form.username,
    },
    {
      placeholder: 'Password',
      onChangeText: handlePasswordUpdate,
      value: form.password,
    },
    {
      placeholder: 'Phone',
      onChangeText: handlePhoneUpdate,
      value: form.phone,
    },
    {
      placeholder: 'School Email',
      onChangeText: handleEmailUpdate,
      value: form.email,
    },
  ];
  const resetForm = (formStep: String) => {
    setValid(false);
    switch (formStep) {
      case 'Full Name':
        setForm({
          ...form,
          fullName: '',
        });
        break;
      case 'Email':
        setForm({
          ...form,
          email: '',
        });
        break;
      case 'Password':
        setForm({
          ...form,
          password: '',
        });
        break;
      case 'School Email':
        setForm({
          ...form,
          email: '',
        });
        break;
      case 'Username':
        setForm({
          ...form,
          username: '',
        });
        break;
    }
  };
  const step = formSteps[currentStep];
  const advance = async () => {
    setAttemptedSubmit(true);
    if (valid) {
      if (step.placeholder === 'School Email') {
        const verifiedInfo = await validateOnboardingInfo({
          email: form.email,
        });
        if (!verifiedInfo) {
          const reason = 'Email is taken';
          track('EmailStep', AnalyticVerb.Failed, AnalyticCategory.Onboarding, {
            reason,
          });
          return;
        }
      } else if (step.placeholder === 'Username') {
        const verifiedInfo = await validateOnboardingInfo({
          username: form.username,
        });
        if (!verifiedInfo) {
          const reason = 'Username is taken';
          track('UsernameStep', AnalyticVerb.Failed, AnalyticCategory.Onboarding, {
            reason,
          });
          return;
        }
      }
      switch (currentStep) {
        case 0:
          track('FirstNameStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          break;
        case 1:
          track('UsernameStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          break;
        case 2:
          track('PasswordStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          break;

        case 3:
          track('EmailStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          break;
      }
      setCurrentStep(currentStep + 1);
      setAttemptedSubmit(false);
      setValid(false);
      fadeFormIn();
    }
  };
  useEffect(() => {
    if (isPhoneVerified) {
      advance();
    }
  }, [isPhoneVerified]);

  const onPressGoBack = () => {
    if (currentStep === 0) {
      navigation.goBack();
    } else {
      setCurrentStep(currentStep - 1);
      resetForm(step.placeholder);
      setAttemptedSubmit(false);
      setFadeValue(new Animated.Value(0));
      setToolTip(false);
    }
  };

  return (
    <Background style={styles.container} gradientType={BackgroundGradientType.Light}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-(SCREEN_HEIGHT * 0.2)}
        style={styles.container}>
        <ArrowButton
          style={styles.backArrow}
          direction="backward"
          onboarding={true}
          onPress={() => onPressGoBack()}
        />
        {step.placeholder === 'Phone' && !isPhoneVerified ? (
          <>
            <Animated.Text style={[styles.formHeader, { opacity: fadeValue }]}>
              Phone number
            </Animated.Text>
            <Animated.View style={[styles.formContainer, { opacity: fadeValue }]}>
              <TaggInput
                style={
                  attemptedSubmit && !valid ? [styles.input, styles.invalidColor] : styles.input
                }
                maxLength={10} // currently only support US phone numbers
                accessibilityHint="Enter your phone number."
                accessibilityLabel="Phone number input field."
                placeholder="Phone Number"
                autoCompleteType="tel"
                selectionColor="white"
                textContentType="telephoneNumber"
                externalStyles={{
                  warning: styles.passWarning,
                }}
                keyboardType="number-pad"
                onChangeText={handlePhoneUpdate}
                onSubmitEditing={goToPhoneVerification}
                autoFocus={true}
                blurOnSubmit={false}
                valid={valid}
                invalidWarning={'Please enter a valid 10 digit number.'}
                attemptedSubmit={attemptedSubmit}
                image={
                  step.value !== ''
                    ? toolTip === true
                      ? require('../../assets/images/red-cross.png')
                      : require('../../assets/images/green-check.png')
                    : null
                }
              />
              {toolTip && <CustomToolTip toolTipText={toolTipState} />}
              <Animated.View
                style={[
                  styles.buttonStyle,
                  {
                    opacity: fadeButtonValue,
                  },
                ]}>
                <TaggSquareButton
                  onPress={goToPhoneVerification}
                  title={'Verify'}
                  buttonStyle={'normal'}
                  buttonColor={'white'}
                  labelColor={'blue'}
                />
              </Animated.View>
            </Animated.View>
          </>
        ) : (
          <>
            {step.placeholder !== 'Password' ? (
              <>
                <Text style={styles.formHeader}>Sign up</Text>
                <Animated.View style={[styles.formContainer, { opacity: fadeValue }]}>
                  <TaggInput
                    key={step.placeholder}
                    style={
                      attemptedSubmit && !valid ? [styles.input, styles.invalidColor] : styles.input
                    }
                    accessibilityHint={`Enter your ${step.placeholder.toLowerCase()}`}
                    accessibilityLabel={`${step.placeholder} input field.`}
                    placeholder={step.placeholder}
                    autoCompleteType="name"
                    autoCapitalize={autoCapitalize}
                    textContentType="name"
                    returnKeyType="done"
                    selectionColor="white"
                    onChangeText={step.onChangeText}
                    onSubmitEditing={advance}
                    value={step.value}
                    autoFocus={true}
                    blurOnSubmit={false}
                    externalStyles={{
                      warning: styles.passWarning,
                    }}
                    valid={valid}
                    attemptedSubmit={attemptedSubmit}
                    image={
                      step.value !== ''
                        ? toolTip === true
                          ? require('../../assets/images/red-cross.png')
                          : require('../../assets/images/green-check.png')
                        : null
                    }
                  />
                  {toolTip && <CustomToolTip toolTipText={toolTipState} />}
                  <Animated.View
                    style={[
                      styles.buttonStyle,
                      {
                        opacity: fadeButtonValue,
                      },
                    ]}>
                    <TaggSquareButton
                      onPress={advance}
                      title={'Next'}
                      buttonStyle={'normal'}
                      buttonColor={'white'}
                      labelColor={'blue'}
                    />
                  </Animated.View>
                </Animated.View>
              </>
            ) : (
              <>
                <Text style={styles.formHeader}>Sign up</Text>
                <Animated.View style={[styles.formContainer, { opacity: fadeValue }]}>
                  <TaggInput
                    accessibilityHint="Enter a password."
                    accessibilityLabel="Password input field."
                    placeholder="Password"
                    autoCompleteType="password"
                    textContentType="oneTimeCode"
                    returnKeyType="done"
                    selectionColor="white"
                    onChangeText={handlePasswordUpdate}
                    onSubmitEditing={advance}
                    // onSubmitEditing={advanceRegistration}
                    blurOnSubmit={false}
                    autoFocus={true}
                    secureTextEntry={!passVisibility}
                    valid={valid}
                    externalStyles={{
                      warning: styles.passWarning,
                    }}
                    invalidWarning={
                      'Password must be at least 8 characters & contain at least one of a-z, A-Z, 0-9, and a special character.'
                    }
                    attemptedSubmit={attemptedSubmit}
                    style={
                      attemptedSubmit && !valid ? [styles.input, styles.invalidColor] : styles.input
                    }
                    image={
                      step.value !== ''
                        ? toolTip === true
                          ? require('../../assets/images/red-cross.png')
                          : require('../../assets/images/green-check.png')
                        : null
                    }
                  />

                  {toolTip && <CustomToolTip toolTipText={toolTipState} />}
                  <TouchableOpacity
                    accessibilityLabel="Show password button"
                    accessibilityHint="Select this if you want to display your tagg password"
                    style={styles.showPassContainer}
                    onPress={() => setPassVisibility(!passVisibility)}>
                    {toolTip === false ? <Text style={styles.showPass}>Show Password</Text> : null}
                  </TouchableOpacity>
                  <Animated.View
                    style={[
                      styles.buttonStyle,
                      {
                        opacity: fadeButtonValue,
                      },
                    ]}>
                    <TaggSquareButton
                      onPress={advance}
                      title={'Next'}
                      buttonStyle={'normal'}
                      buttonColor={'white'}
                      labelColor={'blue'}
                    />
                  </Animated.View>
                </Animated.View>
              </>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: '15%',
    height: SCREEN_HEIGHT * 0.22,
    width: '80%',
  },
  arrow: {
    color: TAGG_LIGHT_BLUE_2,
  },
  buttonStyle: {
    alignItems: 'center',
    paddingTop: 40,
  },
  showPassContainer: {
    marginVertical: '1%',
    borderBottomWidth: 1,
    paddingBottom: '1%',
    alignSelf: 'flex-start',
    borderBottomColor: WHITE,
    marginBottom: '8%',
  },
  showPass: {
    color: 'white',
  },
  passWarning: {
    fontSize: 14,
    marginTop: 5,
    color: LIGHT_ORANGE,
    maxWidth: 350,
    alignSelf: 'flex-start',
  },
  input: {
    minWidth: '100%',
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    borderBottomColor: '#fff',
  },
  invalidColor: {
    color: LIGHT_ORANGE,
  },
  errorInput: {
    minWidth: '60%',
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    color: LIGHT_ORANGE,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  button: {
    alignItems: 'center',
    width: 40,
    aspectRatio: 10,
  },
  formHeader: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
  },
  load: {
    top: '5%',
  },
  tc: {
    marginVertical: '5%',
  },
  backArrow: {
    width: normalize(29),
    height: normalize(25),
    position: 'absolute',
    top: HeaderHeight * 1.5,
    left: 20,
  },
});
export default BasicInfoOnboarding;
