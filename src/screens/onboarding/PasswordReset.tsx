import React, { useState, useRef } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { trackPromise } from 'react-promise-tracker';

import { ArrowButton, TaggInput, Background, LoadingIndicator, SubmitButton } from 'components';

import { OnboardingStackParams } from 'routes';
import { handlePasswordReset } from 'services';
import { BackgroundGradientType } from 'types';

import { passwordRegex } from '../../constants';

type PasswordResetRequestRouteProp = RouteProp<OnboardingStackParams, 'PasswordReset'>;
type PasswordResetRequestNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'PasswordReset'
>;
interface PasswordResetRequestProps {
  route: PasswordResetRequestRouteProp;
  navigation: PasswordResetRequestNavigationProp;
}
/**
 * Password reset page
 * @param navigation react-navigation navigation object
 */
const PasswordResetRequest: React.FC<PasswordResetRequestProps> = ({ route, navigation }) => {
  const passwordRef = useRef();
  const confirmRef = useRef();
  const { value } = route.params;

  /**
   * Handles focus change to the next input field.
   * @param field key for field to move focus onto
   */
  const handleFocusChange = (): void => {
    const confirmField: any = confirmRef.current;
    confirmField.focus();
  };

  const [form, setForm] = useState({
    password: '',
    confirm: '',
    isValidPassword: false,
    passwordsMatch: false,
    attemptedSubmit: false,
  });

  const handlePasswordUpdate = (password: string) => {
    let isValidPassword: boolean = passwordRegex.test(password);
    let passwordsMatch: boolean = form.password === form.confirm;
    setForm({
      ...form,
      password,
      isValidPassword,
      passwordsMatch,
    });
  };

  const handleConfirmUpdate = (confirm: string) => {
    let passwordsMatch: boolean = form.password === confirm;
    setForm({
      ...form,
      confirm,
      passwordsMatch,
    });
  };

  const handleSubmit = async () => {
    if (!form.attemptedSubmit) {
      setForm({
        ...form,
        attemptedSubmit: true,
      });
    }
    try {
      if (form.isValidPassword && form.passwordsMatch) {
        const success = await trackPromise(handlePasswordReset(value, form.password));
        if (success) {
          navigation.navigate('Login');
        }
      } else {
        setForm({ ...form, attemptedSubmit: false });
        setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
      }
    } catch (error) {
      Alert.alert(
        'Looks like our servers are down. 😓',
        "Try again in a couple minutes. We're sorry for the inconvenience.",
      );
      return {
        name: 'Verify Password error',
        description: error,
      };
    }
  };

  /**
   * Reset Password Button.
   */
  const ResetPasswordButton = () => (
    <SubmitButton
      text="Reset Password"
      color="#fff"
      style={styles.button}
      accessibilityLabel="Reset Password"
      accessibilityHint="Select this after entering teh code and new password"
      onPress={handleSubmit}
    />
  );

  const Footer = () => (
    <View style={styles.footer}>
      <ArrowButton direction="backward" onPress={() => navigation.navigate('Login')} />
    </View>
  );

  return (
    <Background style={styles.container} gradientType={BackgroundGradientType.Light}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View>
          <Text style={styles.description}>Enter your new password</Text>
        </View>
        <TaggInput
          accessibilityHint="Enter a password."
          accessibilityLabel="Password input field."
          placeholder="Password"
          autoCompleteType="password"
          textContentType="oneTimeCode"
          returnKeyType="next"
          onChangeText={handlePasswordUpdate}
          onSubmitEditing={() => handleFocusChange}
          blurOnSubmit={false}
          secureTextEntry
          ref={passwordRef}
          valid={form.isValidPassword}
          invalidWarning={
            'Password must be at least 8 characters & contain at least one of a-z, A-Z, 0-9, and a special character.'
          }
          attemptedSubmit={form.attemptedSubmit}
          width={280}
        />
        <TaggInput
          accessibilityHint={'Re-enter your password.'}
          accessibilityLabel={'Password confirmation input field.'}
          placeholder={'Confirm Password'}
          autoCompleteType="password"
          textContentType="oneTimeCode"
          returnKeyType={'go'}
          onChangeText={handleConfirmUpdate}
          onSubmitEditing={handleSubmit}
          secureTextEntry
          ref={confirmRef}
          valid={form.passwordsMatch}
          invalidWarning={'Passwords must match.'}
          attemptedSubmit={form.attemptedSubmit}
          width={280}
        />
        <ResetPasswordButton />
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
    marginBottom: '10%',
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
  button: {
    marginVertical: '10%',
  },
});

export default PasswordResetRequest;
