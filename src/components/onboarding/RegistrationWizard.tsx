import React, { useEffect } from 'react';

import { View, StyleSheet, ViewProps, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface RegistrationWizardProps extends ViewProps {
  step: 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven';
}

const RegistrationWizard = (props: RegistrationWizardProps) => {
  const stepStyle = styles.step;
  const stepActiveStyle = [styles.step, styles.stepActive];
  const { step } = props;
  // detects visibility of keyboard to display or hide wizard
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  useEffect(() => {
    const showKeyboard = () => setKeyboardVisible(true);
    Keyboard.addListener('keyboardWillShow', showKeyboard);
    return () => Keyboard.removeListener('keyboardWillShow', showKeyboard);
  }, []);

  useEffect(() => {
    const hideKeyboard = () => setKeyboardVisible(false);
    Keyboard.addListener('keyboardWillHide', hideKeyboard);
    return () => Keyboard.removeListener('keyboardWillHide', hideKeyboard);
  }, []);

  return (
    <View {...props}>
      {!keyboardVisible && (
        <Animatable.View animation="fadeIn" duration={300}>
          <View style={styles.container}>
            <View style={step === 'one' ? stepActiveStyle : stepStyle} />
            <View style={styles.progress} />
            <View style={step === 'two' ? stepActiveStyle : stepStyle} />
            <View style={styles.progress} />
            <View style={step === 'three' ? stepActiveStyle : stepStyle} />
          </View>
        </Animatable.View>
      )}
      {keyboardVisible && (
        <Animatable.View animation="fadeOut" duration={300}>
          <View style={styles.container}>
            <View style={step === 'one' ? stepActiveStyle : stepStyle} />
            <View style={styles.progress} />
            <View style={step === 'two' ? stepActiveStyle : stepStyle} />
            <View style={styles.progress} />
            <View style={step === 'three' ? stepActiveStyle : stepStyle} />
          </View>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  step: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#e1f0ff',
  },
  stepActive: {
    backgroundColor: '#e1f0ff',
  },
  progress: {
    width: '35%',
    height: 2,
    backgroundColor: '#e1f0ff',
  },
});

export default RegistrationWizard;
