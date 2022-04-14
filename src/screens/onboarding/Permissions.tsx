import React, { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { View } from 'react-native-animatable';

import {
  request,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
  openSettings,
  checkMultiple,
  checkNotifications,
} from 'react-native-permissions';

import { images } from 'assets/images';

import { postPermissionToStatusBackend } from 'services';

import { Background } from '../../components';

import Button from '../../components/button';

import {
  ALLOW_PERMISSION_MESSAGE,
  LIGHT_GREEN,
  LIGHT_PURPLE_WHITE,
  LIGTH_GREEN,
  NEXT,
  PERMISSIONSTEXT,
  TAGG_LIGHT_BLUE,
  WHITE,
} from '../../constants';
import { OnboardingStackParams } from '../../routes';

import { BackgroundGradientType } from '../../types';

import { normalize, SCREEN_WIDTH } from '../../utils';

import { onBoardingStyles } from './Styles';

type PermissionsNavigationProps = StackNavigationProp<OnboardingStackParams, 'Permissions'>;

interface PermissionProps {
  navigation: PermissionsNavigationProps;
}
let permissionArray = [
  {
    id: 1,
    icon: images.main.notification,
    title: 'Notifications',
    subTitle: 'So you know how link-in-bio profile is doing',
    isSelected: false,
    modalMessage: 'Tagg Would Like to Send You Notifications',
    modalSubtitle: 'Enable access to notifications so you can stay updated!',
  },
  {
    id: 2,
    icon: images.main.location,
    title: 'Location',
    subTitle: 'So we can show you creators in your community to connect with',
    isSelected: false,
    modalMessage: 'Tagg Would Like to Access Location',
    modalSubtitle: 'Enable access to location so you can stay updated!',
  },
  {
    id: 3,
    icon: images.main.contact,
    title: 'Contacts',
    subTitle: 'Keep connected with your profile',
    isSelected: false,
    modalMessage: 'Tagg Would Like to Your Contacts',
    modalSubtitle: 'Enable access to contacts so you can stay updated!',
  },
];

const Permissions: React.FC<PermissionProps> = ({}: PermissionProps): React.ReactElement => {
  const [isSelectedNotification, setIsSelectedNotification] = useState(false);
  const [isSelectedLocation, setIsSelectedLocation] = useState(false);
  const [isSelectedContacts, setIsSelectedContacts] = useState(false);
  const navigation = useNavigation();
  const handleNavigate = async () => {
    const isbackToProfile = await AsyncStorage.getItem('backToProfile');
    const request = new FormData();
    request.append('notification', 5);
    request.append('location', 5);
    request.append('contact', 5);
    const res = await postPermissionToStatusBackend(request);
    if (res.permission_status) {
      if (isbackToProfile) {
        AsyncStorage.removeItem('backToProfile');
        navigation.goBack();
      } else {
        AsyncStorage.removeItem('backToProfile');
        navigation.navigate('Interest');
      }
    } else {
      console.log(res);
    }
  };
  const openSetting = () => {
    openSettings().catch(() => console.warn('cannot open settings'));
  };
  const checkPermission = () => {
    checkMultiple([PERMISSIONS.IOS.CONTACTS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]).then(
      statuses => {
        if (statuses[PERMISSIONS.IOS.CONTACTS] == 'granted') {
          // permissationArr[2].isSelected = true;
          // setPermissationArr(permissationArr)
          setIsSelectedContacts(true);
        }
        if (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'granted') {
          // permissationArr[1].isSelected = true;
          // setPermissationArr(permissationArr)
          setIsSelectedLocation(true);
        }
      },
    );
    checkNotifications().then(({ status }) => {
      if (status == 'granted') {
        // permissationArr[0].isSelected = true;
        // setPermissationArr(permissationArr)
        setIsSelectedNotification(true);
      }
    });
  };
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
    }, [navigation]),
  );
  useEffect(() => {
    checkPermission();
  }, []);
  const onpressPermissionNotification = () => {
    requestNotifications(['alert', 'sound']).then(({ status }) => {
      if (status == 'granted') {
        setIsSelectedNotification(true);
      } else {
        openSetting();
      }
    });
  };
  const onpressPermissionLocation = () => {
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            // openSetting()
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            //openSetting()
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setIsSelectedLocation(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            openSetting();
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const onpressPermissionContacts = () => {
    request(PERMISSIONS.IOS.CONTACTS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            //openSetting()
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            //openSetting()
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setIsSelectedContacts(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            openSetting();
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const checkIsDiasble = () => {
    if (isSelectedContacts && isSelectedLocation && isSelectedNotification) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.title}>{PERMISSIONSTEXT}</Text>
        <Text style={styles.subTitle}>{ALLOW_PERMISSION_MESSAGE}</Text>
        <View style={styles.mainView}>
          {/* <FlatList
            keyExtractor={(_, index) => index.toString()}
            extraData={permissationArr}
            data={permissationArr}
            renderItem={renderPermissions}
            scrollEnabled={false}
          /> */}
          <TouchableOpacity
            onPress={() => {
              onpressPermissionNotification();
            }}>
            <View style={styles.renderPermissionsView}>
              <Image source={permissionArray[0].icon} style={styles.notificationIcon} />
              <View style={styles.itemNotifi}>
                <Text style={styles.itemTitle}>{permissionArray[0].title}</Text>
                <Text style={styles.itemSubTitle}>{permissionArray[0].subTitle}</Text>
              </View>
              <View>
                {isSelectedNotification ? (
                  <Image source={images.main.radialchecked} style={styles.radioBtnIcon} />
                ) : (
                  <Image source={images.main.radialunchecked} style={styles.radioBtnIcon} />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onpressPermissionLocation();
            }}>
            <View style={styles.renderPermissionsView}>
              <Image source={permissionArray[1].icon} style={styles.notificationIcon} />
              <View style={styles.itemNotifi}>
                <Text style={styles.itemTitle}>{permissionArray[1].title}</Text>
                <Text style={styles.itemSubTitle}>{permissionArray[1].subTitle}</Text>
              </View>
              <View>
                {isSelectedLocation ? (
                  <Image source={images.main.radialchecked} style={styles.radioBtnIcon} />
                ) : (
                  <Image source={images.main.radialunchecked} style={styles.radioBtnIcon} />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onpressPermissionContacts();
            }}>
            <View style={styles.renderPermissionsView}>
              <Image source={permissionArray[2].icon} style={styles.notificationIcon} />
              <View style={styles.itemNotifi}>
                <Text style={styles.itemTitle}>{permissionArray[2].title}</Text>
                <Text style={styles.itemSubTitle}>{permissionArray[2].subTitle}</Text>
              </View>
              <View>
                {isSelectedContacts ? (
                  <Image source={images.main.radialchecked} style={styles.radioBtnIcon} />
                ) : (
                  <Image source={images.main.radialunchecked} style={styles.radioBtnIcon} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Button
          disabled={checkIsDiasble()}
          onPress={handleNavigate}
          title={NEXT}
          style={styles.button}
          //labelStyle={checkMinimumSelectedInterests()}
          buttonStyle={[styles.label, checkIsDiasble() && styles.disableButton]}
        />
      </ScrollView>
    </Background>
  );
};
const styles = StyleSheet.create({
  title: { color: WHITE, fontWeight: 'bold', fontSize: normalize(22) },
  container: {
    paddingTop: normalize(0),
    paddingLeft: normalize(15),
    paddingRight: normalize(15),
    marginTop: 40,
  },
  subTitle: {
    fontWeight: '400',
    color: LIGHT_PURPLE_WHITE,
    fontSize: normalize(14),
    marginTop: normalize(10),
  },
  interests: { flexDirection: 'row', flexWrap: 'wrap', marginTop: normalize(20) },
  scrollView: { height: '60%', marginTop: normalize(20) },
  button: { width: '40%', alignSelf: 'center', marginTop: normalize(30) },
  disableLabel: { color: LIGHT_GREEN },
  label: { width: '100%', borderRadius: 5 },
  disableButton: { backgroundColor: LIGTH_GREEN },
  notificationIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  renderPermissionsView: {
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    height: 100,
  },
  itemNotifi: {
    padding: 10,
    width: SCREEN_WIDTH / 1.5,
  },
  itemTitle: {
    color: 'white',
    fontSize: normalize(16),
    fontWeight: '700',
  },
  itemSubTitle: {
    color: 'white',
    fontSize: normalize(13),
    fontWeight: '400',
  },
  radioBtnIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  mainView: {
    marginTop: 50,
  },
  // modal style
  containerModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalBG: {
    backgroundColor: '#000',
    opacity: 0.3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modal: {
    position: 'absolute',
    width: '80%',
    zIndex: 1,
    opacity: 1,
  },
  infoBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 22,
    marginBottom: 4,
    borderRadius: 5,
    minHeight: 138,
  },
  buttonsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonModal: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    minHeight: 45,
  },
  leftButton: {
    marginRight: 4,
  },
  titleModal: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: '90%',
    alignSelf: 'center',
    marginBottom: 8,
  },
  subTitleModal: {
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: '86%',
    alignSelf: 'center',
    marginBottom: 8,
    color: '#989898',
  },
  delete: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: TAGG_LIGHT_BLUE,
  },
  cancel: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    color: TAGG_LIGHT_BLUE,
  },
  fatalistContainer: {
    justifyContent: 'space-between',
  },
  marginBottom: { marginBottom: 25 },
  dragging: {
    opacity: 0.2,
  },
  draggableItem: {},
});

export default Permissions;
