import { createStackNavigator } from '@react-navigation/stack';

export type ProfileTutorialVideosStackParams = {
  ProfileWelcomeScreen: undefined;
  TaggsTutorialScreen: undefined;
  EditTaggsTutorialScreen: undefined;
  PagesTutorialScreen: undefined;
  MomentsTutorialScreen: undefined;
  CustomizeTutorialScreen: undefined;
  ShareProfileScreen: undefined;
};

export const ProfileTutorialVideosStack = createStackNavigator<ProfileTutorialVideosStackParams>();
