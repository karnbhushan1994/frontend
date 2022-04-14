import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

import logger from 'utils/logger';

import {
  COMMENTS_ENDPOINT,
  COMMENT_REACTIONS_ENDPOINT,
  COMMENT_REACTIONS_REPLY_ENDPOINT,
  COMMENT_THREAD_ENDPOINT,
} from '../constants';
import { ERROR_FAILED_TO_COMMENT_500, ERROR_FAILED_TO_COMMENT_403 } from '../constants/strings';
import {
  CommentBaseType,
  CommentThreadType,
  CommentType,
  ProfilePreviewType,
  ReactionOptionsType,
} from '../types';

export const getComments = async (
  objectId: string,
  fetchThreads: boolean,
): Promise<CommentType[]> => {
  let comments: CommentType[] = [];
  try {
    const token = await AsyncStorage.getItem('token');
    const endpoint = fetchThreads
      ? COMMENT_THREAD_ENDPOINT + '?comment_id='
      : COMMENTS_ENDPOINT + '?moment_id=';
    const response = await fetch(endpoint + objectId, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      comments = await response.json();
    } else {
      logger.log('Could not load comments');
    }
  } catch (error) {
    logger.log('Could not load comments', error);
  }
  return comments;
};

export const postComment = async (comment: string, objectId: string, postThread: boolean) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const request = new FormData();
    request.append('comment', comment);
    if (postThread) {
      request.append('comment_id', objectId);
    } else {
      request.append('moment_id', objectId);
    }
    const endpoint = postThread ? COMMENT_THREAD_ENDPOINT : COMMENTS_ENDPOINT;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Token ' + token,
      },
      body: request,
    });
    if (response.status === 403) {
      Alert.alert(ERROR_FAILED_TO_COMMENT_403);
    } else if (response.status !== 200) {
      throw 'server error';
    }
    return await response.json();
  } catch (error) {
    Alert.alert(ERROR_FAILED_TO_COMMENT_500);
    return undefined;
  }
};

//Get count of comments for a moment
export const getCommentsCount = async (objectId: string, fetchThread: boolean): Promise<string> => {
  let comments_count: string = '';
  try {
    const token = await AsyncStorage.getItem('token');
    const endpoint = fetchThread ? COMMENT_THREAD_ENDPOINT : COMMENTS_ENDPOINT;
    const response = await fetch(endpoint + `${objectId}/`, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const status = response.status;
    if (status === 200) {
      const response_data = await response.json();
      comments_count = response_data.count;
    } else {
      logger.log('Something went wrong! 😭', 'Not able to retrieve comments count');
    }
  } catch (error) {
    logger.log('Something went wrong! 😭', 'Not able to retrieve comments count', error);
  }
  return comments_count;
};

export const deleteComment = async (id: string, isThread: boolean) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const url = isThread ? COMMENT_THREAD_ENDPOINT : COMMENTS_ENDPOINT;
    const response = await fetch(url + `${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    return response.status === 200;
  } catch (error) {
    logger.log('Failed to delete a comment');
    logger.log(error);
    return false;
  }
};

/**
 * If `user_reaction` is undefined, we like the comment, if `user_reaction`
 * is defined, we unlike the comment.
 *
 * @param comment the comment object that contains `user_reaction` (or not)
 * @returns
 */
export const handleLikeUnlikeComment = async (
  comment: CommentType | CommentThreadType,
  liked: boolean,
) => {
  try {
    const isReply = 'parent_comment' in comment;
    const token = await AsyncStorage.getItem('token');
    let url = isReply ? COMMENT_REACTIONS_REPLY_ENDPOINT : COMMENT_REACTIONS_ENDPOINT;
    if (liked) {
      // unlike a comment
      url += `${comment.comment_id}/?reaction_type=LIKE`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: 'Token ' + token,
        },
      });
      return response.status === 200;
    } else {
      // like a comment
      const form = new FormData();
      form.append('comment_id', comment.comment_id);
      form.append('reaction_type', ReactionOptionsType.Like);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Token ' + token,
        },
        body: form,
      });
      return response.status === 200;
    }
  } catch (error) {
    logger.log('Unable to like/unlike a comment');
    logger.error(error);
  }
};

export const getUsersReactedToAComment = async (comment: CommentBaseType) => {
  try {
    const isReply = 'parent_comment' in comment;
    const token = await AsyncStorage.getItem('token');
    let url = isReply ? COMMENT_REACTIONS_REPLY_ENDPOINT : COMMENT_REACTIONS_ENDPOINT;
    url += `?comment_id=${comment.comment_id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });
    const typedResponse: {
      reaction: ReactionOptionsType;
      user_list: ProfilePreviewType[];
    }[] = await response.json();
    for (const obj of typedResponse) {
      if (obj.reaction === ReactionOptionsType.Like) {
        return obj.user_list;
      }
    }
    return [];
  } catch (error) {
    logger.log('Unable to fetch list of users whom reacted to a comment');
    logger.error(error);
  }
  return [];
};
