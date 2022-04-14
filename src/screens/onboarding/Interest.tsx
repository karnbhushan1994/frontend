import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';

import { Images } from '../../assets';
import { Background, InterestList } from '../../components';
import Button from '../../components/button';
import {
  INTERESTS,
  INTEREST_END_INDEX,
  INTEREST_MAX_LENGTH,
  INTEREST_MIN_LENGTH,
  INTEREST_START_INDEX,
  INTEREST_SUB_TITLE,
  INTEREST_TITLE,
  LIGHT_GREEN,
  LIGHT_PURPLE_WHITE,
  LIGTH_GREEN,
  NEXT,
  SHOW_ALL,
  SHOW_LESS,
  WHITE,
} from '../../constants';
import { OnboardingStackParams } from '../../routes';
import { BackgroundGradientType } from '../../types';
import { normalize, updateFilterArray } from '../../utils';
import { onBoardingStyles } from './Styles';

type InterestNavigationProps = StackNavigationProp<OnboardingStackParams, 'Interest'>;

interface InterestProps {
  navigation: InterestNavigationProps;
}

const Interest: React.FC<InterestProps> = ({}: InterestProps): React.ReactElement => {
  const [selectedInterest, setSelctedInteres] = useState<string[]>([]);
  const [minimize, setMinimize] = useState<boolean>(false);
  const navigation = useNavigation();
  const onChange = (interest: string): void =>
    setSelctedInteres(updateFilterArray(selectedInterest, interest, INTEREST_MAX_LENGTH));
  const checkMinimumSelectedInterests = (): boolean =>
    selectedInterest.length < INTEREST_MIN_LENGTH;
  const handleNavigate = async () => {
    navigation.navigate('BuildProfile', { interests: selectedInterest });
  };
  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      <View style={styles.container}>
        <Text style={styles.title}>{INTEREST_TITLE}</Text>
        <Text style={styles.subTitle}>{INTEREST_SUB_TITLE}</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.interests}>
            <InterestList
              interests={INTERESTS}
              enableMaximizeButton={true}
              showMinimize={minimize}
              startIndex={INTEREST_START_INDEX}
              lastIndex={minimize ? INTERESTS.length : INTEREST_END_INDEX}
              minimizeLabel={minimize ? SHOW_LESS : SHOW_ALL}
              interestIcons={Images.Interest}
              selectedInterests={selectedInterest}
              onChange={onChange}
              onMinimize={setMinimize}
            />
          </View>
        </ScrollView>
        <Button
          disabled={checkMinimumSelectedInterests()}
          onPress={handleNavigate}
          title={NEXT}
          style={styles.button}
          labelStyle={checkMinimumSelectedInterests() && styles.disableLabel}
          buttonStyle={[styles.label, checkMinimumSelectedInterests() && styles.disableButton]}
        />
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  title: { color: WHITE, fontWeight: 'bold', fontSize: normalize(34) },
  container: { padding: normalize(15) },
  subTitle: {
    fontWeight: '600',
    color: LIGHT_PURPLE_WHITE,
    fontSize: normalize(18),
    marginTop: normalize(10),
  },
  interests: { flexDirection: 'row', flexWrap: 'wrap', marginTop: normalize(20) },
  scrollView: { height: '60%', marginTop: normalize(20) },
  button: { width: '40%', alignSelf: 'center', marginTop: normalize(40) },
  disableLabel: { color: LIGHT_GREEN },
  label: { width: '100%', borderRadius: 5 },
  disableButton: { backgroundColor: LIGTH_GREEN },
});

export default Interest;
