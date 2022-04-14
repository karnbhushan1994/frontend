import {
  CommentThreadType,
  EnvironmentType,
  MomentPostType,
  MomentUploadProgressBarType,
  NotificationType,
  ProfileInfoType,
  ProfilePreviewType,
  ProfileTemplateType,
  ScreenType,
  SocialAccountType,
  TaggType,
  TemplateEnumType,
  UniversityType,
  UserType,
  UserXType,
  SkinPermissionType,
} from '../types';

export const NO_PROFILE: ProfileInfoType = {
  biography: '',
  website: '',
  name: '',
  gender: '',
  birthday: undefined,
  university_class: 2021,
  university: UniversityType.Empty,
  //Default to an invalid value and ignore it gracefully while showing tutorials / popups.
  profile_tutorial_stage: -1,
  tagg_score: 0,
  rewards: [],
  newRewardsReceived: [],
  snapchat: '',
  tiktok: '',
  friendship_status: 'no_record',
  friendship_requester_id: '',
  is_private: '',
  is_blocked: false,
};

export const EMPTY_MOMENTS_LIST = <MomentPostType[]>[];

export const EMPTY_NOTIFICATIONS_LIST = <NotificationType[]>[];

export const NO_USER: UserType = {
  userId: '',
  username: '',
};

export const USER_TAGG: TaggType = {
  unLockBG: false,
  taggEligiblity: false,
};

export const EMPTY_PROFILE_PREVIEW_LIST = <ProfilePreviewType[]>[];

export const NO_APP_INFO = {
  newVersionAvailable: false,
  environment: EnvironmentType.DEV,
};

export const APP_LOADER = {
  loading: false,
};

export const NO_FRIENDS_DATA = {
  friends: EMPTY_PROFILE_PREVIEW_LIST,
};

export const NO_NOTIFICATIONS = {
  notifications: EMPTY_NOTIFICATIONS_LIST,
};

export const NO_MOMENTS = {
  moments: EMPTY_MOMENTS_LIST,
};

export const NO_SOCIAL_ACCOUNTS: Record<string, SocialAccountType> = {
  Instagram: { posts: [] },
  Facebook: { posts: [] },
  Twitter: { posts: [] },
};

export const NO_TAGG_USERS = {
  recentSearches: EMPTY_PROFILE_PREVIEW_LIST,
};

export const NO_SOCIALS = {
  socialAccounts: NO_SOCIAL_ACCOUNTS,
};

export const NO_BLOCKED_USERS = {
  blockedUsers: EMPTY_PROFILE_PREVIEW_LIST,
};

export const EMPTY_MOMENT_CATEGORIES: string[] = [];

export const EMPTY_PROFILE_TEMPLATE: ProfileTemplateType = {
  widgetStore: {
    Home: [],
  },
  skin: {
    id: '',
    template_type: TemplateEnumType.Four,
    primary_color: 'white',
    secondary_color: 'black',
    bio_color_start: 'black',
    bio_color_end: 'black',
    bio_text_color: 'black',
    active: true,
  },
};

export const NO_USER_DATA = {
  user: <UserType>NO_USER,
  profile: <ProfileInfoType>NO_PROFILE,
  avatar: <string | undefined>undefined,
  cover: <string | undefined>undefined,
  momentUploadProgressBar: <MomentUploadProgressBarType | undefined>undefined,
  newNotificationReceived: false,
  suggestedPeopleImage: '',
  replyPosted: <CommentThreadType | undefined>undefined,
  profileTemplate: <ProfileTemplateType>EMPTY_PROFILE_TEMPLATE,
  widgetsDragChanged: <Boolean>false,
  analyticsStatus: <string>'',
  userBGTaggEligiblity: <TaggType>USER_TAGG,
  skinPermission: <SkinPermissionType>{},
};

/**
 * The dummy userId and username serve the purpose of preventing app crash
 * For instance, if it may happen that data in our store is not loaded yet for the userXId being visited.
 * Then we will set the userXId / username to this dummy username / userid
 */
export const DUMMY_USERID = 'ID-1234-567';
export const DUMMY_USERNAME = 'tagg_userX';

export const EMPTY_USER_X = <UserXType>{
  friends: EMPTY_PROFILE_PREVIEW_LIST,
  moments: EMPTY_MOMENTS_LIST,
  momentCategories: EMPTY_MOMENT_CATEGORIES,
  socialAccounts: NO_SOCIAL_ACCOUNTS,
  user: NO_USER,
  profile: NO_PROFILE,
  avatar: undefined,
  cover: undefined,
  profileTemplate: <ProfileTemplateType>EMPTY_PROFILE_TEMPLATE,
};

/**
 * A dummy userX to always be there in out initial app state
 */
export const EMPTY_USERX_LIST = <Record<string, UserXType>>{
  [DUMMY_USERID]: EMPTY_USER_X,
};

export const EMPTY_SCREEN_TO_USERS_LIST: Record<ScreenType, Record<string, UserXType>> = {
  [ScreenType.DiscoverMoments]: EMPTY_USERX_LIST,
  [ScreenType.Upload]: EMPTY_USERX_LIST,
  [ScreenType.Profile]: EMPTY_USERX_LIST,
  [ScreenType.Search]: EMPTY_USERX_LIST,
};

export const INITIAL_CATEGORIES_STATE = {
  momentCategories: EMPTY_MOMENT_CATEGORIES,
};
