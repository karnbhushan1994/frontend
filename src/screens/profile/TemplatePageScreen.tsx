import React, { FC, useContext, useMemo, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { MomentMoreInfoDrawer, MomentUploadProgressBar } from 'components';

import { MainStackParams } from 'routes';
import { IndividualMoment } from 'screens';
import { loadUserMoments } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types';
import { isIPhoneX, normalize, SCREEN_WIDTH } from 'utils';

import { ProfileContext } from './ProfileScreen';

interface TemplatePageScreenProps {
  route: RouteProp<MainStackParams, 'TemplatePageScreen'>;
}

const TemplatePageScreen: FC<TemplatePageScreenProps> = ({ route, navigation }) => {
  const { title } = route.params;
  const dispatch = useDispatch();
  const { screenType, userXId, moments, ownProfile } = useContext(ProfileContext);
  const localMoments = useMemo(
    () => moments.filter(item => item.moment_category === title),
    [moments],
  );
  const { momentUploadProgressBar, user } = useSelector((state: RootState) => state.user);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const goBackHandler = () => navigation.goBack();
  return (
    <>
      {ownProfile &&
        momentUploadProgressBar &&
        momentUploadProgressBar.momentInfo.category === title && <MomentUploadProgressBar />}
      {localMoments[0] ? (
        <IndividualMoment
          route={{ params: { screenType, userXId, moment: localMoments[0], ownProfile } }}
        />
      ) : (
        <>
          <View style={styles.titleContainer}>
            {!userXId && !ownProfile && (
              <SvgXml
                xml={icons.BackArrow}
                height={normalize(18)}
                width={normalize(18)}
                color={'white'}
                style={styles.backArrow}
                onPress={goBackHandler}
              />
            )}
            <Text
              numberOfLines={3}
              style={[
                styles.multilineHeaderTitle,
                {
                  fontSize: title.length > 18 ? normalize(14) : normalize(16),
                },
              ]}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={() => {
              const options = {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              };
              ReactNativeHapticFeedback.trigger('impactLight', options);
              setDrawerVisible(true);
            }}
            style={styles.container}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('CameraScreen', {
                  screenType: ScreenType.Profile,
                  selectedCategory: title,
                })
              }>
              <Image
                source={require('../../assets/moment-categories/yourFirst.png')}
                style={styles.yourFirst}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {screenType && (
            <MomentMoreInfoDrawer
              isDiscoverMomentPost={false}
              isOpen={drawerVisible}
              setIsOpen={setDrawerVisible}
              isOwnProfile={ownProfile}
              dismissScreenAndUpdate={() => {
                dispatch(loadUserMoments(user.userId));
                navigation.goBack();
              }}
              screenType={screenType}
              title={title}
            />
          )}
        </>
      )}
    </>
  );
};

export default TemplatePageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDBDBD',
  },
  yourFirst: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    resizeMode: 'contain',
  },
  bar: {
    width: '100%',
    height: 3,
  },
  row: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 50,
    zIndex: 1,
  },
  column: {
    position: 'absolute',
    top: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: '#EA574C',
    width: '100%',
    paddingVertical: 10,
    paddingTop: 50,
    zIndex: 1,
  },
  text: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    lineHeight: 17,
    marginVertical: 12,
    width: '80%',
  },
  multilineHeaderTitle: {
    width: SCREEN_WIDTH * 0.7,
    textAlign: 'center',
    lineHeight: normalize(21.48),
    letterSpacing: normalize(1.3),
    fontWeight: '700',
    color: 'white',
  },
  titleContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    width: SCREEN_WIDTH * 0.8,
    left: SCREEN_WIDTH * 0.1,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    top: isIPhoneX() ? 56 : 30,
  },
  backArrow: {
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    position: 'absolute',
    left: -10,
  },
});
