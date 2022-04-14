import React, { useContext, useEffect, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { Images } from '../../assets';
import {
  ArrowButton,
  Background,
  CustomToolTip,
  TaggInput,
  TaggLoadingIndicator,
} from '../../components';
import {
  AUTOCAPITALIZE,
  emailRegex,
  EMAIL_AUTOCOMPLETE,
  EMAIL_CONTENTTYPE,
  EMAIL_KEYBOARDTYPE,
  EMAIL_PLACEHOLDER,
  EMAIL_TITLE,
  EMAIL_TOOLTIP,
  KEYBOARD_VERTICLEHEIGHT,
  PLACEHOLDER_COLOR,
  RETURNKEY,
  SELECTIONCOLOR,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { validateOnboardingInfo } from '../../services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type EmailNavigationProps = StackNavigationProp<OnboardingStackParams, 'Email'>;

interface EmailProps {
  navigation: EmailNavigationProps;
}

const Email: React.FC<EmailProps> = ({ navigation }: EmailProps): React.ReactElement => {
  const [value, setValue] = useState<string>('');
  const [attemptedSubmit] = useState<boolean>(false);
  const [valid] = useState<boolean>(false);
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [isvalid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setEmail } = useContext(OnboardingContext);

  useEffect(() => {
    let isValidEmail: boolean = emailRegex.test(value);
    if (isvalid) {
      if (isValidEmail === false) {
        setToolTip(true);
        setToolTipState(EMAIL_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidEmail) {
      setIsValid(true);
    }
  }, [value, isvalid]);

  const nextNavigate = async (): Promise<void> => {
    let isValidEmail: boolean = emailRegex.test(value);
    if (!isValidEmail) {
      setIsValid(true);
      return;
    }
    setLoading(true);
    const success = await validateOnboardingInfo({
      email: value,
    });
    setLoading(false);
    if (!success) {
      setToolTip(true);
      setToolTipState('Email already exists');
      return;
    }
    setEmail(value);
    track('EmailStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
    navigation.navigate('TiktokProfile');
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
            direction="backward"
            onboarding={true}
            onPress={() => {
              navigation.goBack();
              track('EmailStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{EMAIL_TITLE}</Text>
        </View>

        <View style={onBoardingStyles.formContainer}>
          <TaggInput
            placeholder={EMAIL_PLACEHOLDER}
            autoCompleteType={EMAIL_AUTOCOMPLETE}
            autoCapitalize={AUTOCAPITALIZE}
            textContentType={EMAIL_CONTENTTYPE}
            placeholderTextColor={PLACEHOLDER_COLOR}
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setValue}
            onSubmitEditing={nextNavigate}
            value={value}
            autoFocus={true}
            blurOnSubmit={false}
            keyboardType={EMAIL_KEYBOARDTYPE}
            externalStyles={{
              warning: onBoardingStyles.passWarning,
            }}
            valid={valid}
            attemptedSubmit={attemptedSubmit}
            image={isvalid ? (toolTip ? Images.SignUp.RedCross : Images.SignUp.GreenCheck) : null}
          />
          {toolTip && <CustomToolTip toolTipText={toolTipState} />}
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Email;
