import React, { useContext, useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

import { Images } from '../../assets';
import { ArrowButton, Background, CustomToolTip, TaggLoadingIndicator } from '../../components';
import Button from '../../components/button';
import {
  ARROW_DIRECTION,
  ERROR_TWILIO_SERVER_ERROR,
  KEYBOARD_VERTICLEHEIGHT,
  LIGHT_BLUE,
  PHONENUMBER_KEYBOARD_TYPE,
  PHONENUMBER_MASKSTRING,
  PHONENUMBER_PLACEHOLDER,
  PHONENUMBER_TITLE,
  PHONENUMBER_TOOLTIP,
  PHONE_NUMBER_LENGTH,
  PLACEHOLDER_COLOR,
  SELECTIONCOLOR,
  VERIFY,
  WHITE,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { getPhoneStatus, sendOtp } from '../../services/UserProfileService';
import {
  AnalyticCategory,
  AnalyticVerb,
  BackgroundGradientType,
  PhoneStatusType,
} from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type PhoneNavigationProps = StackNavigationProp<OnboardingStackParams, 'Phone'>;

type PhoneRouteProp = RouteProp<OnboardingStackParams, 'Phone'>;

interface PhoneProps {
  navigation: PhoneNavigationProps;
  route: PhoneRouteProp;
}

const Phone: React.FC<PhoneProps> = ({ navigation, route }: PhoneProps): React.ReactElement => {
  const { login } = route.params;
  const [number, setNumber] = useState<string>('');
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [isvalid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setPhone } = useContext(OnboardingContext);

  const handleError = (error: string) => {
    track(
      'PhoneStep',
      AnalyticVerb.Failed,
      login ? AnalyticCategory.Login : AnalyticCategory.Onboarding,
      {
        error,
      },
    );
    setLoading(false);
    setToolTip(true);
    setToolTipState(error);
  };

  useEffect(() => {
    let isValidPhone: boolean = number.length === PHONE_NUMBER_LENGTH;
    if (isvalid) {
      if (isValidPhone === false) {
        setToolTip(true);
        setToolTipState(PHONENUMBER_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidPhone) {
      setIsValid(true);
    }
  }, [number, isvalid]);

  const handleSendingOtpAndNavigate = async () => {
    const responseOpt = await sendOtp(number);
    if (!responseOpt) {
      handleError(ERROR_TWILIO_SERVER_ERROR);
      return;
    }
    setLoading(false);
    track(
      'PhoneStep',
      AnalyticVerb.Finished,
      login ? AnalyticCategory.Login : AnalyticCategory.Onboarding,
    );
    setPhone('+1' + number);
    navigation.navigate('PhoneVerification', {
      phone: number,
      login,
    });
  };

  const nextNavigate = async (): Promise<void> => {
    let isValidPhone: boolean = number.length === PHONE_NUMBER_LENGTH;
    if (!isValidPhone) {
      setIsValid(true);
      return;
    }
    setLoading(true);

    const status = await getPhoneStatus('+1' + number);
    switch (status) {
      case PhoneStatusType.AVAILABLE:
        if (login) {
          handleError('Number not registered');
        } else {
          handleSendingOtpAndNavigate();
        }
        break;
      case PhoneStatusType.REGISTERED:
        if (login) {
          handleSendingOtpAndNavigate();
        } else {
          handleError('Number is already registered');
        }
        break;
      case PhoneStatusType.ON_WAITLIST:
        handleError('Number is already on waitlist');
        break;
      case PhoneStatusType.INVALID_FORMAT:
        handleError('Invalid number format');
        break;
      default:
        handleError('Something went wrong');
        break;
    }
  };

  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      {loading && <TaggLoadingIndicator fullscreen />}
      <KeyboardAvoidingView
        behavior={Behavior(Platform.OS)}
        keyboardVerticalOffset={-(SCREEN_HEIGHT * KEYBOARD_VERTICLEHEIGHT)}
        style={onBoardingStyles.container}>
        <View style={onBoardingStyles.leftArrow}>
          <ArrowButton
            style={onBoardingStyles.backArrow}
            direction={ARROW_DIRECTION}
            onboarding={true}
            onPress={() => {
              navigation.goBack();
              track(
                'PhoneStep',
                AnalyticVerb.Canceled,
                login ? AnalyticCategory.Login : AnalyticCategory.Onboarding,
              );
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{PHONENUMBER_TITLE}</Text>
        </View>

        <View style={onBoardingStyles.formContainer}>
          <View style={onBoardingStyles.iconContainer}>
            <TextInputMask
              style={onBoardingStyles.input}
              onChangeText={(formatted, extracted) => {
                setNumber(extracted || '');
              }}
              placeholderTextColor={PLACEHOLDER_COLOR}
              blurOnSubmit={false}
              autoFocus={true}
              selectionColor={SELECTIONCOLOR}
              value={number}
              onSubmitEditing={Keyboard.dismiss}
              placeholder={PHONENUMBER_PLACEHOLDER}
              mask={PHONENUMBER_MASKSTRING}
              keyboardType={PHONENUMBER_KEYBOARD_TYPE}
            />
            {toolTip && <CustomToolTip toolTipText={toolTipState} />}
            {isvalid === true && (
              <View style={onBoardingStyles.imageView}>
                <Image
                  source={toolTip ? Images.SignUp.RedCross : Images.SignUp.GreenCheck}
                  style={onBoardingStyles.imageStyle}
                />
              </View>
            )}
          </View>
          <Button
            disabled={!(isvalid && !toolTip)}
            labelStyle={onBoardingStyles.labelStyle}
            onPress={nextNavigate}
            style={onBoardingStyles.buttonConainer}
            title={VERIFY}
            buttonStyle={[
              onBoardingStyles.nextButtonStyle,
              { backgroundColor: isvalid && !toolTip ? WHITE : LIGHT_BLUE },
            ]}
          />
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Phone;
