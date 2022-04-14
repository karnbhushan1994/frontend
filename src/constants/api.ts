// Dev

// const BASE_URL: string = 'http://127.0.0.1:8000/';
const BASE_URL: string = 'http://18.118.96.54/';

// Prod
//const BASE_URL: string = 'https://app-prod2.tagg.id/';
// const BASE_URL: string = 'https://app-prod3.tagg.id/';

export const MIXPANEL_DEV = 'd441390bb8effac8d84f4d660b893fb8';
export const MIXPANEL_PROD = '5f393086e14172281e6636b7fe6059c2';

const API_URL: string = BASE_URL + 'api/';
export const LOGIN_ENDPOINT: string = API_URL + 'login/';
export const VERSION_ENDPOINT: string = API_URL + 'version/';
export const REGISTER_ENDPOINT: string = API_URL + 'register/';
export const REGISTER_VALIDATE_ENDPOINT: string = API_URL + 'register/validate/';
export const PHONE_STATUS_ENDPOINT: string = API_URL + 'phone/status/';
export const EDIT_PROFILE_ENDPOINT: string = API_URL + 'edit-profile/';
export const SEND_OTP_ENDPOINT: string = API_URL + 'send-otp/';
export const VERIFY_OTP_ENDPOINT: string = API_URL + 'verify-otp/';
export const USER_PROFILE_ENDPOINT: string = API_URL + 'profile/';
export const USER_PROFILE_VISITED_ENDPOINT: string = API_URL + 'profile/visited/';
export const PROFILE_TUTORIAL_ENDPOINT: string = USER_PROFILE_ENDPOINT + 'tutorial/';
export const PROFILE_INFO_ENDPOINT: string = API_URL + 'user-profile-info/';
export const HEADER_PHOTO_ENDPOINT: string = API_URL + 'header-pic/';
export const PROFILE_PHOTO_ENDPOINT: string = API_URL + 'profile-pic/';
export const PROFILE_PHOTO_THUMBNAIL_ENDPOINT: string = API_URL + 'profile-thumbnail/';
export const GET_IG_POSTS_ENDPOINT: string = API_URL + 'posts-ig/';
export const GET_FB_POSTS_ENDPOINT: string = API_URL + 'posts-fb/';
export const GET_TWITTER_POSTS_ENDPOINT: string = API_URL + 'posts-twitter/';
export const SEARCH_ENDPOINT: string = API_URL + 'search/';
export const SEARCH_ENDPOINT_MESSAGES: string = API_URL + 'search/messages/';
export const SEARCH_ENDPOINT_SUGGESTED: string = API_URL + 'search/suggested/';
export const MOMENTS_ENDPOINT: string = API_URL + 'moments/';
export const CREATE_VIDEO_MOMENT_ENDPOINT: string = MOMENTS_ENDPOINT + 'create_video/';
export const MOMENT_TAGS_ENDPOINT: string = API_URL + 'moments/tags/';
export const MOMENTTAG_ENDPOINT: string = API_URL + 'moment-tag/';
export const MOMENT_THUMBNAIL_ENDPOINT: string = API_URL + 'moment-thumbnail/';
export const MOMENT_VIEWED_ENDPOINT: string = API_URL + 'moment-view/';
export const MOMENT_COIN_ENDPOINT: string = API_URL + 'moment-coin-display/?moment_id=';
export const MOMENT_SHARE_ENDPOINT: string = API_URL + 'moment-share/';
export const VERIFY_INVITATION_CODE_ENDPOUNT: string = API_URL + 'verify-code/';
export const COMMENTS_ENDPOINT: string = API_URL + 'comments/';
export const COMMENT_REACTIONS_ENDPOINT: string = API_URL + 'reaction-comment/';
export const COMMENT_REACTIONS_REPLY_ENDPOINT: string = API_URL + 'reaction-reply/';
export const PRESIGNED_URL_ENDPOINT: string = API_URL + 'presigned-url/';
export const CHECK_MOMENT_UPLOAD_DONE_PROCESSING_ENDPOINT: string =
  API_URL + 'moments/check_done_processing/';
export const FRIENDS_ENDPOINT: string = API_URL + 'friends/';
export const ALL_USERS_ENDPOINT: string = API_URL + 'users/';
export const REPORT_ISSUE_ENDPOINT: string = API_URL + 'report/';
export const BLOCK_USER_ENDPOINT: string = API_URL + 'block/';
export const PASSWORD_RESET_ENDPOINT: string = API_URL + 'password-reset/';
export const MOMENT_CATEGORY_ENDPOINT: string = API_URL + 'moment-category/';
export const NOTIFICATIONS_ENDPOINT: string = API_URL + 'notifications/';
export const NOTIFICATIONS_COUNT_ENDPOINT: string = API_URL + 'notifications/unread_count/';
export const NOTIFICATIONS_DATE: string = API_URL + 'notifications/seen/';
export const DISCOVER_ENDPOINT: string = API_URL + 'discover/';
export const DISCOVER_MOMENTS_ENDPOINT: string = API_URL + 'discover-moments/';
export const UPDATE_DM_VIEW_STAGE: string = DISCOVER_MOMENTS_ENDPOINT + 'update_dm_view_stage/';
export const SEARCH_BUTTONS_ENDPOPINT: string = DISCOVER_ENDPOINT + 'search_buttons/';
export const LIMITED_DISCCOVER_MOMENTS_ENDPOINT: string = API_URL + 'momentList/';
export const WAITLIST_USER_ENDPOINT: string = API_URL + 'waitlist-user/';
export const COMMENT_THREAD_ENDPOINT: string = API_URL + 'reply/';
export const GAME_PROFILE_ENDPOINT: string = API_URL + 'game_profile/';
export const UNWRAP_REWARD_ENDPOINT: string = GAME_PROFILE_ENDPOINT + 'unwrap_reward/';

