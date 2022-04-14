import React, { useEffect } from 'react';

import { RouteProp, useNavigation } from '@react-navigation/core';

import { Alert, Image, StatusBar, StyleSheet, View } from 'react-native';

import { Background } from 'components';
import { ButtonWithGradientBackground } from 'components/widgets/buttonWithGradientBackground';
import { headerBarOptions, MainStackParams } from 'routes';

import { BackgroundGradientType } from 'types';

type SelectedSkinRouteProps = RouteProp<MainStackParams, 'SelectedSkin'>;

interface SelectedSkinProps {
  route: SelectedSkinRouteProps;
}

const SelectedSkinScreen: React.FC<SelectedSkinProps> = ({ route }) => {
  const navigation = useNavigation();
  const { name, displayName, demoPicture, primaryColor, secondaryColor } = route.params;

  useEffect(() => {
    navigation.setOptions({
      ...headerBarOptions('white', displayName),
    });
  }, []);

  const handleChange = () => {
    Alert.alert(
      'Are you sure you want to change this?',
      'Your last skin will be archived',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.navigate('PostChangeSkinScreen', {
              name,
              demoPicture,
              primaryColor,
              secondaryColor,
            });
          },
        },
      ],
      { cancelable: true },
    );
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Dark}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <ButtonWithGradientBackground title={'Change'} onPress={handleChange} />
          </View>
          <View style={styles.imageContainer}>
            <Image source={demoPicture} style={styles.image} />
          </View>
        </View>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: '85%',
  },
  subtitle: {
    color: '#fff',
  },
  buttonContainer: {
    width: 100,
    marginVertical: 20,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
    aspectRatio: 1,
    flex: 1,
  },
});

export default SelectedSkinScreen;
