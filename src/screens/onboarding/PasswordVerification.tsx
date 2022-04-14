import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-animatable';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { trackPromise } from 'react-promise-tracker';

import { ArrowButton, Background, LoadingIndicator, SubmitButton } from 'components';

import { OnboardingStackParams } from 'routes';
import { handlePasswordCodeVerification, handlePasswordResetRequest } from 'services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { track } from 'utils';
import logger from 'utils/logger';

import { codeRegex } from '../../constants';
import {
  ERROR_INVALID_VERIFICATION_CODE_FORMAT,
  ERROR_SOMETHING_WENT_WRONG,
} from '../../constants/strings';

type VerificationScreenRouteProp = RouteProp<OnboardingStackParams, 'PasswordVerification'>;
type VerificationScreenNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'PasswordVerification'
>;
interface VerificationProps {
  route: VerificationScreenRouteProp;
  navigation: VerificationScreenNavigationProp;
}

const Verification: React.FC<VerificationProps> = ({ route, navigation }) => {
  const [value, setValue] = React.useState('');
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [valueProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { id } = route.params;

  const handleVerification = async () => {
    track('VerifyButton', AnalyticVerb.Pressed, AnalyticCategory.PasswordReset);
    if (codeRegex.test(value)) {
      try {
        const success = await trackPromise(handlePasswordCodeVerification(id, value));
        if (success) {
          track('PasswordReset', AnalyticVerb.Finished, AnalyticCategory.PasswordReset);
          navigation.navigate('PasswordReset', { value: id });
        }
      } catch (error) {
        track('PasswordReset', AnalyticVerb.Failed, AnalyticCategory.PasswordReset);
        logger.log(error);
        Alert.alert(ERROR_SOMETHING_WENT_WRONG);
      }
    } else {
      track('PasswordReset', AnalyticVerb.Failed, AnalyticCategory.PasswordReset);
      Alert.alert(ERROR_INVALID_VERIFICATION_CODE_FORMAT);
    }
  };

  /**
   * Sends the send_otp request so to provide a new verification code upon tapping the Resend Code button.
   */
  const handleResend = async () => {
    try {
      track('ResendCode', AnalyticVerb.Pressed, AnalyticCategory.PasswordReset);
      trackPromise(handlePasswordResetRequest(id));
    } catch (error) {
      logger.log(error);
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
  };

  const Footer = () => (
    <View style={styles.footer}>
      <ArrowButton
        direction="backward"
        onPress={() => navigation.navigate('PasswordResetRequest')}
      />
    </View>
  );

  return (
    <Background centered style={styles.container} gradientType={BackgroundGradientType.Light}>
      <KeyboardAvoidingView behavior="padding" style={styles.formPasswordVerification}>
        <Text style={styles.formHeader}>Enter 6 digit code</Text>
        <Text style={styles.description}>
          We sent a 6 digit verification code to the phone number you provided.
        </Text>
        <CodeField
          ref={ref}
          {...valueProps}
          value={value}
          onChangeText={setValue}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
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
          accessibilityHint="Select this after entering your phone number verification code"
          onPress={handleVerification}
        />
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resend}>Resend Code</Text>
        </TouchableOpacity>
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
  },
  formPasswordVerification: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 3,
    top: '25%',
  },
  formHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: '6%',
    marginHorizontal: '10%',
  },
  description: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    marginHorizontal: '10%',
  },
  resend: {
    textDecorationLine: 'underline',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
    ...Platform.select({
      ios: {
        bottom: '20%',
      },
      android: {
        bottom: '10%',
      },
    }),
  },
});
export default Verification;