// Profile Skins
export const SKIN_ENDPOINT: string = API_URL + 'skin/';
export const ACTIVE_SKIN_ENDPOINT: string = SKIN_ENDPOINT + 'get_active/';
//Thumbnail

export const ThumbnailForTaggs: string = API_URL + 'presigned-url-thumbnail/';

//Tagg BG
export const TAGG_BG: string = API_URL + 'unlock_background/';

//Widgets
export const APPLICATION_LINK_WIDGET: string = API_URL + 'application_link_widget/';
export const WIDGET: string = API_URL + 'widget/';
export const WIDGET_STORE: string = API_URL + 'widget/store/';
export const VIDEO_LINK_WIDGET: string = API_URL + 'video_link_widget/';
export const SOCIAL_MEDIA_WIDGET: string = API_URL + 'social_media_widget/';
export const GENERIC_LINK_WIDGET: string = API_URL + 'generic_link_widget/';
// NEW WIDGET FOR 1519 TICKET
export const DISPLACE_WIDGET: string = API_URL + 'widget/store_widget/';

export const USER_INTERESTS_ENDPOINT: string = API_URL + 'user_interests/';

// Rate Us
export const LOGIN_COUNT_ENDPOINT: string = API_URL + 'login_count/';
export const SKIN_COUNT_ENDPOINT: string = API_URL + 'skin/skin_count/';

// Register as FCM device
export const FCM_ENDPOINT: string = API_URL + 'fcm/';

// Retrieve Stream Chat token
export const CHAT_ENDPOINT: string = API_URL + 'chat/';
export const CHAT_TOKEN_ENDPOINT: string = CHAT_ENDPOINT + 'get_token/';

// Register Social Link (Non-integrated)
export const LINK_SNAPCHAT_ENDPOINT: string = API_URL + 'link-sc/';
export const LINK_TIKTOK_ENDPOINT: string = API_URL + 'link-tt/';

// Register Social Link (Integrated)
export const LINKED_SOCIALS_ENDPOINT: string = API_URL + 'linked-socials/';
export const LINK_IG_ENDPOINT: string = API_URL + 'link-ig/';
export const LINK_FB_ENDPOINT: string = API_URL + 'link-fb/';
export const LINK_TWITTER_ENDPOINT: string = API_URL + 'link-twitter/';
export const TOP_TAGGS_TODAY: string = API_URL + 'tagg_shop/top_taggs_today/';

// Social Link OAuth
export const DEEPLINK: string = 'https://tinyurl.com/y3o4aec5';
export const LINK_IG_OAUTH: string = `https://www.instagram.com/oauth/authorize/?client_id=205466150510738&redirect_uri=${DEEPLINK}&scope=user_profile,user_media&response_type=code`;
export const LINK_FB_OAUTH: string = `https://www.facebook.com/v8.0/dialog/oauth?client_id=1308555659343609&redirect_uri=${DEEPLINK}&scope=user_posts,public_profile&response_type=code`;
export const LINK_TWITTER_OAUTH: string = API_URL + 'link-twitter-request/';

// Profile Links
export const COMMUNITY_GUIDELINES: string = 'https://www.tagg.id/community-guidelines';
export const PRIVACY_POLICY: string = 'https://www.tagg.id/privacy';

// Sharing tagg content
export const TAGG_REDIRECT_URL: string = 'https://redirect.tagg.id/';

// Insights
export const INSIGHTS_BASE_URL: string = API_URL + 'insights/';
export const INSIGHTS_TAGGS_ENDPOINT: string = INSIGHTS_BASE_URL + 'taggs/';
export const INSIGHTS_TAGGS_SUMMARY_ENDPOINT: string = INSIGHTS_TAGGS_ENDPOINT + 'summary/';
export const INSIGHTS_PROFILE_ENDPOINT: string = INSIGHTS_BASE_URL + 'profile/';
export const INSIGHTS_PROFILE_SUMMARY_ENDPOINT: string = INSIGHTS_PROFILE_ENDPOINT + 'summary/';
export const CHECK_INSIGHT_REWARD_ENDPOINT: string = API_URL + 'rewardCheck/';
export const INSIGHTS_MOMENTS_ENDPOINT: string = INSIGHTS_BASE_URL + 'moments/';
export const INSIGHTS_MOMENTS_SUMMARY_ENDPOINT: string = INSIGHTS_MOMENTS_ENDPOINT + 'summary/';

// unlock font
export const IS_UNLOCKED_TAGG_TITTLE_FONT: string = API_URL + 'unlock_tagg_title_font/is_unlocked/';
export const UNLOCK_TAGG_TITTLE_FONT: string = API_URL + 'unlock_tagg_title_font/unlock/';
export const IS_UNLOCKED_TAGG_THUMBNAIL: string = API_URL + 'unlock_tagg_thumbnail/is_unlocked/';
export const UNLOCK_TAGG_THUMBNAIL: string = API_URL + 'unlock_tagg_thumbnail/unlock/';

// incremet coins
export const INCREMENT_COINS: string = API_URL + 'rewards-add/';
export const PERMISSION_POST_API: string = API_URL + 'permission/';

export const SKIN_PERMISSION = API_URL + 'skin-permission/';
