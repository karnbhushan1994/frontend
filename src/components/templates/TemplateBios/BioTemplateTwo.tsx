import React, { FC, useContext } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { human, systemWeights } from 'react-native-typography';
import { useSelector } from 'react-redux';

import { ProfileContext } from 'screens/profile/ProfileScreen';
import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types';
import { normalize } from 'utils';

interface BioTemplateTwoType {
  disable: boolean;
  userXId: string | undefined;
  screenType: ScreenType;
  biography: string;
  bioTextColor?: string;
  containerStyle?: ViewStyle;
}

const BioTemplateTwo: FC<BioTemplateTwoType> = ({
  disable,
  userXId,
  screenType,
  biography,
  bioTextColor,
  containerStyle,
}) => {
  const navigation = useNavigation();

  const {
    skin: { secondary_color: secondaryColor },
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId].profileTemplate
      : state.user.profileTemplate,
  );

  const { ownProfile } = useContext(ProfileContext);

  return (
    <View style={[styles.bioContainer, containerStyle]}>
      {biography ? (
        <TouchableOpacity disabled={disable} onPress={() => navigation.navigate('EditBioTemplate')}>
          <Text numberOfLines={10} style={[styles.bio, { color: bioTextColor }]}>
            {biography}
          </Text>
        </TouchableOpacity>
      ) : ownProfile ? (
        <TouchableOpacity disabled={disable} onPress={() => navigation.navigate('EditBioTemplate')}>
          <Text style={[styles.bio, { color: secondaryColor }]}>Add a Bio +</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bioContainer: {
    width: '100%',
    marginBottom: 15,
    justifyContent: 'center',
    paddingVertical: '1%',
  },
  bio: {
    color: 'black',
    fontWeight: '600',
    fontSize: normalize(13),
    lineHeight: normalize(18),
  },
  addBio: {
    ...human.bodyObject,
    ...systemWeights.semibold,
    marginTop: 10,
  },
});

export default BioTemplateTwo;
