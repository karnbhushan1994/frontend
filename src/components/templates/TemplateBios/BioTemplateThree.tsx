import React, { FC, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { human, systemWeights } from 'react-native-typography';

import GradientText from 'components/GradientText';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation } from 'utils';

const BioTemplateThree: FC = ({}) => {
  const { secondaryColor } = useContext(ProfileContext);
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
        <GradientText colors={gradientColorFormation(secondaryColor)} style={[styles.bio]}>
          Add a Bio +
        </GradientText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
  },
});

export default BioTemplateThree;
