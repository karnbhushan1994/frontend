import React from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useDispatch } from 'react-redux';

import { ArrowButton, Background, LoadingIndicator, SubmitButton } from 'components';

import { OnboardingStackParams } from 'routes';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { SCREEN_WIDTH, track, userLogin } from 'utils';

import { VERIFY_INVITATION_CODE_ENDPOUNT } from '../../constants';
import {
  ERROR_DOUBLE_CHECK_CONNECTION,
  ERROR_INVALID_INVITATION_CODE,
  ERROR_INVLAID_CODE,
  ERROR_VERIFICATION_FAILED_SHORT,
} from '../../constants/strings';

type InvitationCodeVerificationRouteProp = RouteProp<
  OnboardingStackParams,
  'InvitationCodeVerification'
>;
type InvitationCodeVerificationNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'InvitationCodeVerification'
>;

interface InvitationCodeVerificationProps {
  navigation: InvitationCodeVerificationNavigationProp;
  route: InvitationCodeVerificationRouteProp;
}

/**
 * InvitationCodeVerification screen to verify that the new user has been Invited
 * @param navigation react-navigation navigation object
 */

const InvitationCodeVerification: React.FC<InvitationCodeVerificationProps> = ({
  route,
  navigation,
}) => {
  const [value, setValue] = React.useState<string>(
    route.params.invitationCode || '',
  );
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [valueProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const dispatch = useDispatch();

  const handleInvitationCodeVerification = async () => {
    track('VerifyInvitationCodeButton', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    if (value.length === 6) {
      try {
        let verifyInviteCodeResponse = await fetch(
          VERIFY_INVITATION_CODE_ENDPOUNT + value + '/?user_id=' + route.params.userId,
          {
            method: 'DELETE',
          },
        );

        if (verifyInviteCodeResponse.status === 200) {
          track('VerifyInvitationCode', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          const userId = route.params.userId;
          const username = route.params.username;
          await AsyncStorage.setItem('userId', userId);
          await AsyncStorage.setItem('username', username);
          track('Onboarding', AnalyticVerb.Finished, AnalyticCategory.Onboarding, {
            user: {
              userId,
              username,
            },
          );
          // TODO: Update onboarding path to allow user login
          userLogin(dispatch, {userId, username});
          navigation.navigate('Signup');
        } else {
          Alert.alert(ERROR_INVALID_INVITATION_CODE);
        }
      } catch (error) {
        Alert.alert(ERROR_VERIFICATION_FAILED_SHORT, ERROR_DOUBLE_CHECK_CONNECTION);
        return {
          name: 'Verification error',
          description: error,
        };
      }
    } else {
      Alert.alert(ERROR_INVLAID_CODE);
    }
  };

  const Footer = () => (
    <View style={styles.footer}>
      <ArrowButton
        direction="backward"
        onPress={() => navigation.navigate('LandingPage')}
      />
    </View>
  );

  return (
    <Background centered style={styles.container} gradientType={BackgroundGradientType.Light}>
      <KeyboardAvoidingView behavior="padding" style={styles.form}>
        <Text style={styles.formHeader}>Enter Your Invitation Code</Text>
        <CodeField
          ref={ref}
          {...valueProps}
          value={value}
          onChangeText={setValue}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            </View>
          )}
        />
        <SubmitButton
          text="Verify"
          color="#fff"
          style={styles.button}
          accessibilityLabel="Verify"
          accessibilityHint="Select this after entering your invitation code"
          onPress={handleInvitationCodeVerification}
        />
        <Text style={styles.youveBeenAddedLabel}>
          You've been added to the waitlist! We'll notify you when you're at the front of the line!
        </Text>
        <LoadingIndicator />
      </KeyboardAvoidingView>
      <Footer />
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  form: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  formHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginHorizontal: '10%',
  },
  codeFieldRoot: {
    width: 280,
    marginHorizontal: 'auto',
    marginVertical: '15%',
  },
  cellRoot: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#fff',
    fontSize: 48,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#78a0ef',
    borderBottomWidth: 2,
  },
  button: {
    marginVertical: '5%',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  youveBeenAddedLabel: {
    marginVertical: '5%',
    width: SCREEN_WIDTH * 0.8,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: '10%',
  },
});

export default InvitationCodeVerification;
