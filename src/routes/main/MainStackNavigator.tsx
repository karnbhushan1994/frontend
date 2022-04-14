/**
 * Note the name userXId here, it refers to the id of the user being visited
 */
import { createStackNavigator } from '@react-navigation/stack';

import {
  CommentBaseType,
  MomentPostType,
  MomentTagType,
  MomentType,
  RewardType,
  ScreenType,
  SearchCategoryType,
  TemplateEnumType,
  WidgetType,
} from 'types';

export type MainStackParams = {
  DiscoverMoments: {
    userXId: string | undefined;
    screenType: ScreenType;
  };
  Upload: {
    screenType: ScreenType;
  };
  RequestContactsAccess: {
    screenType: ScreenType;
  };
  DiscoverUsers: {
    searchCategory: SearchCategoryType;
  };
  Profile: {
    userXId: string | undefined;
    screenType: ScreenType;
    redirectToPage: string | undefined;
    showShareModalParm: boolean | undefined;
  };
  SettingsScreen: {};
  BlockedProfiles: {};
  ChangeSkinsScreen: {};
  CreatePageScreen: {};
  PageNameScreen: {};
  EditPageScreen: {};
  EditMomentsPage: {
    screenType: ScreenType;
    currentPageName: string;
  };
  TemplateFoundationScreen: {
    setActiveTab: Function;
  };
  SelectedSkin: {
    name: TemplateEnumType;
    displayName: string;
    demoPicture: string;
    primaryColor: string;
    secondaryColor: string;
  };
  PostChangeSkinScreen: {
    name: TemplateEnumType;
    demoPicture: string;
    primaryColor: string;
    secondaryColor: string;
  };
  SocialMediaTaggs: {
    socialMediaType: string;
    userXId: string | undefined;
    screenType: ScreenType;
  };
  CameraScreen: {
    screenType: ScreenType;
    selectedCategory?: string;
  };
  SlideInCameraScreen: {
    screenType: ScreenType;
    selectedCategory?: string;
    viaPostNow: boolean;
  };
  EditMedia: {
    media: { uri: string; isVideo: boolean };
    screenType: ScreenType;
    selectedCategory?: string;
    viaPostNowPopup?: boolean;
  };
  CaptionScreen: {
    screenType: ScreenType;
    media?: { uri: string; isVideo: boolean; videoDuration: number | undefined };
    selectedCategory?: string;
    selectedTags?: MomentTagType[];
    moment?: MomentType;
    viaPostNowPopup?: boolean;
  };
  ChoosingCategoryScreen: {
    newCustomCategory?: string;
  };
  TagFriendsScreen: {
    media: {
      uri: string;
      isVideo: boolean;
      videoDuration: number | undefined;
    };
    selectedTags?: MomentTagType[];
  };
  TagSelectionScreen: {
    selectedTags: MomentTagType[];
  };
  IndividualMoment: {
    moment: MomentType;
    userXId: string | undefined;
    userId: string | undefined;
    screenType: ScreenType;
  };
  LandingScreen: {
    invitationCode: string;
  };
  SingleMomentScreen: {
    moment: MomentPostType;
    screenType: ScreenType | undefined;
  };
  MomentCommentsScreen: {
    moment_id: string;
    userXId: string | undefined;
    screenType: ScreenType;
    comment_id?: string;
    getLatestCount: string;
  };
  CommentReactionScreen: {
    comment: CommentBaseType;
    screenType: ScreenType;
  };
  FriendsListScreen: {
    userXId: string | undefined;
    screenType: ScreenType;
  };
  EditProfile: {
    userId: string;
    username: string;
  };
  CategorySelection: {
    newCustomCategory: string | undefined;
  };
  CreateCustomCategory: {
    fromScreen: 'ChoosingCategoryScreen' | string;
  };
  NotificationsScreen: {
    screenType: ScreenType;
  };
  MomentUploadPrompt: {
    screenType: ScreenType;
    momentCategory: string;
    profileBodyHeight: number;
    socialsBarHeight: number;
  };
  AnimatedTutorial: {
    screenType: ScreenType;
  };
  UpdateSPPicture: {
    editing: boolean;
  };
  SPWelcomeScreen: {};
  ChatList: undefined;
  Chat: undefined;
  NewChatModal: undefined;
  ExploreTaggs: { editing: boolean };
  TaggShop: {
    editing?: boolean;
    activeTab?: string;
    filter?: string[];
    title?: string;
  };
  FilteredTaggShop: {
    editing?: boolean;
    activeTab?: string;
    filter?: string[];
    title?: string;
  };
  AddTagg: { editing: boolean; data: WidgetType; screenType: ScreenType };
  TemplatePageScreen: {
    title: string;
    setActiveTab: Function;
  };
  TaggClickCountScreen: undefined;
  ProfileLinks: undefined;
  MostPopularMoment: undefined;
  InsightScreen: undefined;
  FriendsCount: undefined;
  EditBioTemplate: undefined;
  Permissions: { backToProfile: boolean | undefined };
  UnwrapReward: {
    rewardUnwrapping: RewardType;
    screenType: ScreenType;
  };
  RewardReceived: {
    rewardUnwrapped: RewardType;
    screenType: ScreenType;
  };
};

export const MainStack = createStackNavigator<MainStackParams>();
