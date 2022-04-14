import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';

import { Image, StyleSheet, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import {
  AnimatedTutorial,
  BlockedProfiles,
  CameraScreen,
  CaptionScreen,
  CategorySelection,
  ChangeSkinScreen,
  ChoosingCategoryScreen,
  CommentReactionScreen,
  CreateCustomCategory,
  CreatePageScreen,
  DiscoverMomentsScreen,
  DiscoverUsers,
  EditBioTemplate,
  EditMedia,
  EditMomentsPage,
  EditPageScreen,
  EditProfile,
  FriendsListScreen,
  IndividualMoment,
  MomentCommentsScreen,
  MomentUploadPromptScreen,
  NotificationsScreen,
  PageNameScreen,
  Permissions,
  PostChangeSkinScreen,
  ProfileScreen,
  RequestContactsAccess,
  SelectedSkinScreen,
  SettingsScreen,
  SingleMomentScreen,
  SocialMediaTaggs,
  TagFriendsScreen,
  TagSelectionScreen,
} from 'screens';
import { MostPopularMoment } from 'screens/moments/MostPopularMoment';
import { FriendsCount } from 'screens/profile/FriendsCount';
import { Insights } from 'screens/profile/Insights';
import { ProfileLinks } from 'screens/profile/ProfileLinks';
import { ProfileView } from 'screens/profile/ProfileView';
import { RewardReceived, UnwrapReward } from 'screens/rewards';
import { TaggClickCount } from 'screens/tagg/TaggClickCount';
import AddTagg from 'screens/widgets/AddTagg';
import ExploreTaggs from 'screens/widgets/ExploreTaggs';
import { default as FilteredTaggShop, default as TaggShop } from 'screens/widgets/TaggShop';
import { ScreenType } from 'types';
import { AvatarHeaderHeight, normalize, SCREEN_WIDTH } from 'utils';

import { MainStack, MainStackParams } from './MainStackNavigator';

/**
 * Profile : To display the logged in user's profile when the userXId passed in to it is (undefined | null | empty string) else displays profile of the user being visited.
 * Search : To display the search screen. Search for a user on this screen, click on a result tile and navigate to the same.
 * When you click on the search icon after looking at a user's profile, the stack gets reset and you come back to the top of the stack (First screen : Search in this case)
 * SocialMediaTaggs : To display user data for any social media account set up by the user.
 * IndividualMoment : To display individual images uploaded by the user (Navigate to comments from this screen, click on a commenter's profile pic / username, look at a user's profile. Click on the profile icon again to come back to your own profile).
 * MomentCommentsScreen : Displays comments posted by users on an image uploaded by the user.
 * EditProfile : To edit logged in user's information.
 */

type MainStackRouteProps = RouteProp<MainStackParams, 'Profile'>;

interface MainStackProps {
  route: MainStackRouteProps;
}
const MainStackScreen: React.FC<MainStackProps> = ({ route }) => {
  const { screenType } = route.params;

  const isDiscoverMomentsTab = screenType === ScreenType.DiscoverMoments;
  const isUploadTab = screenType === ScreenType.Upload;

  const initialRouteName = (() => {
    switch (screenType) {
      case ScreenType.Profile:
        return 'Profile';
      case ScreenType.DiscoverMoments:
        return 'DiscoverMoments';
      case ScreenType.Upload:
        return 'Upload';
    }
  })();

  const tutorialModalStyle: StackNavigationOptions = {
    cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    gestureDirection: 'vertical',
    cardOverlayEnabled: true,
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 0.5, 0.9, 1],
          outputRange: [0, 0.25, 0.7, 1],
        }),
      },
    }),
  };

  const mainStackScreen = () => (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureResponseDistance: { horizontal: SCREEN_WIDTH * 0.7 },
      }}
      mode="card"
      initialRouteName={initialRouteName}>
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ screenType }}
        options={{
          ...headerBarOptions('white', ''),
          gestureEnabled: false,
        }}
      />
      {isDiscoverMomentsTab && (
        <MainStack.Screen
          name="DiscoverMoments"
          component={DiscoverMomentsScreen}
          initialParams={{ screenType }}
        />
      )}
      {isUploadTab && (
        <MainStack.Screen name="Upload" component={CameraScreen} initialParams={{ screenType }} />
      )}
      <MainStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        initialParams={{ screenType }}
        options={{
          ...headerBarOptions('black', ''),
          headerTransparent: true,
        }}
      />
      <MainStack.Screen
        name="DiscoverUsers"
        component={DiscoverUsers}
        options={{
          ...headerBarOptions('white', 'Discover Users'),
        }}
      />
      <MainStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          ...headerBarOptions('white', 'Settings and Privacy'),
        }}
      />
      <MainStack.Screen
        name="BlockedProfiles"
        component={BlockedProfiles}
        options={{
          ...headerBarOptions('black', 'Blocked Profiles'),
        }}
      />
      <MainStack.Screen
        name="Permissions"
        component={Permissions}
        options={{
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="ChangeSkinsScreen"
        component={ChangeSkinScreen}
        options={{
          ...headerBarOptions('white', 'Profile Skins'),
        }}
      />
      <MainStack.Screen
        name="CreatePageScreen"
        component={CreatePageScreen}
        options={{
          ...headerBarOptions('white', ' '),
        }}
      />
      <MainStack.Screen
        name="EditPageScreen"
        component={EditPageScreen}
        options={{
          ...headerBarOptions('white', 'Preview', 'close'),
        }}
      />
      <MainStack.Screen
        name="EditMomentsPage"
        component={EditMomentsPage}
        options={{
          ...headerBarOptions('black', ''),
        }}
      />
      <MainStack.Screen
        name="PageNameScreen"
        component={PageNameScreen}
        options={{
          ...headerBarOptions('white', 'Settings and Privacy'),
        }}
      />
      <MainStack.Screen
        name="FriendsCount"
        component={FriendsCount}
        options={{
          ...headerBarOptions('white', 'Settings and Privacy'),
        }}
      />
      <MainStack.Screen
        name="InsightScreen"
        component={Insights}
        options={{
          ...headerBarOptions('black', 'Insights'),
        }}
      />
      <MainStack.Screen
        name="ProfileViewsInsights"
        component={ProfileView}
        options={{
          ...headerBarOptions('black', 'Profile Views'),
        }}
      />
      <MainStack.Screen
        name="TaggClickCountScreen"
        component={TaggClickCount}
        options={{
          ...headerBarOptions('black', 'Tagg Click Count'),
        }}
      />
      <MainStack.Screen
        name="ProfileLinks"
        component={ProfileLinks}
        options={{
          ...headerBarOptions('black', 'Link Click Count'),
        }}
      />
      <MainStack.Screen
        name="MostPopularMoment"
        component={MostPopularMoment}
        options={{
          ...headerBarOptions('black', 'Top Moment Post'),
        }}
      />
      <MainStack.Screen
        name="PostChangeSkinScreen"
        component={PostChangeSkinScreen}
        options={{
          ...headerBarOptions('white', ' '),
        }}
      />
      <MainStack.Screen
        name="SelectedSkin"
        component={SelectedSkinScreen}
        options={{
          ...headerBarOptions('white', ''),
        }}
      />
      <MainStack.Screen
        name="AnimatedTutorial"
        component={AnimatedTutorial}
        options={{
          ...tutorialModalStyle,
        }}
        initialParams={{ screenType }}
      />
      <MainStack.Screen
        name="CaptionScreen"
        component={CaptionScreen}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen name="ChoosingCategoryScreen" component={ChoosingCategoryScreen} />
      <MainStack.Screen
        name="SocialMediaTaggs"
        component={SocialMediaTaggs}
        initialParams={{ screenType }}
        options={{
          ...headerBarOptions('white', ''),
          headerStyle: { height: AvatarHeaderHeight },
        }}
      />
      <MainStack.Screen
        name="CategorySelection"
        component={CategorySelection}
        options={{
          ...headerBarOptions('white', ''),
        }}
      />
      <MainStack.Screen
        name="CreateCustomCategory"
        component={CreateCustomCategory}
        options={{
          ...headerBarOptions('white', ''),
        }}
      />
      <MainStack.Screen
        name="IndividualMoment"
        component={IndividualMoment}
        initialParams={{ screenType }}
        options={{
          // ...modalStyle,
          // gestureEnabled: false,
          ...headerBarOptions('white', ''),
        }}
      />
      <MainStack.Screen
        name="SingleMomentScreen"
        component={SingleMomentScreen}
        initialParams={{ screenType }}
        options={{
          ...modalStyle,
          gestureEnabled: false,
          ...headerBarOptions('white', ''),
        }}
      />
      <MainStack.Screen
        name="MomentCommentsScreen"
        component={MomentCommentsScreen}
        initialParams={{ screenType }}
        options={{
          ...headerBarOptions('black', 'Comments'),
        }}
      />
      <MainStack.Screen
        name="CommentReactionScreen"
        component={CommentReactionScreen}
        options={{
          ...headerBarOptions('black', 'Likes'),
        }}
      />
      <MainStack.Screen
        name="MomentUploadPrompt"
        component={MomentUploadPromptScreen}
        initialParams={{ screenType }}
        options={{
          ...modalStyle,
        }}
      />
      <MainStack.Screen
        name="FriendsListScreen"
        component={FriendsListScreen}
        initialParams={{ screenType }}
        options={{
          ...headerBarOptions('black', 'Friends'),
        }}
      />
      <MainStack.Screen
        name="RequestContactsAccess"
        component={RequestContactsAccess}
        initialParams={{ screenType }}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          ...headerBarOptions('white', 'Edit Profile'),
        }}
      />
      <MainStack.Screen
        name="ExploreTaggs"
        component={ExploreTaggs}
        initialParams={{ editing: true }}
        options={{
          ...tutorialModalStyle,
          ...headerBarOptions('white', 'Tagg Shop'),
        }}
      />
      <MainStack.Screen
        name="TaggShop"
        component={TaggShop}
        initialParams={{ editing: true }}
        options={{
          //...tutorialModalStyle,
          //gestureDirection: 'horizontal',
          ...headerBarOptions('white', 'Tagg Shop'),
        }}
      />
      <MainStack.Screen
        name="FilteredTaggShop"
        component={FilteredTaggShop}
        initialParams={{ editing: true }}
        options={{
          ...tutorialModalStyle,
          ...headerBarOptions('white', 'Tagg Shop'),
        }}
      />
      <MainStack.Screen
        name="AddTagg"
        component={AddTagg}
        initialParams={{ editing: true }}
        options={{
          ...tutorialModalStyle,
          ...headerBarOptions('white', 'Preview', 'close'),
        }}
      />
      <MainStack.Screen
        name="TagSelectionScreen"
        component={TagSelectionScreen}
        options={{
          ...headerBarOptions('black', ''),
        }}
      />
      <MainStack.Screen
        name="TagFriendsScreen"
        component={TagFriendsScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="EditMedia"
        component={EditMedia}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen name="SlideInCameraScreen" component={CameraScreen} />
      <MainStack.Screen
        name="UnwrapReward"
        component={UnwrapReward}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="RewardReceived"
        component={RewardReceived}
        options={{
          ...modalStyle,
          gestureEnabled: false,
        }}
      />
      <MainStack.Screen
        name="EditBioTemplate"
        component={EditBioTemplate}
        options={{
          ...tutorialModalStyle,
          ...headerBarOptions('white', 'Preview', 'close'),
        }}
      />
    </MainStack.Navigator>
  );

  return mainStackScreen();
};

