import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { images } from 'assets/images';
import { ProfilePreview } from 'components';
import { MomentTagType, ProfilePreviewType, ScreenType } from 'types';
import { normalize, SCREEN_HEIGHT } from 'utils/layouts';

interface TagFriendsFooterProps {
  tags: MomentTagType[];
  setTags: (tags: MomentTagType[]) => void;
}
const TagFriendsFooter: React.FC<TagFriendsFooterProps> = ({ tags, setTags }) => {
  const navigation = useNavigation();

  const handleRemoveTag = (user: ProfilePreviewType) => {
    setTags(tags.filter(tag => tag.user.id !== user.id));
  };

  const goToSelectionScreen = () => {
    navigation.navigate('TagSelectionScreen', {
      selectedTags: tags,
    });
  };

  const taggMoreButton = useMemo(
    () => (
      <TouchableOpacity onPress={goToSelectionScreen} style={styles.tagMoreContainer}>
        <Image source={images.main.white_plus_icon} style={styles.tagMoreIcon} />
        <Text style={styles.tagMoreLabel}>{'Tag More'}</Text>
      </TouchableOpacity>
    ),
    [tags],
  );

  const TaggedUser = (user: ProfilePreviewType) => {
    const { id } = user;
    return (
      <View style={styles.taggedUserContainer} key={id}>
        <TouchableOpacity style={styles.closeIconContainer} onPress={() => handleRemoveTag(user)}>
          <Image source={images.main.x_icon} style={styles.closeIcon} />
        </TouchableOpacity>
        <ProfilePreview
          profilePreview={user}
          previewType={'Tag Selection'}
          screenType={ScreenType.Profile}
        />
      </View>
    );
  };

  /*
   * Title/Button depending on the number of users inside taggedUsers list
   * If taggUsers is empty, title acts as a button
   * Else, gets disabled and TaggMore button appears
   */
  const tagFriendsTitle = useMemo(
    () => (
      <TouchableOpacity
        style={styles.tagFriendsTitleContainer}
        disabled={tags.length !== 0}
        onPress={() =>
          navigation.navigate('TagSelectionScreen', {
            selectedTags: tags,
          })
        }>
        <Image source={images.main.tag_icon_white} style={styles.tagIcon} />
        <Text style={styles.tagFriendsTitle}>Tag Friends</Text>
      </TouchableOpacity>
    ),
    [tags.length],
  );

  return (
    <>
      {tagFriendsTitle}
      <View style={styles.tagFriendsContainer}>
        <ScrollView horizontal>
          {tags.map(tag => (
            <TaggedUser key={tag.user.id} {...tag.user} />
          ))}
          {tags.length !== 0 && taggMoreButton}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tagIcon: { width: 20, height: 20, marginRight: '3%' },
  tagFriendsTitle: {
    color: 'white',
    fontSize: normalize(12),
    lineHeight: normalize(16.71),
    letterSpacing: normalize(0.3),
    fontWeight: '600',
  },
  tagFriendsContainer: {
    height: SCREEN_HEIGHT * 0.1,
    marginTop: 2,
    marginBottom: 5,
  },
  tagMoreLabel: {
    fontWeight: '500',
    fontSize: normalize(9),
    lineHeight: normalize(10),
    letterSpacing: normalize(0.2),
    color: 'white',
    textAlign: 'center',
  },
  closeIconContainer: {
    width: 20,
    height: 20,
    right: -20,
    zIndex: 1,
  },
  tagMoreContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -12,
  },
  tagMoreIcon: {
    width: 38,
    height: 38,
    marginTop: 13,
    marginBottom: '10%',
  },
  taggedUserContainer: {
    marginTop: -12,
  },
  closeIcon: {
    width: 20,
    height: 20,
    left: 15,
    top: 10,
  },
  tagFriendsTitleContainer: {
    flexDirection: 'row',
  },
});

export default TagFriendsFooter;
