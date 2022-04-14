import React from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { Image, StyleSheet, Text, TouchableOpacity, Modal, View, ScrollView } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import VersionInfo from 'react-native-version-info';

import { normalize, SCREEN_WIDTH, StatusBarHeight } from 'utils';

import { BACKGROUND_GRADIENT_MAP } from '../../constants';

const items = [
  {
    image: require('../../assets/images/Graphic1.png'),
    title: 'Analytics',
    description:
      'Check it out in settings! These insights display your profiles overall reach, engagement, and growth. Here you can keep track of your account.',
  },
  {
    image: require('../../assets/images/Graphic2.png'),
    title: 'Fonts',
    description:
      'Check it out in Edit Tagg! Customize the font color and typography on your taggs and profile page.',
  },
];

const AppUpdateComponent: React.FC = () => {
  const cantainerHeight = normalize(121);
  const [visible, setVisible] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const checkStorage = async () => {
    const appVersion = await AsyncStorage.getItem('appVersion');

    if (appVersion !== VersionInfo.appVersion) {
      setTimeout(() => {
        setShowPopup(true);
      }, 500);
      setVisible(false);
    }
  };

  React.useEffect(() => {
    checkStorage();
  }, []);

  if (false && showPopup) {
    return (
      <LinearGradient colors={BACKGROUND_GRADIENT_MAP[0]} style={styles.linearGradient}>
        <View style={[styles.background]}>
          <View style={[styles.row, { height: StatusBarHeight + cantainerHeight }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/main/green_logo.png')}
                style={styles.logo}
              />
            </View>
            <View style={[styles.container, styles.rightSection]}>
              <Text style={styles.text}>
                Tagg just got better! See what's new in our latest update.
              </Text>
              <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
                <Text style={styles.buttonFont}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal visible={visible} animationType={'slide'} transparent presentationStyle="fullScreen">
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                setShowPopup(false);
              }}
              style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
            <Text style={styles.title}>What's New</Text>
            <ScrollView style={styles.scrollView}>
              {items.map((item, index) => (
                <View style={styles.viewInsideScrollView} key={index}>
                  <Image source={item.image} style={styles.imageInScrollView} />
                  <Text style={styles.titleInScrollView}>{item.title}</Text>
                  <Text style={styles.descriptionInScrollView}>{item.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </LinearGradient>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  viewInsideScrollView: { paddingHorizontal: 30 },
  descriptionInScrollView: { fontSize: 18, fontWeight: '600', color: 'grey' },
  titleInScrollView: { fontSize: 21, fontWeight: '700', marginBottom: 10 },
  imageInScrollView: { width: '100%', resizeMode: 'contain', marginVertical: -20 },
  scrollView: { marginHorizontal: -30 },
  doneText: { fontWeight: '700', color: '#6992DA', fontSize: 19 },
  title: { textAlign: 'center', fontWeight: '700', fontSize: 19 },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  doneButton: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
    left: 0,
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  logo: { width: 40, height: 40, margin: 20 },
  logoContainer: { justifyContent: 'center' },
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: { flex: 1, marginRight: 20 },
  buttonFont: { fontSize: 15, fontWeight: '700', color: '#212121' },
  container: {
    justifyContent: 'center',
    marginTop: StatusBarHeight,
  },
  text: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    marginTop: 12,
    color: '#fff',
  },
  linearGradient: {
    width: '100%',
    height: 200,
    position: 'absolute',
    zIndex: 999,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  bar: {
    width: SCREEN_WIDTH * 0.9,
  },
  redBackground: {
    backgroundColor: '#EA574C',
  },
  row: { flexDirection: 'row' },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  whiteText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
  },
  x: {
    width: normalize(26),
    height: normalize(26),
    marginRight: 10,
  },
  retryButton: {
    backgroundColor: '#A2352C',
    borderRadius: 6,
    height: normalize(37),
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: normalize(15),
  },
});

export default AppUpdateComponent;
