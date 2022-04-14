import React from 'react';

import { StackCardInterpolationProps, TransitionPresets } from '@react-navigation/stack';

import AppTutorialScreen from 'screens/tutorials/profileTutorialVideos/AppTutorialScreen';

import {
  Age,
  BuildProfile,
  ChooseSkinOnboardingScreen,
  Email,
  Gender,
  Interest,
  LandingPage,
  Password,
  Permissions,
  Phone,
  PhoneVerification,
  Signup,
  SingleMomentScreen,
  TiktokProfile,
  Username,
  Waitlist,
} from '../../screens';
import { headerBarOptions, modalStyle } from '../main';
import { OnboardingStack } from './OnboardingStackNavigator';

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const OnboardingStackScreen: React.FC = () => (
  <OnboardingStack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen
      name="LandingPage"
      component={LandingPage}
      options={{
        gestureEnabled: false,
        cardStyleInterpolator: forFade,
        ...modalStyle,
      }}
    />
    <OnboardingStack.Screen
      name="Phone"
      component={Phone}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="PhoneVerification"
      component={PhoneVerification}
      options={{ ...modalStyle }}
    />
    <OnboardingStack.Screen
      name="Interest"
      component={Interest}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Permissions"
      component={Permissions}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="BuildProfile"
      component={BuildProfile}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="AppTutorialScreen"
      component={AppTutorialScreen}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="ChooseSkinOnboardingScreen"
      component={ChooseSkinOnboardingScreen}
      options={{
        ...headerBarOptions('white', ' '),
        headerLeft: () => null,
      }}
    />
    <OnboardingStack.Screen
      name="Signup"
      component={Signup}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Username"
      component={Username}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Password"
      component={Password}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Age"
      component={Age}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Gender"
      component={Gender}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Email"
      component={Email}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="TiktokProfile"
      component={TiktokProfile}
      options={{
        gestureEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <OnboardingStack.Screen
      name="Waitlist"
      component={Waitlist}
      options={{
        gestureEnabled: false,
        cardStyleInterpolator: forFade,
        ...modalStyle,
      }}
    />
    <OnboardingStack.Screen
      name="SingleMomentScreen"
      component={SingleMomentScreen}
      options={{
        ...modalStyle,
        gestureEnabled: false,
        ...headerBarOptions('white', ''),
      }}
    />
  </OnboardingStack.Navigator>
);

export default OnboardingStackScreen;
