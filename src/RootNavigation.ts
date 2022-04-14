import React from 'react';

import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef: React.RefObject<NavigationContainerRef> = React.createRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    // TODO: Decide what to do if the app hasn't mounted
    // Ignore this, or add these actions to a queue you can call later
  }
}

export const getActiveRouteName = state => {
  const route = state.routes[state?.index || 0];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};
