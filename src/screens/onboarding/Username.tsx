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
  ARROW_DIRECTION,
  AUTOCAPITALIZE,
  KEYBOARD_VERTICLEHEIGHT,
  NAME,
  PLACEHOLDER_COLOR,
  RETURNKEY,
  SELECTIONCOLOR,
  SIGNUP,
  USERNAME,
  usernameRegex,
  USERNAME_TOOLTIP,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { validateOnboardingInfo } from '../../services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type UsernameNavigationProps = StackNavigationProp<OnboardingStackParams, 'Username'>;

interface UsernameProps {
  navigation: UsernameNavigationProps;
}

const Username: React.FC<UsernameProps> = ({ navigation }: UsernameProps): React.ReactElement => {
  const [attemptedSubmit] = useState<boolean>(false);
  const [valid] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [isvalid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUsername } = useContext(OnboardingContext);

  useEffect(() => {
    let isValidName: boolean = usernameRegex.test(value);
    if (isvalid) {
      if (isValidName === false) {
        setToolTip(true);
        setToolTipState(USERNAME_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidName) {
      setIsValid(true);
    }
  }, [value, isvalid]);

  const nextNavigate = async () => {
    let isValidName: boolean = usernameRegex.test(value);
    if (!isValidName) {
      setIsValid(true);
      return;
    }
    setLoading(true);
    const success = await validateOnboardingInfo({
      username: value,
    });
    setLoading(false);
    if (!success) {
      setToolTip(true);
      setToolTipState('Username already exists');
      return;
    }
    setUsername(value);
    track('UsernameStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
    //navigation.navigate('Password');
    navigation.navigate('Gender');
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
              track('UsernameStep', AnalyticVerb.Canceled, AnalyticCategory.Onboarding);
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{SIGNUP}</Text>
        </View>

        <View style={onBoardingStyles.formContainer}>
          <TaggInput
            placeholder={USERNAME}
            autoCompleteType={NAME}
            autoCapitalize={AUTOCAPITALIZE}
            placeholderTextColor={PLACEHOLDER_COLOR}
            textContentType={NAME}
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setValue}
            onSubmitEditing={nextNavigate}
            value={value}
            autoFocus={true}
            blurOnSubmit={false}
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

export default Username;
