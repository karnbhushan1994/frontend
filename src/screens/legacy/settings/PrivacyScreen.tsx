import React from 'react';

import { SectionList, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

import { Background } from 'components';
import { SETTINGS_DATA } from '../../constants/constants';
import SettingsCell from 'screens/profile/SettingsCell';
import { NO_PROFILE } from 'store/initialStates';
import { RootState } from 'store/rootReducer';
import { BackgroundGradientType } from 'types';
import { SCREEN_HEIGHT } from 'utils/layouts';

const PrivacyScreen: React.FC = () => {
  const { profile: { is_private } = NO_PROFILE } = useSelector((state: RootState) => state.user);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Light}>
        <SafeAreaView>
          <View style={styles.container}>
            <SectionList
              sections={SETTINGS_DATA.PrivacyScreen}
              keyExtractor={(item, index) => item.title + index}
              renderItem={({ item: { title, preimage, postimage } }) => (
                <SettingsCell {...{ title, preimage, postimage, isPrivate: is_private }} />
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
});

export default PrivacyScreen;
