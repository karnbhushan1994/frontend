import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';

import { Alert } from 'react-native';

import { TaggShopData } from 'constants/widgets';
import { makeAction } from 'makeAction';

import { AppDispatch } from 'store/configureStore';
import logger from 'utils/logger';

import {
  CHECK_INSIGHT_REWARD_ENDPOINT,
  EDIT_PROFILE_ENDPOINT,
  GAME_PROFILE_ENDPOINT,
  GET_FB_POSTS_ENDPOINT,
  GET_IG_POSTS_ENDPOINT,
  GET_TWITTER_POSTS_ENDPOINT,
  HEADER_PHOTO_ENDPOINT,
  INSIGHTS_MOMENTS_ENDPOINT,
  INSIGHTS_MOMENTS_SUMMARY_ENDPOINT,
  INSIGHTS_PROFILE_ENDPOINT,
  INSIGHTS_PROFILE_SUMMARY_ENDPOINT,
  INSIGHTS_TAGGS_ENDPOINT,
  INSIGHTS_TAGGS_SUMMARY_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
  PHONE_STATUS_ENDPOINT,
  PROFILE_INFO_ENDPOINT,
  PROFILE_PHOTO_ENDPOINT,
  PROFILE_TUTORIAL_ENDPOINT,
  REGISTER_ENDPOINT,
  REGISTER_VALIDATE_ENDPOINT,
  SEND_OTP_ENDPOINT,
  SKIN_PERMISSION,
  TAGG_BG,
  TAGG_CUSTOMER_SUPPORT,
  UNWRAP_REWARD_ENDPOINT,
  USER_INTERESTS_ENDPOINT,
  USER_PROFILE_ENDPOINT,
  VERIFY_OTP_ENDPOINT,
} from '../constants';
import {
  ERROR_DOUBLE_CHECK_CONNECTION,
  ERROR_DUP_OLD_PWD,
  ERROR_INVALID_PWD_CODE,
  ERROR_PWD_ACCOUNT,
  ERROR_SOMETHING_WENT_WRONG,
  ERROR_SOMETHING_WENT_WRONG_REFRESH,
  SUCCESS_PWD_RESET,
} from '../constants/strings';
import {
  Banner,
  PhoneStatusType,
  ProfileInfoType,
  ProfileInsightsEnum,
  ProfileTutorialStage,
  ProfileType,
  ProfileViewsCountSummaryType,
  ProfileViewsCountType,
  RewardType,
  SocialAccountType,
  TaggClickCountSummaryType,
  TaggsClickCountType,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
} from '../types';

export const loadProfileInfo = async (token: string, userId: string) => {
  try {
    const response = await fetch(PROFILE_INFO_ENDPOINT + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const data: ProfileInfoType = await response.json();
      const birthday = data.birthday;
      return {
        ...data,
        birthday: birthday && moment(birthday).format('YYYY-MM-DD'),
      };
    } else {
      throw 'Unable to load profile data';
    }
  } catch (error) {
    Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
  }
};

export const getProfilePic = async (token: string, userId: string, type: 'profile' | 'header') => {
  try {
    const url = type === 'profile' ? PROFILE_PHOTO_ENDPOINT : HEADER_PHOTO_ENDPOINT;
    const response = await fetch(url + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      return (await response.json()).url;
    }
  } catch (error) {
    logger.log(error);
  }
};

const integratedSocialPostsEndpoints: { [social: string]: string } = {
  Facebook: GET_FB_POSTS_ENDPOINT,
  Instagram: GET_IG_POSTS_ENDPOINT,
  Twitter: GET_TWITTER_POSTS_ENDPOINT,
};

export const loadSocialPosts: (
  userId: string,
  socialType: string,
  token?: string,
) => Promise<SocialAccountType> = async (userId, socialType, token) => {
  if (!token) {
    token = (await AsyncStorage.getItem('token')) ?? '';
  }
  const endpoint = integratedSocialPostsEndpoints[socialType];
  const accountData: SocialAccountType = {};
  accountData.posts = [];
  try {
    const response = await fetch(endpoint + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const body = await response.json();
      accountData.handle = body.handle;
      accountData.posts = body.posts;
      accountData.profile_pic = body.profile_pic;
    }
  } catch (error) {
    logger.log(error);
  }
  return accountData;
};

export const loadRecentlySearchedUsers = async () => {
  try {
    const asyncCache = await AsyncStorage.getItem('@recently_searched_users');
    return asyncCache != null ? JSON.parse(asyncCache) : null;
  } catch (e) {
    logger.log(e);
  }
};

