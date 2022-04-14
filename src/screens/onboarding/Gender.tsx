import React, { useContext, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';

import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

import { DropDown } from 'components/common/DropDown';

import { ArrowButton, Background, TaggLoadingIndicator } from '../../components';

import { ARROW_DIRECTION, KEYBOARD_VERTICLEHEIGHT, SIGNUP } from '../../constants';

import { OnboardingContext, OnboardingStackParams } from '../../routes';

import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';

import { SCREEN_HEIGHT, track } from '../../utils';

import { Behavior } from '../../utils/helper';

import { onBoardingStyles } from './Styles';

type GenderNavigationProps = StackNavigationProp<OnboardingStackParams, 'Gender'>;

interface GenderProps {
  navigation: GenderNavigationProps;
}
let genderOption = [
  { id: 1, gender: 'Female' },
  { id: 2, gender: 'Male' },
  { id: 3, gender: 'Non Binary' },
];

const Gender: React.FC<GenderProps> = ({ navigation }: GenderProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [genderState, setGenderState] = useState<any>('');

  const { setGender } = useContext(OnboardingContext);

  const onSelect = item => {
    setLoading(false);
    setGenderState(item);
    setGender(item.gender);
  };
  const onPressNext = () => {
    if (genderState) {
      navigation.navigate('Age');
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
              track('UsernameStep', AnalyticVerb.Canceled, AnalyticCategory.Onboarding);
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{SIGNUP}</Text>
        </View>
        <View style={onBoardingStyles.BirthdayContainer}>
          <DropDown genderOption={genderOption} value={genderState} onSelect={onSelect} />
          {/* {toolTip && <CustomToolTip toolTipText={toolTipState} />} */}
        </View>
        {!!genderState && (
          <View style={onBoardingStyles.nextBtnContainer}>
            <Pressable onPress={onPressNext} style={onBoardingStyles.nextBtn}>
              <Text style={onBoardingStyles.nextBtnText}>Next</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </Background>
  );
};
export default Gender;
