import { Mixpanel } from 'mixpanel-react-native';

import logger from 'utils/logger';

import { MIXPANEL_DEV, MIXPANEL_PROD } from '../constants';
import { AnalyticCategory, AnalyticVerb, EnvironmentType, UserType } from '../types';

let mixpanel: Mixpanel | undefined;

const SHOW_LOGS = false;
let previousScreen: string | undefined;

export const setupAnalytics = async (env: EnvironmentType) => {
  const token = env === EnvironmentType.PROD ? MIXPANEL_PROD : MIXPANEL_DEV;
  mixpanel = new Mixpanel(token);
  mixpanel.init();
};

/**
 * Identify the user when user logs in, this should be a unique ID that will be
 * used on the analytics panel for this user.
 * @param user
 */
export const identifyUser = (user: UserType) => {
  mixpanel?.identify(user.username);
};

export const resetAnalytics = () => {
  mixpanel?.reset();
};

export const updateUserInfoAnalytics = (info: {
  userId: string;
  name: string;
  university: string;
  university_class: number;
}) => {
  mixpanel?.getPeople().set('UserId', info.userId);
  mixpanel?.getPeople().set('Name', info.name);
  mixpanel?.getPeople().set('University', info.university);
  mixpanel?.getPeople().set('University Class', info.university_class);
};

export const setEnvironmentAnalytics = (environment: EnvironmentType) => {
  mixpanel?.getPeople().set('Env', environment);
};

export const track = async (
  event: string,
  eventVerb: AnalyticVerb,
  eventCategory: AnalyticCategory,
  payload?: {
    [key: string]: any;
  },
) => {
  if (!/^([A-Z][a-z]+)+$/.test(event)) {
    logger.error('Event name not in PascalCase', event);
  }
  const eventStr = eventCategory + '.' + eventVerb + event;
  if (SHOW_LOGS) {
    if (payload) {
      logger.log(eventStr, payload);
    } else {
      logger.log(eventStr);
    }
  }
  mixpanel?.track(eventStr, payload);
};

export const screen = async (name: string) => {
  // log viewed screen
  const eventStr = 'Viewed.' + name;
  if (SHOW_LOGS) {
    logger.log(eventStr);
  }
  mixpanel?.track(eventStr);

  // stop previous timed screen
  if (previousScreen) {
    mixpanel?.track(previousScreen);
  }

  // start timed screen view
  const timedEventStr = eventStr + 'For';
  mixpanel?.timeEvent(timedEventStr);
  previousScreen = timedEventStr;

  mixpanel?.registerSuperProperties({
    screen: name,
  });
};
