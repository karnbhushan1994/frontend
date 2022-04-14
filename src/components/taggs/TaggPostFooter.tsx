import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-animatable';

import { handleOpenSocialUrlOnBrowser } from 'utils';

import { DateLabel } from '../common';

interface TaggPostFooterProps {
  likes?: number;
  handle?: string;
  caption: string;
  timestamp: string;
  social: string;
}
const TaggPostFooter: React.FC<TaggPostFooterProps> = ({
  likes,
  handle,
  caption,
  timestamp,
  social,
}) => {
  const handleText = handle ? handle : '';
  return (
    <View>
      <View style={styles.container}>
        {likes ? <Text style={styles.likeText}>{likes} likes</Text> : <></>}
        <View style={styles.captionContainer}>
          <Text
            style={styles.handleText}
            onPress={() => handleOpenSocialUrlOnBrowser(handleText, social)}>
            {handleText}
            <Text style={styles.captionText}> {caption}</Text>
          </Text>
        </View>
        <DateLabel timestamp={timestamp} type={'small'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  captionContainer: {
    paddingBottom: 30,
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  handleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8FA9C2',
  },
  captionText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'white',
    flexWrap: 'wrap',
  },
});

export default TaggPostFooter;
