import React from 'react';

import {
  CustomizeTutorialScreen,
  EditTaggsTutorialScreen,
  MomentsTutorialScreen,
  PagesTutorialScreen,
  ProfileWelcomeScreen,
  ShareProfileScreen,
  TaggsTutorialScreen,
} from 'screens';

import { ProfileTutorialVideosStack } from './ProfileTutorialVideosStackNavigator';

const ProfileTutorialVideosStackScreen: React.FC = () => (
  <ProfileTutorialVideosStack.Navigator
    initialRouteName="ProfileWelcomeScreen"
    screenOptions={{ headerShown: false }}>
    <ProfileTutorialVideosStack.Screen
      name="ProfileWelcomeScreen"
      component={ProfileWelcomeScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="TaggsTutorialScreen"
      component={TaggsTutorialScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="EditTaggsTutorialScreen"
      component={EditTaggsTutorialScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="PagesTutorialScreen"
      component={PagesTutorialScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="MomentsTutorialScreen"
      component={MomentsTutorialScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="CustomizeTutorialScreen"
      component={CustomizeTutorialScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <ProfileTutorialVideosStack.Screen
      name="ShareProfileScreen"
      component={ShareProfileScreen}
      options={{
        gestureEnabled: false,
      }}
    />
  </ProfileTutorialVideosStack.Navigator>
);

export default ProfileTutorialVideosStackScreen;