export const headerBarOptions: (
  color: 'white' | 'black',
  title: string,
  backIconType?: 'arrow' | 'close' | 'circleBack',
) => StackNavigationOptions = (color, title, backIconType) => ({
  headerShown: true,
  headerTransparent: true,
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <>
      {backIconType === 'close' ? (
        <SvgXml
          xml={icons.CloseOutline}
          height={normalize(30)}
          width={normalize(30)}
          color={color}
          style={[styles.backButton, color === 'white' ? styles.backButtonShadow : {}]}
        />
      ) : backIconType === 'circleBack' ? (
        <Image source={icons.BackIcon} style={[styles.backButton, styles.backIcon]} />
      ) : (
        <SvgXml
          xml={icons.BackArrow}
          height={normalize(18)}
          width={normalize(18)}
          color={color}
          style={[styles.backButton, color === 'white' ? styles.backButtonShadow : {}]}
        />
      )}
    </>
  ),
  headerTitle: () => (
    <Text
      numberOfLines={1}
      style={[
        styles.headerTitle,
        { fontSize: title.length > 18 ? normalize(14) : normalize(16), color: color },
      ]}>
      {title}
    </Text>
  ),
});

export const multilineHeaderTitle: (title: string) => StackNavigationOptions = title => ({
  headerTitle: () => (
    <Text
      numberOfLines={3}
      style={[
        styles.multilineHeaderTitle,
        {
          fontSize: title.length > 18 ? normalize(14) : normalize(16),
        },
      ]}>
      {title}
    </Text>
  ),
});

export const modalStyle: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'rgba(80,80,80,0.6)' },
  gestureDirection: 'vertical',
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
  }),
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 30,
  },
  backButtonShadow: {
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
  },
  backIcon: { height: 35, width: 35, marginLeft: 18 },
  headerTitle: {
    width: SCREEN_WIDTH * 0.7,
    textAlign: 'center',
    lineHeight: normalize(21.48),
    letterSpacing: normalize(1.3),
    fontWeight: '700',
  },
  multilineHeaderTitle: {
    width: SCREEN_WIDTH * 0.7,
    height: normalize(70),
    marginTop: normalize(90) / 2,
    textAlign: 'center',
    lineHeight: normalize(21.48),
    letterSpacing: normalize(1.3),
    fontWeight: '700',
    color: 'white',
  },
});

export default MainStackScreen;
