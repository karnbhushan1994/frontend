import React, { useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { trackPromise } from 'react-promise-tracker';

import { ArrowButton, Background, LoadingIndicator, TaggInput } from 'components';
import { OnboardingStackParams } from 'routes';
import { handlePasswordResetRequest } from 'services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType } from 'types';
import { track } from 'utils';

import { emailRegex, usernameRegex } from '../../constants';

type PasswordResetRequestRouteProp = RouteProp<OnboardingStackParams, 'PasswordResetRequest'>;
type PasswordResetRequestNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'PasswordResetRequest'
>;
interface PasswordResetRequestProps {
  route: PasswordResetRequestRouteProp;
  navigation: PasswordResetRequestNavigationProp;
}
/**
 * Password reset request page for getting username / email
 * @param navigation react-navigation navigation object
 */
const PasswordResetRequest: React.FC<PasswordResetRequestProps> = ({ navigation }) => {
  const [form, setForm] = useState({
    value: '',
    isValid: false,
    attemptedSubmit: false,
  });

  const handleValueUpdate = (value: string) => {
    value = value.trim();

    //Entered field should either be a valid username or a valid email
    let isValid: boolean = emailRegex.test(value) || usernameRegex.test(value);

    setForm({
      ...form,
      value,
      isValid,
    });
  };

  const goToPasswordCodeVerification = async () => {
    track('Next', AnalyticVerb.Pressed, AnalyticCategory.PasswordReset);
    if (!form.attemptedSubmit) {
      setForm({
        ...form,
        attemptedSubmit: true,
      });
    }
    try {
      if (form.isValid) {
        const success = await trackPromise(handlePasswordResetRequest(form.value));
        if (success) {
          track('SubmitPasswordRequest', AnalyticVerb.Finished, AnalyticCategory.PasswordReset);
          navigation.navigate('PasswordVerification', {
            id: form.value,
          });
        }
      } else {
        setForm({ ...form, attemptedSubmit: false });
        setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
      }
    } catch (error) {
      track('SubmitPasswordRequest', AnalyticVerb.Failed, AnalyticCategory.PasswordReset);
      Alert.alert(
        'Looks like our servers are down. 😓',
        "Try again in a couple minutes. We're sorry for the inconvenience.",
      );
      return {
        name: 'Send OTP error',
        description: error,
      };
    }
  };

  const Footer = () => (
    <View style={styles.footer}>
      <ArrowButton direction="backward" onPress={() => navigation.navigate('Login')} />
      <TouchableOpacity onPress={goToPasswordCodeVerification}>
        <ArrowButton
          direction="forward"
          disabled={!form.isValid}
          onPress={goToPasswordCodeVerification}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Background style={styles.container} gradientType={BackgroundGradientType.Light}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View>
          <Text style={styles.description}>Enter your registered username</Text>
        </View>
        <TaggInput
          accessibilityHint="Enter a username"
          accessibilityLabel="Input field."
          placeholder="Username"
          autoCompleteType="username"
          textContentType="username"
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={goToPasswordCodeVerification}
          onChangeText={handleValueUpdate}
          valid={form.isValid}
          invalidWarning={'You must enter a valid username / email'}
          attemptedSubmit={form.attemptedSubmit}
          containerStyle={styles.inputContainer}
        />
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
  header: {
    ...Platform.select({
      ios: {
        top: 50,
      },
      android: {
        bottom: 40,
      },
    }),
  },
  inputContainer: { height: 50, marginTop: 100 },
  formHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: '6%',
    marginHorizontal: '10%',
  },
  load: {
    top: '5%',
  },
  description: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    marginHorizontal: '10%',
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

export default PasswordResetRequest;
