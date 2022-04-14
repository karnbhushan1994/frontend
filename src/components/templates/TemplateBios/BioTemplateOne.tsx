import React, { useContext, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import GradientText from 'components/GradientText';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { RootState } from 'store/rootReducer';
import { gradientColorFormation } from 'utils';

interface BioTemplateOneType {
  disable: boolean;
  biography: string;
  bioColorStart: string;
  bioColorEnd: string;
  bioTextColor: string;
}

const BioTemplateOne: React.FC<BioTemplateOneType> = ({
  disable,
  biography,
  bioColorStart,
  bioColorEnd,
  bioTextColor,
}) => {
  const navigation = useNavigation();
  const {
    skin: { primary_color: primaryColor },
  } = useSelector((state: RootState) => state.user.profileTemplate);

  const { ownProfile } = useContext(ProfileContext);

  const Bio = useMemo(
    () =>
      biography ? (
        <TouchableOpacity
          disabled={disable}
          style={styles.bioView}
          onPress={() => {
            navigation.navigate('EditBioTemplate');
          }}>
          <LinearGradient
            style={styles.gradientStyle}
            colors={[
              bioColorStart ? bioColorStart : '#808080',
              bioColorEnd ? bioColorEnd : '#808080',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}>
            <GradientText colors={gradientColorFormation(bioTextColor)} style={[styles.bioText]}>
              {biography}
            </GradientText>
          </LinearGradient>
        </TouchableOpacity>
      ) : ownProfile ? (
        <TouchableOpacity
          disabled={disable}
          style={[styles.bigButton]}
          onPress={() => navigation.navigate('EditBioTemplate')}>
          <GradientText
            colors={gradientColorFormation(primaryColor)}
            style={[styles.buttonBlackText]}>
            Add a Bio +
          </GradientText>
        </TouchableOpacity>
      ) : null,
    [biography, bioColorEnd, bioColorStart, bioTextColor],
  );

  return Bio;
};

const styles = StyleSheet.create({
  bioView: {
    marginBottom: 15,
    borderRadius: 5,
    width: '100%',
  },
  bioText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    fontSize: normalize(13),
    lineHeight: normalize(18),
  },
  bigButton: {
    width: '100%',
    height: 35,
    marginBottom: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#808080',
  },
  buttonBlackText: {
    color: 'black',
    fontWeight: '700',
  },
  gradientStyle: {
    borderRadius: normalize(5),
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default BioTemplateOne;
