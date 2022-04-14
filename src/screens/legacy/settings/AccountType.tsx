import {TAGG_LIGHT_BLUE_2} from '../../constants';

import React, {useState} from 'react';

import {ActivityIndicator, StatusBar, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import {Background} from 'components';

import {updateProfileVisibility} from 'services';
import {NO_PROFILE} from 'store/initialStates';
import {RootState} from 'store/rootReducer';
import {AnalyticCategory, AnalyticVerb, BackgroundGradientType} from 'types';
import {getTokenOrLogout, track} from 'utils';
import {normalize} from 'utils/layouts';


const AccountType: React.FC = () => {
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    user: { userId, username },
    profile: { is_private } = NO_PROFILE,
  } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const updateAccountVisibility = async () => {
    setIsLoading(true);
    const isPrivate = !isPrivateAccount;
    setIsPrivateAccount(isPrivate);
    const token = await getTokenOrLogout(dispatch);
    await updateProfileVisibility(token, { userId, username }, isPrivate, dispatch);
    track('PublicPrivateAccount', AnalyticVerb.Toggled, AnalyticCategory.Settings, {
      newIsPrivate: isPrivate,
    });
    setIsLoading(false);
  };

  const getAccountText = () => (is_private ? 'Private Account' : 'Public Account');

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background gradientType={BackgroundGradientType.Light}>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.switchContainerStyle}>
              <Text style={styles.title}>{getAccountText()}</Text>
              <ActivityIndicator animating={isLoading} size="small" color="white" />
              {!isLoading && (
                <Switch
                  trackColor={{ false: 'red', true: TAGG_LIGHT_BLUE_2 }}
                  thumbColor={'white'}
                  ios_backgroundColor="transparent"
                  style={styles.switchStyles}
                  value={is_private}
                  onValueChange={updateAccountVisibility}
                />
              )}
            </View>

            <View style={styles.detailContainerStyle}>
              <Text style={styles.detailTitleStyle}>Enabling a public account will:</Text>
              <Text style={styles.detailContentStyle}>
                {'\n'}Everyone can view my posts{'\n'}
                {'\n'}Everyone can send me friend requests{'\n'}
                {'\n'}Everyone can tagg me{'\n'}
                {'\n'}Everyone can send me direct messages
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Background>
    </>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: '8%', marginTop: '20%' },
  title: {
    alignSelf: 'center',
    fontSize: normalize(18),
    fontWeight: '600',
    lineHeight: normalize(17.9),
    color: 'white',
  },
  switchContainerStyle: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  detailContainerStyle: { marginTop: '40%' },
  detailTitleStyle: {
    fontSize: normalize(19),
    fontWeight: '700',
    lineHeight: normalize(22.67),
    color: 'white',
  },
  detailContentStyle: {
    fontSize: normalize(14),
    fontWeight: '600',
    lineHeight: normalize(16.71),
    color: 'white',
  },
  switchStyles: {
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default AccountType;
