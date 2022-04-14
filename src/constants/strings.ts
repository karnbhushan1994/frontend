// Below is the regex to convert this into a csv for the Google Sheet
// export const (.*) = .*?(['|"|`])(.*)\2;
// replace with: $1\t$3
export const ADD_COMMENT_TEXT = (username?: string) =>
  username ? `Reply to ${username}` : 'Add a comment...';
export const APP_STORE_LINK =
  'https://apps.apple.com/us/app/tagg-discover-your-community/id1537853613';
export const COMING_SOON_MSG = 'Creating more fun things for you, surprises coming soon 😉';
export const ERROR_ATTEMPT_EDIT_SP =
  "Can't let you do that yet! Please onboard Suggested People first!";
export const ERROR_AUTHENTICATION = 'An error occurred during authentication. Please login again!';
export const ERROR_BADGES_EXCEED_LIMIT = "You can't have more than 5 badges!";
export const ERROR_CATEGORY_CREATION =
  'There was a problem creating your categories. Please refresh and try again.';
export const ERROR_CATEGORY_UPDATE =
  'There was a problem updating your categories. Please refresh and try again';
export const ERROR_CHAT_CONNECTION = 'Unable to establish chat connection';
export const ERROR_DELETE_CATEGORY =
  'There was a problem while deleting category. Please try again';
export const ERROR_DELETE_MOMENT = 'Unable to delete moment, please try again later!';
export const ERROR_DELETED_OBJECT =
  'Oh sad! Looks like the comment / moment was deleted by the user';
export const ERROR_DOUBLE_CHECK_CONNECTION =
  'Please double-check your network connection and retry';
export const ERROR_DUP_OLD_PWD = 'You may not use a previously used password';
export const ERROR_EMAIL_IN_USE = 'Email already in use, please try another one';
export const ERROR_FAILED_LOGIN_INFO =
  'Login failed, please try re-entering your login information';
export const ERROR_FAILED_TO_COMMENT_500 = 'Unable to post comment, refresh and try again!';
export const ERROR_FAILED_TO_COMMENT_403 = 'Unable to post comment!';
export const ERROR_FAILED_TO_CREATE_CHANNEL = 'Failed to create a channel, Please try again!';
export const ERROR_FAILED_TO_DELETE_COMMENT = 'Unable to delete comment, refresh and try again!';
export const ERROR_FAILED_TO_INVITE_CONTACT = 'Unable to invite contact, refresh and try again!';
export const ERROR_FAILED_TO_OPEN_MOMENT_DEEPLINK =
  'Something went wrong, unable to open that moment';
export const ERROR_INVALID_INVITATION_CODE =
  'Invitation code invalid, try again or talk to the friend that sent it 😬';
export const ERROR_INVALID_LOGIN = 'Invalid login, Please login again';
export const ERROR_INVALID_PWD_CODE =
  'Looks like you have entered the wrong code, please try again';
export const ERROR_INVALID_VERIFICATION_CODE =
  'Invalid verification code, try re-entering or tap the resend code button for a new code';
export const ERROR_INVALID_VERIFICATION_CODE_FORMAT =
  'Please enter the 6 digit code sent to your phone';
export const ERROR_INVLAID_CODE = 'The code entered is not valid!';
export const ERROR_LINK = (str: string) =>
  `Unable to link with ${str}, Please check your login and try again`;
export const ERROR_LOGIN = 'There was a problem logging you in, please refresh and try again';
export const ERROR_LOGIN_FAILED = 'Login failed. Check your username and password, and try again';
export const ERROR_MOMENT_UPLOAD_IN_PROGRESS = 'Please wait, there is a Moment upload in progress.';
export const ERROR_NEXT_PAGE =
  'There was a problem while loading the next page 😓, try again in a couple minutes';
export const ERROR_NO_CONTACT_INVITE_LEFT = 'You have no more invites left!';
export const ERROR_NO_MOMENT_CATEGORY = 'Please select a category!';
export const ERROR_NOT_ONBOARDED =
  'You are now on waitlist, please enter your invitation code if you have one';
export const ERROR_PHONE_IN_USE = 'Phone already in use, please try another one';
export const ERROR_PROFILE_CREATION_SHORT = 'Profile creation failed 😓';
export const ERROR_PROFILE_UPDATE_SHORT = 'Profile update failed. 😔';
export const ERROR_PWD_ACCOUNT = (str: string) =>
  `Please make sure that the email / username entered is registered with us. You may contact our customer support at ${str}`;
export const ERROR_REGISTRATION = (str: string) => `Registration failed 😔, ${str}`;
export const ERROR_SELECT_BIRTHDAY = 'Please select your birthday';
export const ERROR_SELECT_CLASS_YEAR = 'Please select your Class Year';
export const ERROR_SELECT_GENDER = 'Please select your gender';
export const ERROR_SELECT_UNIVERSITY = 'Please select your University';
export const ERROR_SERVER_DOWN =
  'mhm, looks like our servers are down, please refresh and try again in a few mins';
