import React, { useContext, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import { KeyboardAvoidingView, Platform, Pressable, Text, View, Image } from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { images } from 'assets/images';

import { ArrowButton, Background, CustomToolTip, TaggLoadingIndicator } from '../../components';

import { ARROW_DIRECTION, KEYBOARD_VERTICLEHEIGHT, SIGNUP } from '../../constants';

import { OnboardingContext, OnboardingStackParams } from '../../routes';

import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from '../../types';

import { SCREEN_HEIGHT, track } from '../../utils';

import { Behavior } from '../../utils/helper';

import { onBoardingStyles } from './Styles';

type UsernameNavigationProps = StackNavigationProp<OnboardingStackParams, 'Age'>;

interface AgeProps {
  navigation: UsernameNavigationProps;
}

const Age: React.FC<AgeProps> = ({ navigation }: AgeProps): React.ReactElement => {
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dob, setDob] = useState<any>('');

  const { setAge } = useContext(OnboardingContext);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setLoading(false);
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let d = moment(date).format('MM-DD-YYYY');
    let dif = moment().diff(moment(d, 'MM-DD-YYYY'), 'years');
    if (dif >= 13) {
      setAge(d);
      setToolTip(false);
      // good to go
      //navigation.navigate('Password');
    } else {
      setDob('');
      setToolTip(true);
      setToolTipState('You must be 13 years or older to join');
    }
    setDob(d);
    hideDatePicker();
  };
  const onPressNext = () => {
    if (!!dob && toolTip == false) {
      navigation.navigate('Email');
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
        <View style={onBoardingStyles.BirthdayContainer1}>
          <Pressable onPress={showDatePicker}>
            <View style={onBoardingStyles.birthDate}>
              <View>
                <Text style={onBoardingStyles.birthday}>{dob ? dob : 'Birthday'}</Text>
              </View>
              <View>
                <Text style={onBoardingStyles.birthday}>
                  {isDatePickerVisible ? (
                    <Image source={images.main.uparrow} style={onBoardingStyles.arrowImage} />
                  ) : (
                    <Image source={images.main.downarrow} style={onBoardingStyles.arrowImage} />
                  )}
                </Text>
              </View>
            </View>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          {toolTip && <CustomToolTip toolTipText={toolTipState} />}
        </View>
        {!!dob && toolTip == false && (
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
export default Age;
