import React from 'react';

import { Image, Linking, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';
import Hyperlink from 'react-native-hyperlink';
import LinearGradient from 'react-native-linear-gradient';

import { TwitterPostType } from 'types';
import { handleOpenSocialUrlOnBrowser, SCREEN_WIDTH } from 'utils';

import { AVATAR_DIM, TAGGS_GRADIENT, TAGG_LIGHT_BLUE, TAGG_LIGHT_BLUE_2 } from '../../constants';

import { Avatar, DateLabel, PostCarousel } from '../common';

interface TwitterTaggPostProps {
  ownerHandle: string;
  post: TwitterPostType;
}
const TwitterTaggPost: React.FC<TwitterTaggPostProps> = ({ ownerHandle, post }) => (
  <View style={styles.mainContainer}>
    {/* Retweeted? */}
    {post.type === 'retweet' ? (
      <Text style={styles.retweetedText}>@{ownerHandle} retweeted</Text>
    ) : (
      <React.Fragment />
    )}
    {/* Post header (avatar and handle) */}
    <View style={styles.header}>
      <Avatar style={styles.avatar} uri={post.profile_pic} />
      <Text
        style={styles.headerText}
        onPress={() => handleOpenSocialUrlOnBrowser(post.handle, 'Twitter')}>
        @{post.handle}
      </Text>
    </View>
    {/* Tweet/Reply/Retweet Content */}
    <View style={styles.contentContainer}>
      {/* First part of content is text or empty */}
      {post.text ? (
        <Hyperlink linkDefault={true} linkStyle={styles.linkColor}>
          <Text style={styles.contentText}>{post.text}</Text>
        </Hyperlink>
      ) : (
        <React.Fragment />
      )}
      {/* Second part of content is an image or empty */}
      {post.media_url?.length !== 0 ? (
        <View style={styles.imageContainer}>
          {post.media_url.length === 1 && post.media_url[0] !== null ? (
            <Image style={styles.image} source={{ uri: post.media_url[0] }} />
          ) : (
            <PostCarousel data={post.media_url} imageStyles={styles.image} marginBottom={0} />
          )}
        </View>
      ) : (
        <React.Fragment />
      )}
      {/* Third part of content is the reply/retweet container or empty */}
      {(post.type === 'reply' || post.type === 'retweet') && post.in_reply_to && (
        <LinearGradient
          colors={[TAGGS_GRADIENT.start, TAGGS_GRADIENT.end]}
          useAngle={true}
          angle={300}
          angleCenter={{ x: 0.5, y: 0.5 }}
          style={[styles.replyGradient]}>
          <View style={styles.replyPostContainer}>
            <View style={styles.replyHeader}>
              {post.in_reply_to.text !== 'This tweet is unavailable' && (
                <>
                  <Avatar style={styles.avatar} uri={post.in_reply_to.profile_pic} />
                  <Text
                    style={styles.replyHandleText}
                    onPress={() =>
                      handleOpenSocialUrlOnBrowser(post.in_reply_to?.handle, 'Twitter')
                    }>
                    @{post.in_reply_to.handle}
                  </Text>
                  {/* We're not displaying any images here in the container */}
                  <DateLabel
                    timestamp={post.in_reply_to.timestamp}
                    type={'short'}
                    decorate={date => ` • ${date}`}
                  />
                </>
              )}
            </View>
            <Text style={styles.replyText} numberOfLines={2}>
              {post.in_reply_to.text}
            </Text>
            {post.in_reply_to.permalink && (
              <Text
                style={styles.replyShowThisThread}
                onPress={() => {
                  if (post.in_reply_to?.permalink) {
                    Linking.openURL(post.in_reply_to?.permalink || '');
                  }
                }}>
                Show this thread
              </Text>
            )}
          </View>
        </LinearGradient>
      )}
    </View>
    {/* Footer */}
    <View style={styles.footer}>
      <DateLabel timestamp={post.timestamp} type={'default'} />
      <Text
        style={styles.viewOnTwitterText}
        onPress={() => {
          if (post.permalink) {
            Linking.openURL(post.permalink);
          }
        }}>
        View on Twitter
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 10,
    marginBottom: 50,
  },
  retweetedText: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  avatar: {
    width: AVATAR_DIM,
    height: AVATAR_DIM,
    borderRadius: AVATAR_DIM / 2,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 12,
  },
  linkColor: { color: '#2980b9' },
  contentContainer: {},
  contentText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  // image media
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: SCREEN_WIDTH - 20,
    height: SCREEN_WIDTH - 20,
    backgroundColor: '#1d0034',
    borderRadius: 15,
    resizeMode: 'contain',
  },
  // footer
  footer: {
    height: 50,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  viewOnTwitterText: {
    fontSize: 12,
    color: TAGG_LIGHT_BLUE_2,
  },
  // reply post
  replyPostContainer: {
    flex: 1,
    marginVertical: 1,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH - 22,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 15,
    backgroundColor: '#1d0034',
  },
  replyGradient: {
    // height: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  replyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  replyAvatar: {
    height: AVATAR_DIM / 2,
    width: AVATAR_DIM / 2,
    borderRadius: AVATAR_DIM / 2 / 2,
  },
  replyHandleText: {
    fontSize: 15,
    color: '#c4c4c4',
    paddingLeft: 7,
  },
  replyText: {
    fontSize: 15,
    marginVertical: 20,
    color: 'white',
  },
  replyShowThisThread: {
    fontSize: 15,
    color: TAGG_LIGHT_BLUE,
  },
});

export default TwitterTaggPost;