export const ERROR_SOMETHING_WENT_WRONG =
  'Oh dear, don’t worry someone will be held responsible for this error, In the meantime refresh the app';
export const ERROR_SOMETHING_WENT_WRONG_REFRESH =
  "Ha, looks like this one's on us, please refresh and try again";
export const ERROR_SOMETHING_WENT_WRONG_RELOAD =
  "You broke it, Just kidding! we don't know what happened... Please reload the app and try again";
export const ERROR_T_AND_C_NOT_ACCEPTED = 'You must first agree to the terms and conditions.';
export const ERROR_TWILIO_SERVER_ERROR =
  'mhm, looks like that is an invalid phone number or our servers are down, please try again in a few mins';
export const ERROR_UNABLE_CONNECT_CHAT = 'Unable to connect chat';
export const ERROR_UNABLE_TO_FIND_PROFILE =
  'We were unable to find this profile. Please check username and try again';
export const ERROR_UNABLE_TO_VIEW_PROFILE = 'Unable to view this profile';
export const ERROR_UPLOAD = 'An error occurred while uploading. Please try again!';
export const ERROR_UPLOAD_BADGES = 'Unable to upload your badges. Please retry!';
export const ERROR_UPLOAD_EXCEED_MAX_VIDEO_DURATION = "Video can't be longer than 60 seconds!";
export const ERROR_UPLOAD_LARGE_PROFILE_PIC =
  "Can't have the first image seen on the profile be blank, please upload a large picture";
export const ERROR_UPLOAD_MOMENT = 'Unable to upload moment. Please retry';
export const ERROR_UPLOAD_SMALL_PROFILE_PIC =
  "Can't have a profile without a pic to represent you, please upload a small profile picture";
export const ERROR_UPLOAD_SP_PHOTO = 'Unable to update suggested people photo. Please retry!';
export const ERROR_VERIFICATION_FAILED_SHORT = 'Verification failed 😓';
export const FIRST_MESSAGE = 'How about sending your first message to your friend';
export const INVITE_USER_SMS_BODY = (
  invitedUserName: string,
  invitee: string,
  inviteCode: string,
) =>
  `Hey ${invitedUserName}!\nYou've been tagged by ${invitee}. Follow the instructions below to skip the line and join them on Tagg!\nSign up and use this code to get in: ${inviteCode}\n ${APP_STORE_LINK}`;
export const MARKED_AS_MSG = (str: string) => `Marked as ${str}`;
export const MOMENT_DELETED_MSG =
  'Moment deleted....Some moments have to go, to create space for greater ones';
export const NO_NEW_NOTIFICATIONS = 'You have no new notifications';
export const NO_RESULTS_FOUND = 'No Results Found!';
export const PRIVATE_ACCOUNT = 'This account is private';
export const START_CHATTING = 'Let’s Start Chatting!';
export const SUCCESS_CATEGORY_DELETE = 'Category successfully deleted, but its memory will live on';
export const SUCCESS_CONFIRM_INVITE_CONTACT_MESSAGE = 'Use one now?';
export const SUCCESS_CONFIRM_INVITE_CONTACT_TITLE = (str: string) =>
  `You have ${str} invites left!`;
export const SUCCESS_INVITATION_CODE = 'Welcome to Tagg!';
export const SUCCESS_INVITE_CONTACT = (str: string) => `Success! You now have ${str} invites left!`;
export const SUCCESS_LAST_CONTACT_INVITE =
  'Done! That was your last invite, hope you used it wisely!';
export const SUCCESS_LINK = (str: string) => `Successfully linked ${str} 🎉`;
export const SUCCESS_PIC_UPLOAD = 'Beautiful, the Moment was uploaded successfully!';
export const SUCCESS_PWD_RESET = 'Your password was reset successfully!';
export const SUCCESS_EDIT_MOMENT_PAGE = 'Your page was edited successfully! 🎉';
export const SUCCESS_VERIFICATION_CODE_SENT =
  'New verification code sent! Check your phone messages for your code';
export const UP_TO_DATE = 'Up-to-Date!';
export const UPLOAD_MOMENT_PROMPT_ONE_MESSAGE =
  'Post your first moment to\n continue building your digital\nidentity!';
export const UPLOAD_MOMENT_PROMPT_THREE_HEADER = 'Continue to build your profile';
export const UPLOAD_MOMENT_PROMPT_THREE_MESSAGE =
  'Continue to personalize your own digital space in\nthis community by filling your profile with\ncategories and moments!';
export const UPLOAD_MOMENT_PROMPT_TWO_HEADER = 'Create a new page';
export const ERROR_MOMENT_UNAVAILABLE = 'Moment no longer available';
export const ERROR_MESSAGE = 'No longer available';
export const SIGNUP_TOOLTIP = 'Fill out first and last name';
export const SIGNUP = 'Sign up';
export const WEBSITE_TOOLTIP = 'Invalid link';
export const USERNAME_TOOLTIP = 'Invalid Username';
export const FULLNAME = 'Full Name';
export const USERNAME = 'Username';
export const NAME = 'name';
export const SELECTIONCOLOR = 'white';
export const AUTOCAPITALIZE = 'none';
export const RETURNKEY = 'done';
export const PASSWORD_TOOLTIP =
  'Password must contain an lowercase, uppercase and a special character';
