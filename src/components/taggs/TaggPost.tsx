import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import Hyperlink from 'react-native-hyperlink';

import { SimplePostType } from 'types';
import { SCREEN_WIDTH } from 'utils';

import { DateLabel, PostCarousel } from '../common';
import TaggPostFooter from './TaggPostFooter';

interface TaggPostProps {
  post: SimplePostType;
  social: string;
}
const TaggPost: React.FC<TaggPostProps> = ({ post, social }) => {
  if (post.media_type === 'photo') {
    // Post with image and footer that shows caption
    return (
      <View style={styles.photoContainer}>
        {post.media_url?.length === 1 && post.media_url[0] !== null ? (
          <Image style={styles.imageWithMargin} source={{ uri: post.media_url[0] }} />
        ) : (
          <PostCarousel data={post.media_url} imageStyles={styles.image} marginBottom={30} />
        )}
        <TaggPostFooter
          // we currently don't have a way to retreive num of likes information
          likes={undefined}
          handle={post.username}
          caption={post.caption || ''}
          timestamp={post.timestamp}
          social={social}
        />
      </View>
    );
  } else {
    // Post with large text
    return (
      <View style={styles.textContianer}>
        <Hyperlink linkDefault={true} linkStyle={styles.linkColor}>
          <Text style={styles.text}>{post.caption}</Text>
        </Hyperlink>
        <DateLabel timestamp={post.timestamp} type={'default'} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  photoContainer: {
    marginBottom: 50,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#eee',
  },
  imageWithMargin: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#1d0034',
    marginBottom: 30,
    resizeMode: 'contain',
  },
  textContianer: { marginBottom: 50, paddingHorizontal: 10 },
  text: {
    marginBottom: 30,
    fontSize: 18,
    color: 'white',
    flexWrap: 'wrap',
  },
  linkColor: { color: '#2980b9' },
});

export default TaggPost;
