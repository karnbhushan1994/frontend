import React, { useEffect, useRef, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Linking, Platform } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';

import ErrorFallBackScreen from 'screens/errors/ErrorFallBackScreen';

import { getActiveRouteName, navigationRef } from './RootNavigation';
import Routes from './routes';
import { getCurrentLiveVersions } from './services';
import store from './store/configureStore';
import { screen, setupAnalytics } from './utils';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const App = () => {
  const routeNameRef = useRef();

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const [activeScreen, setActiveScreen] = useState<string>('');
  useEffect(() => {
    const setup = async () => {
      const response = await getCurrentLiveVersions();
      if (response) {
        setupAnalytics(response.env);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }
  const errorFallback = (props: { error: Error; resetError: Function }) => (
    <ErrorFallBackScreen resetError={props.resetError} />
  );
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Provider store={store}>
        <NavigationContainer
          ref={navigationRef}
          initialState={initialState}
          onStateChange={async state => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = getActiveRouteName(state);
            if (previousRouteName !== currentRouteName) {
              setActiveScreen(currentRouteName);
              screen(currentRouteName);
            }
            routeNameRef.current = currentRouteName;
            await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          }}>
          <ToastProvider swipeEnabled={true} animationType="slide-in" animationDuration={300}>
            <Routes activeScreen={activeScreen} />
          </ToastProvider>
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