export const handlePasswordResetRequest = async (value: string) => {
  try {
    const response = await fetch(PASSWORD_RESET_ENDPOINT + 'request/', {
      method: 'POST',
      body: JSON.stringify({
        value,
      }),
    });
    const status = response.status;
    if (status === 200) {
      Alert.alert(
        'A code was sent to your registered phone number, please use the same to reset your password',
      );
      return true;
    } else {
      if (status === 404) {
        Alert.alert(
          `Please make sure that the email / username entered is registered with us. You may contact our customer support at ${TAGG_CUSTOMER_SUPPORT}`,
        );
      } else {
        Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
      }

      logger.log(response);
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    return false;
  }
};

export const handlePasswordCodeVerification = async (value: string, otp: string) => {
  try {
    const response = await fetch(PASSWORD_RESET_ENDPOINT + 'verify/', {
      method: 'POST',
      body: JSON.stringify({
        value,
        otp,
      }),
    });
    const status = response.status;
    if (status === 200) {
      return true;
    } else {
      if (status === 404) {
        Alert.alert(ERROR_PWD_ACCOUNT(TAGG_CUSTOMER_SUPPORT));
      } else if (status === 401) {
        Alert.alert(ERROR_INVALID_PWD_CODE);
      } else {
        Alert.alert(ERROR_SOMETHING_WENT_WRONG);
      }

      logger.log(response);
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    return false;
  }
};

export const handlePasswordReset = async (value: string, password: string) => {
  try {
    const response = await fetch(PASSWORD_RESET_ENDPOINT + 'reset/', {
      method: 'POST',
      body: JSON.stringify({
        value,
        password,
      }),
    });
    const status = response.status;
    if (status === 200) {
      Alert.alert(SUCCESS_PWD_RESET);
      return true;
    } else {
      if (status === 404) {
        Alert.alert(ERROR_PWD_ACCOUNT(TAGG_CUSTOMER_SUPPORT));
      } else if (status === 406) {
        Alert.alert(ERROR_DUP_OLD_PWD);
      } else {
        Alert.alert(ERROR_SOMETHING_WENT_WRONG_REFRESH);
      }
      logger.log(response);
      return false;
    }
  } catch (error) {
    logger.log(error);
    Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    return false;
  }
};

export const verifyOtp = async (phone: string, otp: string) => {
  let response = await fetch(VERIFY_OTP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: '+1' + phone,
      otp,
    }),
  });
  if (response.status === 200) {
    const data: {
      user_id?: string;
      token?: string;
      username?: string;
      is_vip: boolean;
      is_onboarded?: boolean;
      is_profile_onboarded?: boolean;
      profile_tutorial_stage?: ProfileTutorialStage;
    } = await response.json();
    return data;
  }
};

export const sendOtp = async (phone: string) => {
  try {
    let response = await fetch(SEND_OTP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: '+1' + phone,
      }),
    });
    return response.status === 200;
  } catch (error) {
    console.log(error);
  }
};

export const sendRegister = async (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  username: string,
  tiktokLink: string,
  gender: string,
  age: string,
) => {
  try {
    const form = new FormData();
    form.append('first_name', firstName);
    form.append('last_name', lastName);
    form.append('email', email);
    form.append('phone_number', phone);
    form.append('username', username);
    form.append('password', 'TaggHQ123#');
    form.append('tiktok_handle', tiktokLink);
    form.append('gender', gender);
    form.append('dob', age);

    const response = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    });
    if (response.status === 201) {
      const data: {
        user_id: string;
        token: string;
      } = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserProfile = async (userId: string, token?: string) => {
  try {
    if (!token) {
      token = (await AsyncStorage.getItem('token')) ?? '';
    }
    const response = await fetch(USER_PROFILE_ENDPOINT + userId + '/', {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data: ProfileType = await response.json();
      return data;
    }
  } catch (error) {
    logger.log(error);
    return undefined;
  }
};

export const patchEditProfile = async (form: FormData, userId: string) => {
  const endpoint = EDIT_PROFILE_ENDPOINT + `${userId}/`;
  try {
    const token = await AsyncStorage.getItem('token');
    let response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Token ' + token,
      },
      body: form,
    });
    let statusCode = response.status;
    if (statusCode === 200) {
      return true;
    } else if (statusCode === 400) {
      let data = await response.json();
      throw 'Profile update failed. 😔' + data.error || 'Something went wrong! 😭';
    } else {
      throw ERROR_SOMETHING_WENT_WRONG_REFRESH;
    }
  } catch (error) {
    throw ERROR_DOUBLE_CHECK_CONNECTION;
  }
};

