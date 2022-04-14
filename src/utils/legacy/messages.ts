import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

// @ts-ignore not used lib
import {StreamChat} from 'stream-chat';

import logger from 'utils/logger';

import { loadChatTokenService } from '../../services/ChatService';
import { RootState } from '../../store/rootReducer';

/**
 * Finds the difference in time in minutes
 * @param lastActive given time e.g. "2021-04-08T19:07:09.361300983Z"
 * @returns diff in minutes
 */
const _diffInMinutes = (lastActive: string | undefined) => {
    if (!lastActive) {
        return undefined;
    }
    return moment().diff(moment(lastActive), 'minutes');
};

/**
 * Formats the last activity status.
 *  - "Active now"          (≤ 5 minutes)
 *  - "Seen X minutes ago"  (5 > x ≥ 59 minutes)
 *  - "Seen X hours ago"    (x = [1, 2])
 *  - "Offline"
 * @param lastActive given time e.g. "2021-04-08T19:07:09.361300983Z"
 * @returns
 */
export const formatLastSeenText = (lastActive: string | undefined) => {
    const diff = _diffInMinutes(lastActive);
    if (!diff) {
        return 'Offline';
    }
    if (diff <= 5) {
        return 'Active now';
    }
    if (diff <= 59) {
        return `Seen ${diff} minutes ago`;
    }
    if (diff <= 180) {
        const hours = Math.floor(diff / 60);
        return `Seen ${hours} hours ago`;
    }
    return 'Offline';
};

/**
 * Checks if a lastActive timestamp is considered Online or not.
 *
 * A user is online if last active is ≤ 15 minutes.
 *
 * @param lastActive given time e.g. "2021-04-08T19:07:09.361300983Z"
 * @returns True if active
 */
export const isOnline = (lastActive: string | undefined) => {
    if (!lastActive) {
        return false;
    }
    const diff = _diffInMinutes(lastActive);
    if (!diff) {
        return false;
    }
    return diff <= 15;
};

/**
 * Gets the other member in the channel.
 * @param channel the current chat channel
 * @param state the current redux state
 * @returns other member or undefined
 */
export const getMember = (channel: any | undefined, state: RootState) => {
    if (!channel) {
        return undefined;
    }
    const loggedInUserId = state.user.user.userId;
    const otherMembers = channel
        ? Object.values<{ user: { id: string } }>(channel.state.members).filter((member) => member.user?.id !== loggedInUserId)
        : [];
    return otherMembers.length === 1 ? otherMembers[0] : undefined;
};

export const connectChatAccount = async (loggedInUserId: string, chatClient: StreamChat) => {
    try {
        await getChatToken();
        const chatToken = await AsyncStorage.getItem('chatToken');
        if (!chatClient.user && chatToken) {
            await chatClient.connectUser(
                {
                    id: loggedInUserId,
                },
                chatToken,
            );
            return true;
        } else if (chatClient.user) {
            return true;
        } else {
            logger.log('Unable to connect to stream. Empty chat token');
            return false;
        }
    } catch (err) {
        logger.log('Error while connecting user to Stream: ', err);
        return false;
    }
};

export const getChatToken = async () => {
    try {
        const chatToken = await loadChatTokenService();
        await AsyncStorage.setItem('chatToken', chatToken);
    } catch (err) {
        logger.log('Exception while loading chat token: ', err);
    }
};

export const createChannel = async (loggedInUser: string, id: string, chatClient: any) => {
    try {
        const channel = chatClient.channel('messaging', {
            members: [loggedInUser, id],
        });
        await channel.watch();
        return channel;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export const getFormatedDate = (date: object) => {
    const dateMoment = moment(date).startOf('day');
    let dateToRender = '';

    const TODAY = moment().startOf('day');
    const YESTERDAY = moment().subtract(1, 'day').startOf('day');
    const LAST_7_DAYS = moment().subtract(7, 'day').startOf('day');

    if (TODAY.isSame(dateMoment)) {
        dateToRender = 'Today';
    } else if (YESTERDAY.isSame(dateMoment)) {
        dateToRender = 'Yesterday';
    } else if (dateMoment.isBetween(LAST_7_DAYS, YESTERDAY)) {
        dateToRender = dateMoment.format('dddd');
    } else {
        if (dateMoment.get('year') === TODAY.get('year')) {
            dateToRender = dateMoment.format('MMMM D') + 'th';
        } else {
            dateToRender = dateMoment.format('MMMM D ') + 'th' + dateMoment.get('year');
        }
    }
    return dateToRender;
};
