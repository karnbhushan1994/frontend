import React from 'react';

import { ActivityIndicator, StyleSheet } from 'react-native';
import { usePromiseTracker } from 'react-promise-tracker';

const LoadingIndicator: React.FC = () => {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress ? (
    <ActivityIndicator style={styles.loadingIndicator} size="large" color="#fff" />
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    marginVertical: '5%',
  },
});

export default LoadingIndicator;
