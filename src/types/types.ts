import { ImageProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { WidgetLinkType, WidgetType } from 'types/widgets';

export interface UserType {
  userId: string;
  username: string;
}

export interface TaggType {
  unLockBG: boolean;
  taggEligiblity: boolean;
}

/**
 * User profile information that only conntains a few key fields.
 */
export interface ProfilePreviewType {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  thumbnail_url: string;
  name?: string;
  // category: string;
}

export interface CategoryPreviewType {
  name: string;
  category: string;
}

export type FriendshipStatusType = 'friends' | 'requested' | 'no_record';
export interface EmptyViewProps {
  viewType: 'Notification';
}

export enum UniversityType {
  Brown = 'Brown University',
  Cornell = 'Cornell University',
  Empty = '',
}

export interface ProfileType {
  profile_pic: string;
  header_pic: string;
  profile_info: ProfileInfoType;
  moment_categories: string[];
  linked_socials: string[];
}

export interface ProfileInfoType {
  name: string;
  biography: string;
  is_private: string;
  website: string;
  gender: string;
  university_class: number;
  university: UniversityType;
  profile_tutorial_stage: ProfileTutorialStage;
  birthday: Date | undefined;
  tagg_score: number;
  rewards: string[];
  newRewardsReceived: string[];
  snapchat: string;
  tiktok: string;
  friendship_status: FriendshipStatusType;
  friendship_requester_id: string;
  is_blocked: boolean;
}

export interface MomentUploadProgressBarType {
  status: MomentUploadStatusType;
  momentId: string;
  originalVideoDuration: number | undefined;
  momentInfo: {
    type: 'image' | 'video';
    uri: string;
    caption: string;
    category: string;
    tags: {
      x: number;
      y: number;
      z: number;
      user_id: string;
    }[];
  };
}

export enum MomentUploadStatusType {
  UploadingToS3 = 'UploadingToS3',
  WaitingForDoneProcessing = 'WaitingForDoneProcessing',
  Done = 'Done',
  Error = 'Error',
}

export interface SocialAccountType {
  handle?: string;
  profile_pic?: string;
  posts?: Array<SimplePostType> | Array<TwitterPostType>;
}

interface TwitterReplyType {
  type: 'tweet' | 'reply' | 'retweet';
  handle: string;
  profile_pic: string;
  text: string;
  // Not going to display any images here
  timestamp: string;
  permalink: string;
}

export interface TwitterPostType {
  type: 'tweet' | 'reply' | 'retweet';
  handle: string;
  profile_pic: string;
  text: string;
  timestamp: string;
  media_url: string[];
  permalink: string;
  in_reply_to?: TwitterReplyType;
}

export interface SimplePostType {
  post_id: string;
  username: string;
  profile_pic: string;
  media_url: string[];
  media_type: 'text' | 'photo';
  caption: string;
  timestamp: string;
  permalink: string;
}

export interface PostType {
  owner: UserType;
  social: string;
  socialHandle?: string;
  data: SimplePostType | undefined;
}

export interface LinkerType {
  label: string;
}

export interface MomentType {
  moment_id: string;
  caption: string;
  date_created: string;
  moment_category: string;
  moment_url: string;
  thumbnail_url: string;
  view_count: number;
  share_count: number;
}

export interface MomentPostType extends MomentType {
  comments_count: number;
  user: ProfilePreviewType;
  selColor: string;
}

export type MomentContextType = {
  currentVisibleMomentId: string | undefined;
  isDiscoverMoment: boolean;
};

export type OnboardingContextType = {
  isVip: boolean;
  setIsVip: (isVip: boolean) => void;
  phone: string | undefined;
  setPhone: (phone: string) => void;
  firstName: string | undefined;
  setFirstName: (firstName: string) => void;
  lastName: string | undefined;
  setLastName: (lastName: string) => void;
  username: string | undefined;
  setUsername: (username: string) => void;
  password: string | undefined;
  setPassword: (password: string) => void;
  age: string | undefined;
  setAge: (age: string) => void;
  gender: string | undefined;
  setGender: (age: string) => void;
  email: string | undefined;
  setEmail: (email: string) => void;
  userId: string | undefined;
  setUserId: (userId: string) => void;
  token: string | undefined;
  setToken: (token: string) => void;
};

export interface MomentCommentPreviewType {
  commenter: ProfilePreviewType;
  comment: string;
}

export interface MomentTagType {
  id: string;
  user: ProfilePreviewType;
  x: number;
  y: number;
  z: number;
}

export interface CommentBaseType {
  comment_id: string;
  comment: string;
  date_created: string;
  commenter: ProfilePreviewType;
  user_reaction: ReactionType | null;
  reaction_count: number;
}

export interface CommentType extends CommentBaseType {
  moment_id: string;
  replies_count: number;
}

export interface CommentThreadType extends CommentBaseType {
  parent_comment: CommentType;
}

export type PreviewType =
  | 'Comment'
  | 'Search'
  | 'Recent'
  | 'Discover Users'
  | 'Friend'
  | 'Suggested People Drawer'
  | 'Suggested People Screen'
  | 'Tag Selection'
  | 'Share Moment Drawer';

export enum ScreenType {
  DiscoverMoments = 'DISCOVER_MOMENTS',
  Upload = 'UPLOAD',
  Profile = 'PROFILE',
  Search = 'SEARCH',
}

/**
 * Redux store to have a Record of ScreenType (Search, Profile, Home etc) mapped to
 * A Record of userIXd mapped to UserXType
 * This combined information will go in to the redux store like : Record<ScreenType, Array<Record<string, UserXType>>
 * We will call this slice of store userX
 * We reset information on this record as soon as the stack corresponding to the screen is reset.
 */
export interface UserXType {
  friends: ProfilePreviewType[];
  moments: MomentPostType[];
  socialAccounts: Record<string, SocialAccountType>;
  momentCategories: string[];
  user: UserType;
  profile: ProfileInfoType;
  avatar: string | undefined;
  cover: string | undefined;
  profileTemplate: ProfileTemplateType;
}

export interface SkinType {
  id: string;
  template_type: TemplateEnumType;
  primary_color: string;
  secondary_color: string;
  bio_color_start: string;
  bio_color_end: string;
  bio_text_color: string;
  active: boolean;
}

export interface ProfileTemplateType {
  widgetStore: Record<string, WidgetType[]>;
  skin: SkinType;
}

/**
 * Gradient type to accomodate new g background gradients for Tagg
 */
export enum BackgroundGradientType {
  Light,
  Dark,
  Notification,
}
export interface BACKGROUND_GRADIENT_STYLE_TYPE {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

/**
 * Linked List style type to accomodate for reusable TaggPopup for displaying popups or running a tutorial
 */
export type TaggPopupType = {
  messageHeader: string;
  messageBody: string;
  next?: TaggPopupType;
};

export interface MomentWithUserType extends MomentType {
  user: ProfilePreviewType;
}

export interface CommentNotificationType {
  comment_id: string;
  notification_data: MomentWithUserType;
}

export interface ThreadNotificationType extends CommentNotificationType {
  parent_comment: string;
}
export interface ContentProps {
  y: Animated.SharedValue<number>;
  userXId: string | undefined;
  screenType: ScreenType;
  setScrollEnabled: (enabled: boolean) => void;
  profileBodyHeight: number;
  socialsBarHeight: number;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
}

export type NotificationType = {
  actor: ProfilePreviewType;
  verbage: string;
  notification_type: TypeOfNotification;
  notification_object: CommentNotificationType | ThreadNotificationType | MomentType | undefined;
  timestamp: string;
  unread: boolean;
};

export type TypeOfNotification =
  // notification_object is undefined
  | 'DFT'
  // notification_object is undefined
  | 'FRD_REQ'
  // notification_object is undefined
  | 'FRD_ACPT'
  // notification_object is undefined
  | 'FRD_DEC'
  // notification_object is CommentNotificationType || ThreadNotificationType
  | 'CMT'
  // notification_object is MomentType
  | 'MOM_3+'
  // notification_object is MomentType
  | 'MOM_FRIEND'
  // notification_object is undefined
  | 'INVT_ONBRD'
  // notification_object is MomentType
  | 'MOM_TAG'
  // notification_object is undefined
  | 'SYSTEM_MSG'
  // notification_object is undefined
  | 'P_VIEW'
  | 'CLICK_TAG'
  | 'M_VIEW';

export type FriendshipType = {
  status: FriendshipStatusType;
  requester_id: string;
};

export type SearchCategoryType = {
  id: number;
  name: string;
  category: string;
};

export type ContactType = {
  phone_number: string;
  first_name: string;
  last_name: string;
};

export type UniversityBadgeType = 'Search' | 'Crest';

export enum ReactionOptionsType {
  Like = 'LIKE',
}
export enum Banner {
  SHOW = 'SHOW',
  TEXT = 'TEXT',
  POINT = 'POINT',
  EMPTY = 'EMPTY',
}
export enum InternetBanner {
  SHOW = 'INTERNETSHOW',
}

export enum CommunityPopup {
  SHOW = 'SHOW',
}

export type ReactionType = {
  id: string;
  type: ReactionOptionsType;
};
// used to handle direct S3 uploads by packaging presigned_url info into one object
export type PresignedURLResponse = {
  response_msg: string;
  response_url: {
    url: string;
    fields: {
      key: string;
      'x-amz-algorithm': string;
      'x-amz-credential': string;
      'x-amz-date': string;
      policy: string;
      'x-amz-signature': string;
    };
  };
};

// To receive moment Id of object created after video upload
export type CreateVideoMomentResponse = {
  response_msg: string;
  moment_id: string;
};

export type ShareToType =
  | 'Search'
  | 'Copy Link'
  | 'Snapchat'
  | 'Twitter'
  | 'Facebook'
  | 'Messenger'
  | 'Instagram'
  | 'Stories'
  | 'SMS'
  | 'Others';

export enum TaggToastType {
  Error = 'ERROR',
  Success = 'SUCCESS',
}

export enum EnvironmentType {
  DEV = 'DEV',
  UAT = 'UAT',
  PROD = 'PROD',
}

export type ProfileContextType = {
  screenType: ScreenType;
  ownProfile: boolean;
  userXId: string | undefined;
  templateChoice: TemplateEnumType;
  moments: MomentPostType[];
  environment: EnvironmentType;
  primaryColor: string;
  secondaryColor: string;
  draggingWidgets: boolean;
  setDraggingWidgets: (dragging: boolean) => void;
  setScrollPosition: (number: number) => void;
  scrollPosition: number;
  setActiveTab: (routeName: string) => void;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  is_blocked: boolean;
  widgetStore?: any;
};

export type ProfileHeaderContextType = {
  name: string;
  tagg_score: number;
  biography: string;
  username: string;
  profile: ProfileInfoType;
  avatar: string | undefined;
  cover: string | undefined;
  onPressAcceptFriendRequest: () => void;
  onPressDeclineFriendRequest: () => void;
  bioTextColor?: string;
  bioColorStart?: string;
  bioColorEnd?: string;
};

export enum TemplateEnumType {
  One = 'ONE',
  Two = 'TWO',
  Three = 'THREE',
  Four = 'FOUR',
  Five = 'FIVE',
}

export type TemplateSchemaType = {
  templateType: TemplateEnumType;
  numColumns: number;
};

export enum PhoneStatusType {
  AVAILABLE = 'AVAILABLE',
  REGISTERED = 'REGISTERED',
  ON_WAITLIST = 'ON_WAITLIST',
  INVALID_FORMAT = 'INVALID_FORMAT',
}
export type SuggestedPeopleDataType = {};

export enum ProfileInsightsEnum {
  Week = 7,
  DoubleWeek = 14,
  Month = 30,
  Lifetime = 'LIFETIME',
}

export type SkinListType = {
  name: TemplateEnumType;
  displayName: string;
  demoPicture: any;
  primaryColor: string;
  secondaryColor: string;
};

export enum ASYNC_STORAGE_KEYS {
  HAS_SEEN_BADGE_TUTORIAL = 'hasSeenBadgeTutorial',
  USER_ID = 'userId',
  USERNAME = 'username',
  TOKEN = 'token',
  PROFILE_TUTORIAL_STAGE = 'profile_tutorial_stage',
  NOTIFICATIONS_LAST_SEEN = 'notificationLastViewed',
  WATCHED_INTRO_VIDEO = 'watchedIntroVideo',
  RESPONDED_ACCESS_CONTACTS = 'respondedToAccessContacts',
  FCM_TOKEN = '@fcmToken',
  RECENTLY_SEARCHED_USERS_KEY = '@recently_searched_users',
  RECENTLY_SEARCHED_CATEGORIES_KEY = '@recently_searched_categories',
  CHAT_TOKEN = 'chatToken',
  ANALYTICS_ENABLED = 'analyticsEnabled',
}

export enum TaggScoreActionsEnum {
  MOMENT_SHARE = 'MOMENT_SHARE',
  PROFILE_SHARE = 'PROFILE_SHARE',
  MOMENT_POST = 'MOMENT_POST',
}

export enum TaggScoreBannerText {
  MOMENT_SHARE = 'Moment shared successfully',
  COMMENT = 'Comment',
  MOMENT_POST = 'Posting a Moment',
  PAGE_EDIT = 'Page edited successfully',
  PAGE_CREATE = 'Page created',
  TAGG_ADD = 'Tagg added successfully',
  TAGG_EDIT = 'Tagg edited successfully',
  PROFILE_LINK_READY_TO_SHARE = 'Profile link ready to share!',
}

export enum ProfileTutorialStage {
  SHOW_TUTORIAL_VIDEOS = 0,
  SHOW_STEWIE_GRIFFIN = 1,
  SHOW_POST_MOMENT_1 = 2,
  TRACK_LOGIN_AFTER_POST_MOMENT_1 = 3,
  SHOW_POST_MOMENT_2 = 4,
  COMPLETE = 5,
}
export enum RewardType {
  FIRST_MOMENT_POSTED = 'FIRST_MOMENT_POSTED',
  SHARE_PROFILE_TO_ENABLE_ANALYTICS = 'SHARE_PROFILE_TO_ENABLE_ANALYTICS',
  IMAGE_BACKGROUNG_TO_MOMENT_TAGG = 'IMAGE_BACKGROUNG_TO_MOMENT_TAGG',
  PROFILE_GRADIENT_BG_COLOR = 'PROFILE_GRADIENT_BG_COLOR',
  TAB_GRADIENT_BG_COLOR = 'TAB_GRADIENT_BG_COLOR',
}

export type TaggsClickCountType = {
  total: number;
  individual: TaggClickCountTaggType[];
};

export type TaggClickCountSummaryType = {
  total: number;
  top_tagg: TaggClickCountTaggType[];
};

export type TaggClickCountTaggType = {
  image: ImageProps;
  title: string;
  link_type: WidgetLinkType;
  views: number;
};

export type GraphDataType = {
  labels: string[];
  values: number[];
};

export type ProfileViewsCountType = {
  total_views: number;
  distribution: GraphDataType;
};

export type ProfileViewsCountSummaryType = {
  total_views: number;
};

export type ActiveScreenProps = {
  activeScreen: string;
};

export type TabBarProps = {
  count?: boolean;
  activeScreen: string;
};

export type SkinPermissionType = {
  background_permission?: boolean;
  tab_permission?: boolean;
};
