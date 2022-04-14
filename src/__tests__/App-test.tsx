/**
 * @format
 */

import 'react-native';
import React from 'react';

import renderer from 'react-test-renderer';

import App from '../App';

// Note: test renderer must be required after react-native.

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', () => {
  renderer.create(<App />);
});
