import { createStackNavigator } from '@react-navigation/stack';

import { MomentPostType, ScreenType } from 'types';

export type OnboardingStackParams = {
  LandingPage: undefined;
  Phone: {
    login: boolean;
  };
  PhoneVerification: {
    phone: string;
    login: boolean;
  };
  Interest: undefined;
  BuildProfile: { interests: string[] };
  AppTutorialScreen: { interests: string[] };
  ChooseSkinOnboardingScreen: {
    interests: string[];
  };
  Signup: undefined;
  Username: undefined;
  Age: undefined;
  Gender: undefined;
  Password: undefined;
  Email: undefined;
  TiktokProfile: undefined;
  Waitlist: undefined;
  Permissions: undefined;
  SingleMomentScreen: {
    moment: MomentPostType;
    screenType: ScreenType | undefined;
  };
};

export const OnboardingStack = createStackNavigator<OnboardingStackParams>();
