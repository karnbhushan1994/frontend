import React, { useContext, useEffect, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { Images } from '../../assets';
import { ArrowButton, Background, CustomToolTip, TaggInput } from '../../components';
import {
  ARROW_DIRECTION,
  AUTOCAPITALIZE,
  FULLNAME,
  fullNameRegex,
  KEYBOARD_VERTICLEHEIGHT,
  NAME,
  PLACEHOLDER_COLOR,
  RETURNKEY,
  SELECTIONCOLOR,
  SIGNUP,
  SIGNUP_TOOLTIP,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type SignupNavigationProps = StackNavigationProp<OnboardingStackParams, 'Signup'>;

interface SignupProps {
  navigation: SignupNavigationProps;
}

const Signup: React.FC<SignupProps> = ({ navigation }: SignupProps): React.ReactElement => {
  const [attemptedSubmit] = useState<boolean>(false);
  const [valid] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const { setFirstName, setLastName } = useContext(OnboardingContext);

  useEffect(() => {
    let isValidName: boolean = fullNameRegex.test(fullName);
    if (isValid) {
      if (isValidName === false) {
        setToolTip(true);
        setToolTipState(SIGNUP_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidName) {
      setIsValid(true);
    }
  }, [fullName, isValid]);

  const nextNavigate = (): void => {
    let isValidName: boolean = fullNameRegex.test(fullName);
    if (!isValidName) {
      setIsValid(true);
      return;
    }
    const firstName = fullName.split(' ')[0].trim();
    const lastName = fullName.slice(firstName.length + 1).trim();
    setFirstName(firstName);
    setLastName(lastName);
    track('OnboardingFullName', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
    navigation.navigate('Username');
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
              track('FirstNameStep', AnalyticVerb.Canceled, AnalyticCategory.Onboarding);
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{SIGNUP}</Text>
        </View>

        <View style={onBoardingStyles.formContainer}>
          <TaggInput
            placeholder={FULLNAME}
            placeholderTextColor={PLACEHOLDER_COLOR}
            autoCompleteType={NAME}
            autoCapitalize={AUTOCAPITALIZE}
            textContentType={NAME}
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setFullName}
            onSubmitEditing={nextNavigate}
            value={fullName}
            autoFocus={true}
            blurOnSubmit={false}
            externalStyles={{
              warning: onBoardingStyles.passWarning,
            }}
            valid={valid}
            attemptedSubmit={attemptedSubmit}
            image={isValid ? (toolTip ? Images.SignUp.RedCross : Images.SignUp.GreenCheck) : null}
          />
          {toolTip && <CustomToolTip toolTipText={toolTipState} />}
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default Signup;
