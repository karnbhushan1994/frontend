import React from 'react';

import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import SimpleButton from 'components/widgets/SimpleButton';
import { normalize, SCREEN_HEIGHT } from 'utils';

const ErrorFallBackScreen: React.FC = ({ resetError }) => {
  const handleRetryClick = () => {
    if (resetError) {
      resetError();
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
          <SvgXml
            xml={icons.Exclamation}
            height={80}
            width={80}
            color={'#828282'}
            style={styles.icon}
          />
          <Text style={styles.errorText}>There was a problem with the network</Text>
          <SimpleButton
            title={'Retry'}
            onPress={handleRetryClick}
            containerStyles={styles.buttonContainer}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    marginHorizontal: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#828282',
    fontSize: normalize(18),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: normalize(25),
    letterSpacing: normalize(0),
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
  },
  icon: {
    textAlign: 'center',
  },
});

export default ErrorFallBackScreen;
