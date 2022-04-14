import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/core';
import {
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Background } from 'components';

import { logout } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { track } from 'utils';
import { normalize, SCREEN_HEIGHT } from 'utils/layouts';

import { SETTINGS_DATA } from '../../constants/constants';
import SettingsCell from './SettingsCell';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { analyticsStatus = '' } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
    });
    return subscribe;
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Light}>
        <SafeAreaView>
          <View style={styles.container}>
            <SectionList
              stickySectionHeadersEnabled={false}
              sections={SETTINGS_DATA.SettingsAndPrivacy}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item: { title, preimage, postimage, enabledpreimage } }) => (
                <SettingsCell
                  {...{ title, preimage, postimage, enabledpreimage, analyticsStatus }}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.headerContainerStyles}>
                  <Text style={styles.headerTextStyles}>{title}</Text>
                </View>
              )}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={styles.logoutContainerStyles}
                  onPress={() => {
                    track('Logout', AnalyticVerb.Pressed, AnalyticCategory.Settings);
                    dispatch(logout());
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'DiscoverMoments' }],
                    });
                  }}>
                  <Text style={styles.logoutTextStyles}>Logout</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: { height: SCREEN_HEIGHT, marginHorizontal: '8%', marginTop: '8%' },
  headerContainerStyles: { marginTop: '14%' },
  headerTextStyles: {
    fontSize: normalize(18),
    fontWeight: '600',
    lineHeight: normalize(21.48),
    color: '#E9E9E9',
  },
  logoutContainerStyles: { marginTop: '20%', marginLeft: '12%' },
  logoutTextStyles: {
    fontSize: normalize(20),
    fontWeight: '600',
    lineHeight: normalize(23.87),
    color: 'white',
  },
});

export default SettingsScreen;
