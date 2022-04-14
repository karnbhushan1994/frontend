import React, { FC, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { human, systemWeights } from 'react-native-typography';

import GradientText from 'components/GradientText';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { gradientColorFormation, normalize } from 'utils';

interface BioTemplateFourTyep {
  disable: boolean;
  biography: string;
  bioTextColor: string;
}
const BioTemplateFour: FC<BioTemplateFourTyep> = ({ biography, bioTextColor, disable }) => {
  const navigation = useNavigation();
  const { ownProfile } = useContext(ProfileContext);
  return biography ? (
    <TouchableOpacity disabled={disable} onPress={() => navigation.navigate('EditBioTemplate')}>
      <GradientText colors={gradientColorFormation(bioTextColor)} style={[styles.bio]}>
        {biography}
      </GradientText>
    </TouchableOpacity>
  ) : ownProfile ? (
    <TouchableOpacity disabled={disable} onPress={() => navigation.navigate('EditBioTemplate')}>
      <GradientText colors={gradientColorFormation(bioTextColor)} style={[styles.bio]}>
        Add a Bio +
      </GradientText>
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  bio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
    textAlign: 'center',
  },
  gradientStyle: {
    borderRadius: normalize(5),
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default BioTemplateFour;
