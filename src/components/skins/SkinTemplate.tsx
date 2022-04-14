import React from 'react';

import { useNavigation } from '@react-navigation/core';

import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';

import { TemplateEnumType } from '../../types';

interface SkinTemplateProps {
  name: TemplateEnumType;
  displayName: string;
  demoPicture: string;
  primaryColor: string;
  secondaryColor: string;
}

const SkinTemplate: React.FC<SkinTemplateProps> = ({
  name,
  displayName,
  demoPicture,
  primaryColor,
  secondaryColor,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('SelectedSkin', {
          name,
          displayName,
          demoPicture,
          primaryColor,
          secondaryColor,
        });
      }}>
      <Image source={demoPicture} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.name}>{displayName}</Text>
      <ButtonWithGradientBackground title={'Change'} onPress={() => console.log('')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    // alignItems: 'center',
    // width: 200,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#fff',
  },
  image: {
    width: 150,
    height: 300,
    resizeMode: 'contain',
  },
});

export default SkinTemplate;
