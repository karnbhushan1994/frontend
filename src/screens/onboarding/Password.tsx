import React, { useContext, useEffect, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';

import { Images } from '../../assets';
import { ArrowButton, Background, CustomToolTip, TaggInput } from '../../components';
import {
  ARROW_DIRECTION,
  HIDE_PASSWORD,
  KEYBOARD_VERTICLEHEIGHT,
  PASSWORD,
  passwordRegex,
  PASSWORD_AUTOCOMPLETE,
  PASSWORD_CONTENTTYPE,
  PASSWORD_TOOLTIP,
  PLACEHOLDER_COLOR,
  RETURNKEY,
  SELECTIONCOLOR,
  SHOW_PASSWORD,
  SIGNUP,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type PasswordNavigationProps = StackNavigationProp<OnboardingStackParams, 'Password'>;

interface PasswordProps {
  navigation: PasswordNavigationProps;
}

const Password: React.FC<PasswordProps> = ({ navigation }: PasswordProps): React.ReactElement => {
  const [attemptedSubmit] = useState<boolean>(false);
  const [valid] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [passVisibility, setPassVisibility] = useState<boolean>(false);
  const [isvalid, setIsValid] = useState<boolean>(false);
  const { setPassword } = useContext(OnboardingContext);

  useEffect(() => {
    let isValidPassword: boolean = passwordRegex.test(value);
    if (isvalid) {
      if (isValidPassword === false) {
        setToolTip(true);
        setToolTipState(PASSWORD_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidPassword) {
      setIsValid(true);
    }
  }, [value, isvalid]);

  const nextNavigate = (): void => {
    let isValidPassword: boolean = passwordRegex.test(value);
    if (!isValidPassword) {
      setIsValid(true);
      return;
    }
    setPassword(value);
    track('PasswordStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
    navigation.navigate('Email');
  };

  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
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
              track('PasswordStep', AnalyticVerb.Canceled, AnalyticCategory.Onboarding);
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{SIGNUP}</Text>
        </View>

        <View style={onBoardingStyles.formContainer}>
          <TaggInput
            placeholder={PASSWORD}
            placeholderTextColor={PLACEHOLDER_COLOR}
            autoCompleteType={PASSWORD_AUTOCOMPLETE}
            textContentType={PASSWORD_CONTENTTYPE}
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setValue}
            onSubmitEditing={nextNavigate}
            blurOnSubmit={false}
            autoFocus={true}
            secureTextEntry={!passVisibility}
            valid={valid}
            externalStyles={{
              warning: onBoardingStyles.passWarning,
            }}
            value={value}
            attemptedSubmit={attemptedSubmit}
            image={isvalid ? (toolTip ? Images.SignUp.RedCross : Images.SignUp.GreenCheck) : null}
          />
          {toolTip && <CustomToolTip toolTipText={toolTipState} />}
          <TouchableOpacity
            style={onBoardingStyles.showPassContainer}
            onPress={() => setPassVisibility(!passVisibility)}>
            {toolTip === false ? (
              <Text style={onBoardingStyles.showPass}>
                {passVisibility ? HIDE_PASSWORD : SHOW_PASSWORD}
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Password;
