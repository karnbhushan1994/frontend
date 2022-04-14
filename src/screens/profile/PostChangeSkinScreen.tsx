import React, { useContext } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp, useNavigation } from '@react-navigation/core';
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import { useDispatch, useSelector } from 'react-redux';

import { Images } from 'assets';

import { MainStackParams } from 'routes';
import { getSkinCount } from 'services';
import { RootState } from 'store/rootReducer';

import { loadUserProfileInfo, updateUserSkin } from '../../store/actions';
import { ProfileContext } from './ProfileScreen';

type SelectedSkinRouteProps = RouteProp<MainStackParams, 'SelectedSkin'>;

interface SelectedSkinProps {
  route: SelectedSkinRouteProps;
}

const PostChangeSkinScreen: React.FC<SelectedSkinProps> = ({ route }) => {
  const navigation = useNavigation();
  const { name, primaryColor, secondaryColor } = route.params;
  const { userXId } = useContext(ProfileContext);
  const userId = useSelector((state: RootState) => (userXId ? '' : state.user.user.userId));
  const dispatch = useDispatch();

  const changeSkin = async () => {
    Promise.all([
      dispatch(updateUserSkin(name, primaryColor, secondaryColor)),
      dispatch(loadUserProfileInfo(userId)),
    ]);
    setTimeout(() => {
      navigation.navigate('Profile', { showShareModalParm: false });
      renderRateMe();
    }, 1500);
  };

  React.useEffect(() => {
    changeSkin();
  });

  const getToken = async () => {
    if (userId) {
      const token = await AsyncStorage.getItem('token');
      return token;
    }
    return '';
  };

  const helperSkinCount = async (token: string | null) => {
    if (userId && token !== null) {
      const count = await getSkinCount(userId, token);
      return count;
    }
  };

  const renderRateMe = async () => {
    const token = await getToken();
    const count = await helperSkinCount(token);
    if (count === 2) {
      if (InAppReview.isAvailable()) {
        InAppReview.RequestInAppReview()
          .then(hasFlowFinishedSuccessfully => {
            if (hasFlowFinishedSuccessfully) {
              console.log(
                'InAppReview in ios has launched successfully',
                hasFlowFinishedSuccessfully,
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={Images.Onboarding.ConfettiBackground} style={styles.imageBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>Give us a sec!</Text>
          <Text style={styles.subtitle}>We are building your profile</Text>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // flex: 1,
    height: '85%',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '800',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
});

export default PostChangeSkinScreen;