export const PASSWORD = 'Password';
export const PASSWORD_AUTOCOMPLETE = 'password';
export const PASSWORD_CONTENTTYPE = 'oneTimeCode';
export const PHONENUMBER_TITLE = 'Phone number';
export const PHONENUMBER_TOOLTIP = 'Please enter a valid phone number';
export const PHONENUMBER_PLACEHOLDER = '+1 (210) 289 - 9876';
export const PHONENUMBER_MASKSTRING = '+1 ([000]) [000] - [0000]';
export const PHONENUMBER_KEYBOARD_TYPE = 'number-pad';
export const EMAIL_PLACEHOLDER = 'Enter email';
export const EMAIL_AUTOCOMPLETE = 'email';
export const EMAIL_CONTENTTYPE = 'emailAddress';
export const EMAIL_KEYBOARDTYPE = 'email-address';
export const EMAIL_TOOLTIP = 'Please enter a valid email';
export const EMAIL_TITLE = 'Email';
export const INSTAGRAM_TITLE = 'Instagram handle';
export const TIKTOK_TITLE = 'http://tiktok.com';
export const INSTAGRAM = 'Instagram';
export const TIKTOK = 'TikTok';
export const TIKTOk_SUBHEADER = 'Add a link to your profile or most viral video';
export const CREATE_ACCOUNT = 'Create an account';
export const CREATE_PAGE = 'Create a page';
export const PREVIEW = 'Preview';
export const NAME_A_PAGE = 'Give your page a name';
export const DELETE_PAGE = 'Delete Page';
export const FB_BUTTON_TITLE = 'Sign in with Facebook';
export const GOOGLE_BUTTON_TITLE = 'Sign in with Google';
export const SKIP_TITLE = 'Skip';
export const ALREADY_ACCOUNT = 'Already have an account?  ';
export const LOGIN_TITLE = 'Log In';
export const ARROW_DIRECTION = 'backward';
export const SHOW_PASSWORD = 'Show Password';
export const HIDE_PASSWORD = 'Hide Password';
export const INVITE_TEXT = 'Got your invite text?';
export const WAITING_LIST = "Hey creative, you're on the waitlist!";
export const WAITING_LIST_SUBTEXT =
  'One step closer to the place where branding yourself is a social activity.';
export const WAITING_IG_TEXT = 'psst follow us on IG to get off the waitlist faster';
export const SIGNIN_TITLE = 'Sign in';
export const INVALID_WARNING =
  'Username must be at least 6 characters and can only contain letters, numbers, periods, and underscores.';
export const NEXT_RETURNTYPE = 'next';
export const GO_RETURNTYPE = 'go';
export const VERIFY = 'Verify';
export const CREATE = 'Create';
export const NEXT = 'Next';
export const INTEREST_SUB_TITLE =
  'Tell us about yourself by selecting 3 interests that best describe you.';
export const INTEREST_TITLE = 'Let your interests guide you!';
export const BUILD_PROFILE_TITLE = 'Time to build your profile✨';
export const BUILD_PROFILE_SUBTITLE =
  'You will swipe through different skins to start your design. Remember this is your space and you have full creative freedom over it!';
export const SHOW_ALL = 'Show All +';
export const SHOW_LESS = 'Show Less -';
export const SHARE_THIS_PROFILE_BUTTON_TEXT = 'Share this Profile';
export const SHARE_PROFILE_BUTTON_TEXT = 'Share Profile';
export const ERROR_EDIT_MOMENT_PAGE = 'There was a problem editing your page. Please try again!';
export const LOGGED_IN_USER_TIER_ONE_TEXT =
  'Show every and anything you want. The more you share, the faster you’ll level up!!!';
export const NEW_KID_ON_BLOCK = 'New kid on the block';
export const OTHER_USER_ONE_TIER =
  'This Creative just arrived! Introduce yourself and welcome them to this social branding community 🤪';
export const I_AGREE_FOR_POLICY = 'By signing up, I confirm that I have read and agreed to Tagg’s';
export const TERM_OF_SERVICES = ' EULA Terms of Service.';
export const COINS_EARNED = 'Coins Earned';
export const NOT_ENOUGH_COINS =
  'Not enough coin, adding taggs and visiting other creators profiles are great way to earn coins!';
export const PERMISSIONSTEXT = 'Permissions';
export const ALLOW_PERMISSION_MESSAGE =
  'Tagg is a link-in-bio app for you to grow your brand, and earn coins! We`ll need you to allow a few permisions to get started';
export const MOMENT_NO_LONGER_AVAILABLE = 'Moment no longer available';
