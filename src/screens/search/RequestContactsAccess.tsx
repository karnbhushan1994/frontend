import * as React from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Modal, StyleSheet, View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';

import { checkPermission, requestPermission } from 'react-native-contacts';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from 'assets/images';
import { BackgroundGradientType } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';
import logger from 'utils/logger';

import { BACKGROUND_GRADIENT_MAP } from '../../constants';

const RequestContactsAccess: React.FC = () => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = React.useState(true);
  const handleAllowAccess = async () => {
    try {
      let permission = await checkPermission();
      if (permission === 'undefined') {
        await requestPermission();
      }
      await AsyncStorage.setItem('respondedToAccessContacts', 'true');
      navigation.navigate('DiscoverMoments');
    } catch (err) {
      logger.log('Unable to check and request permission to get access to user contacts');
    }
    setVisible(false);
  };

  const handleDontAllowAccess = async () => {
    try {
      await AsyncStorage.setItem('respondedToAccessContacts', 'true');
      navigation.navigate('DiscoverMoments');
    } catch (err) {
      logger.log('Unable to check and request permission to get access to user contacts');
    }
    setVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={() => {}}>
      <LinearGradient
        colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Light]}
        useAngle={true}
        angle={154.72}
        angleCenter={{ x: 0.5, y: 0.5 }}
        style={styles.flex}>
        <SafeAreaView>
          <View style={{ height: SCREEN_HEIGHT }}>
            <Animated.ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={isIPhoneX() ? false : true}>
              <StatusBar barStyle="light-content" translucent={false} />
              <View style={styles.mainContainer}>
                <Image source={images.findFriends.findFriend} style={styles.image} />
                <Text style={styles.title}>FIND FRIENDS!</Text>
                <Text style={styles.subtext}>
                  This is so you can find your friends already on here! Isn’t a party better when
                  your favorite people are there?
                </Text>
                <View style={styles.bulletPointView}>
                  <Image source={images.findFriends.lock} style={styles.icon} />
                  <Text style={styles.bulletPointText}>Always Stays Private</Text>
                </View>
                <View style={styles.bulletPointView}>
                  <Image source={images.findFriends.phoneCross} style={styles.icon} />
                  <Text style={styles.bulletPointText}>We wouldn’t dare send any messages</Text>
                </View>
                <TouchableOpacity onPress={handleAllowAccess} style={styles.allowButton}>
                  <Text style={styles.allowButtonLabel}>Allow Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Don't allow button"
                  style={styles.dontAllowButton}
                  onPress={handleDontAllowAccess}>
                  <Text style={styles.dontAllowButtonText}>Don’t Allow</Text>
                </TouchableOpacity>
              </View>
            </Animated.ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    marginBottom: '15%',
  },
  image: {
    marginBottom: '2%',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.49,
  },
  title: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: normalize(28),
    lineHeight: normalize(35),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '2%',
  },
  subtext: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: normalize(16),
    lineHeight: normalize(25),
    fontWeight: '600',
    textAlign: 'center',
    width: '83%',
    height: '15%',
  },
  bulletPointView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.55,
    marginBottom: '7%',
  },
  icon: {
    margin: '1%',
    width: normalize(38),
    height: normalize(38),
    alignSelf: 'flex-start',
  },
  bulletPointText: {
    color: '#fff',
    fontSize: normalize(15),
    fontWeight: '500',
    lineHeight: normalize(20),
    alignSelf: 'center',
    width: '75%',
    textAlign: 'center',
  },
  allowButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '41.5%',
    height: '6%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: '8%',
    marginBottom: '3%',
  },
  allowButtonLabel: {
    fontSize: normalize(17),
    fontWeight: '600',
    lineHeight: normalize(20.29),
    color: '#3C4461',
  },
  dontAllowButton: {
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  dontAllowButtonText: {
    fontSize: normalize(15),
    fontWeight: '500',
    lineHeight: normalize(20),
    color: '#fff',
  },
  flex: {
    flex: 1,
  },
});
export default RequestContactsAccess;