export const visitedUserProfile = async (userId: string, visitorId: string) => {
  try {
    const form = new FormData();
    form.append('user_id', userId);
    form.append('visitor_id', visitorId);
    const response = await fetch(INSIGHTS_PROFILE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    });
    if (response.status !== 201) {
      logger.error('Failed to submit a profile visit');
    }
  } catch (error) {
    return undefined;
  }
};

export const validateOnboardingInfo = async (data: {
  username?: string;
  phone?: string;
  email?: string;
}) => {
  try {
    const form = new FormData();
    if (data.username) {
      form.append('username', data.username);
    }
    if (data.phone) {
      form.append('phone_number', data.phone);
    }
    if (data.email) {
      form.append('email', data.email);
    }
    const response = await fetch(REGISTER_VALIDATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    });
    return response.status === 200;
  } catch (error) {
    logger.log(error);
    return false;
  }
};

export const sendUserInterests = async (interests: string[], token: string) => {
  const response = await fetch(USER_INTERESTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interests }),
  });
  return response.status === 201;
};

export const getPhoneStatus = async (phone_number: string) => {
  try {
    const response = await fetch(PHONE_STATUS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number,
      }),
    });
    if (response.status === 200) {
      const data: PhoneStatusType = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getFriendTotal = async (userId: string, insights: ProfileInsightsEnum) => {
  if (insights === ProfileInsightsEnum.Week) {
    return {
      total: '457.2k',
      gender: [
        { gender: 'Female', percent: 75 },
        { gender: 'Male', percent: 25 },
      ],
      ageRange: [
        { age: '13-17', percent: 0.7 },
        { age: '18-24', percent: 85.5 },
        { age: '25-34', percent: 9 },
        { age: '35-44', percent: 2.1 },
        { age: '45-54', percent: 0.7 },
        { age: '55-65', percent: 0.7 },
        { age: '65+', percent: 1.4 },
      ],
      location: [
        { city: 'Providence', percent: 20 },
        { city: 'San Antonio', percent: 18.6 },
        { city: 'New York', percent: 4.8 },
        { city: 'Chicago', percent: 3.4 },
      ],
      view: false,
      range: 'Oct 11 - Oct 17',
    };
  } else if (insights === ProfileInsightsEnum.DoubleWeek) {
    return {
      total: '457.2k',
      gender: [
        { gender: 'Female', percent: 75 },
        { gender: 'Male', percent: 25 },
      ],
      ageRange: [
        { age: '13-17', percent: 0.7 },
        { age: '18-24', percent: 85.5 },
        { age: '25-34', percent: 9 },
        { age: '35-44', percent: 2.1 },
        { age: '45-54', percent: 0.7 },
        { age: '55-65', percent: 0.7 },
        { age: '65+', percent: 1.4 },
      ],
      location: [
        { city: 'Providence', percent: 20 },
        { city: 'San Antonio', percent: 18.6 },
        { city: 'New York', percent: 4.8 },
        { city: 'Chicago', percent: 3.4 },
      ],
      view: true,
      range: 'Oct 01 - Oct 15',
    };
  }
  return {
    total: '457.2k',
    gender: [
      { gender: 'Female', percent: 75 },
      { gender: 'Male', percent: 25 },
    ],
    ageRange: [
      { age: '13-17', percent: 0.7 },
      { age: '18-24', percent: 85.5 },
      { age: '25-34', percent: 9 },
      { age: '35-44', percent: 2.1 },
      { age: '45-54', percent: 0.7 },
      { age: '55-65', percent: 0.7 },
      { age: '65+', percent: 1.4 },
    ],
    location: [
      { city: 'Providence', percent: 20 },
      { city: 'San Antonio', percent: 18.6 },
      { city: 'New York', percent: 4.8 },
      { city: 'Chicago', percent: 3.4 },
    ],
    view: false,
    range: 'Oct 01 - Oct 30',
  };
};

export const getTaggClicksSummary = async (
  token: string,
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<TaggClickCountSummaryType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_TAGGS_SUMMARY_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    );

    if (response.status === 200) {
      const data = await response.json();
      await TaggShopData.map(item => {
        if (item.link_type === data.top_tagg.link_type) {
          data.top_tagg.image = item.img;
        }
      });

      return data;
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getTaggClick = async (
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<TaggsClickCountType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_TAGGS_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {},
      },
    );

    if (response.status === 200) {
      const data = await response.json();
      await data.individual.map(tagg => {
        TaggShopData.forEach(item => {
          if (item.link_type === tagg.link_type) {
            tagg.image = item.img;
          }
        });
      });

      return data;
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

export const registerTaggClick = async (
  token: string,
  widgetId: string,
  viewerId: string,
): Promise<boolean> => {
  try {
    console.log('registering tagg click');
    const response = await fetch(INSIGHTS_TAGGS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({ widget_id: widgetId, viewer_id: viewerId }),
    });

    return response.status === 201;
  } catch (error) {
    console.log('error: ', error);
    return false;
  }
};

export const getProfileViewsSummary = async (
  token: string,
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<ProfileViewsCountSummaryType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_PROFILE_SUMMARY_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    );

    if (response.status === 200) {
      return await response.json();
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getProfileViews = async (
  token: string,
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<ProfileViewsCountType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_PROFILE_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    );

    if (response.status === 200) {
      let data: ProfileViewsCountType = await response.json();

      data.distribution.labels.forEach((timestamp, index) => {
        data.distribution.labels[index] = moment(timestamp).format('MM/DD');
      });

      return data;
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getMomentInsightsSummary = async (
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<ProfileViewsCountType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_MOMENTS_SUMMARY_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {},
      },
    );

    if (response.status === 200) {
      let data: ProfileViewsCountType = await response.json();
      return data;
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getMomentInsights = async (
  token: string,
  userId: string,
  insights: ProfileInsightsEnum,
): Promise<ProfileViewsCountType | undefined> => {
  try {
    const response = await fetch(
      `${INSIGHTS_MOMENTS_ENDPOINT}?user_id=${userId}&filter_type=${insights}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Token ' + token,
        },
      },
    );

    if (response.status === 200) {
      let data: ProfileViewsCountType = await response.json();
      return data;
    }
    return undefined;
  } catch (error) {
    console.log('error: ', error);
  }
};

// TODO: finish backend
export const getProfileMoments2 = async (userId: string, insights: ProfileInsightsEnum) => {
  logger.log('get profile moments for', userId);
  if (insights === ProfileInsightsEnum.Week) {
    return {
      title: 'Weekly moment views',
      labels: [
        { label: 'Mon', value: '10/11' },
        { label: 'Tues', value: '10/12' },
        { label: 'Wed', value: '10/13' },
        { label: 'Thurs', value: '10/14' },
        { label: 'Fri', value: '10/15' },
        { label: 'Sat', value: '10/16' },
        { label: 'Sun', value: '10/17' },
      ],
      graph: [4570, 13000, 350000, 5100, 74010, 52010, 135],
      total: 562,
      range: 'Oct 11 - Oct 17',
    };
  } else if (insights === ProfileInsightsEnum.DoubleWeek) {
    return {
      title: 'Double week moment views',
      labels: [
        { label: 'Week 1', value: '11/1' },
        { label: 'Week 2', value: '11/8' },
        { label: 'Week 3', value: '11/15' },
        { label: 'Week 4', value: '11/22' },
      ],
      graph: [457010, 13010, 35000100, 51010],
      total: 156,
      range: 'Oct 01 - Oct 15',
    };
  }
  return {
    title: 'Monthly moment views',
    labels: [
      { label: 'Week 1', value: '11/1' },
      { label: 'Week 2', value: '11/8' },
      { label: 'Week 3', value: '11/15' },
      { label: 'Week 4', value: '11/22' },
    ],
    graph: [4570, 130, 350000, 510],
    total: 56,
    range: 'Oct 01 - Oct 30',
  };
};

export const updateProfileTutorialStageService = async (
  profile_tutorial_stage: ProfileTutorialStage,
  token: string,
) => {
  try {
    const response = await fetch(PROFILE_TUTORIAL_ENDPOINT, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        profile_tutorial_stage,
      }),
    });
    if (response.status === 200) {
      const data: PhoneStatusType = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTaggScoreService = async (
  token: string,
  userId: string,
  type: TaggScoreActionsEnum,
  bannerTextType: TaggScoreBannerText,
  dispatch: AppDispatch,
) => {
  try {
    const response = await fetch(GAME_PROFILE_ENDPOINT + `${userId}/?tagg_score_type=${type}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (type !== TaggScoreActionsEnum.MOMENT_POST) {
        setTimeout(() => {
          dispatch(makeAction(Banner.SHOW, true));
          dispatch(makeAction(Banner.TEXT, bannerTextType));
          dispatch(makeAction(Banner.POINT, `+ ${data.points_earned}`));
        }, 800);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const getGameProfileService = async (token: string, userId: string) => {
  try {
    const response = await fetch(GAME_PROFILE_ENDPOINT + `${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      return await response.json();
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const unwrapRewardService = async (
  token: string,
  userId: string,
  reward_type: RewardType,
) => {
  try {
    const response = await fetch(
      UNWRAP_REWARD_ENDPOINT + `?reward_type=${reward_type}&userId=${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    console.log(error);
  }
};

// TODO: finish backend
export const getProfileLinks = async (userId: string, insights: ProfileInsightsEnum) => {
  logger.log('get profile views for', userId);
  if (insights === ProfileInsightsEnum.Week) {
    return {
      totalClicks: '100.2k',
      clickConversion: '22.1k',
      clickThroughRate: '52%',
      labels: [
        { label: 'Mon', value: '10/11' },
        { label: 'Tues', value: '10/12' },
        { label: 'Wed', value: '10/13' },
        { label: 'Thurs', value: '10/14' },
        { label: 'Fri', value: '10/15' },
        { label: 'Sat', value: '10/16' },
        { label: 'Sun', value: '10/17' },
      ],
      graph: [45700, 1300, 3500000, 5100, 7400, 5200, 135],
      range: 'Oct 11 - Oct 17',
    };
  } else if (insights === ProfileInsightsEnum.DoubleWeek) {
    return {
      totalClicks: '220.2k',
      clickConversion: '42.1k',
      clickThroughRate: '54%',
      labels: [
        { label: 'Week 1', value: '11/1' },
        { label: 'Week 2', value: '11/8' },
        { label: 'Week 3', value: '11/15' },
        { label: 'Week 4', value: '11/22' },
      ],
      graph: [45700, 1300, 3500000, 5100],
      range: 'Oct 01 - Oct 15',
    };
  }
  return {
    totalClicks: '400.9k',
    clickConversion: '72.1k',
    clickThroughRate: '55%',
    labels: [
      { label: 'Week 1', value: '11/1' },
      { label: 'Week 2', value: '11/8' },
      { label: 'Week 3', value: '11/15' },
      { label: 'Week 4', value: '11/22' },
    ],
    graph: [45700, 1300, 3500000, 5100],
    range: 'Oct 01 - Oct 30',
  };
};

export const changeAnalyticsStatus_ApiService = async (token: string, analyticsStatus: string) => {
  try {
    let formdata = new FormData();
    formdata.append('type', analyticsStatus);
    const response = await fetch(CHECK_INSIGHT_REWARD_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: formdata,
    });
    if (response.status === 200) {
      // const data = await response.json();
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const checkAnalyticsStatus_ApiService = async (token: string) => {
  try {
    const response = await fetch(CHECK_INSIGHT_REWARD_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data && data?.status) {
        if (data?.status == 'UNBLOCKED') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const getUserEligiblityForTaggBG = async (userId: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(TAGG_BG + `?userId=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token,
    },
  });

  if (response.status === 200) {
    const data: Record<string, any> = await response.json();
    return data;
  }
};

export const unlockBackgroundTaggService = async (token: string, userId: string) => {
  const form = new FormData();
  form.append('userId', userId);
  const response = await fetch(TAGG_BG, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
    },
    body: form,
  });

  if (response.status === 200) {
    const data: Record<string, any> = await response.json();
    return data;
  }
};

export const fetchSkinPermission = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(SKIN_PERMISSION, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token,
    },
  });
  if (response.status === 200) {
    const data: Record<string, any> = await response.json();
    return data;
  }
};

export const setBgTabGradientPermission = async (rewardType: RewardType) => {
  const token = await AsyncStorage.getItem('token');
  const form = new FormData();
  if (rewardType === RewardType.PROFILE_GRADIENT_BG_COLOR) {
    form.append('background_permission', 'True');
  } else if (rewardType === RewardType.TAB_GRADIENT_BG_COLOR) {
    form.append('tab_permission', 'True');
  }
  const response = await fetch(SKIN_PERMISSION, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' + token,
    },
    body: form,
  });
  if (response.status === 200) {
    const data: Record<string, any> = await response.json();
    return data;
  }
};
