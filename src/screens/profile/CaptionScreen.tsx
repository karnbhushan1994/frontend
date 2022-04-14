import React, { FC, useEffect, useMemo, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  Alert,
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button } from 'react-native-elements';

import { SvgXml } from 'react-native-svg';

import Video from 'react-native-video';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { MentionInputControlled, SearchBackground, TaggSquareButton } from 'components';
import { CaptionScreenHeader } from 'components/';
import TaggLoadingIndicator from 'components/common/TaggLoadingIndicator';

import LockedModal from 'components/modals/lockedModal';

import * as RootNavigation from 'RootNavigation';
import { MainStackParams } from 'routes';
import { patchMoment } from 'services';
import {
  handleImageMomentUpload,
  handleVideoMomentUpload,
  loadUserMoments,
  updateTaggScore,
} from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  MomentTagType,
  TaggScoreActionsEnum,
  TaggScoreBannerText,
} from 'types';
import { isIPhoneX, isUrlAVideo, normalize, SCREEN_WIDTH, StatusBarHeight, track } from 'utils';
import { mentionPartTypes } from 'utils/comments';

import { TAGG_LIGHT_BLUE_2, NOT_ENOUGH_COINS } from '../../constants';

import {
  ERROR_NO_MOMENT_CATEGORY,
  ERROR_SOMETHING_WENT_WRONG_REFRESH,
  ERROR_UPLOAD,
} from '../../constants/strings';

/**
 * Upload Screen to allow users to upload posts to Tagg
 */
type CaptionScreenRouteProp = RouteProp<MainStackParams, 'CaptionScreen'>;

type CaptionScreenNavigationProp = StackNavigationProp<MainStackParams, 'CaptionScreen'>;

interface CaptionScreenProps {
  route: CaptionScreenRouteProp;
  navigation: CaptionScreenNavigationProp;
}

const CaptionScreen: React.FC<CaptionScreenProps> = ({ route, navigation }) => {
  // moment is only present when editing
  const { moment, viaPostNowPopup } = route.params;
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const { tagg_score } = useSelector((state: RootState) => state.user.profile);

  const dispatch = useDispatch();
  const [caption, setCaption] = useState(moment ? moment.caption : '');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<MomentTagType[]>([]);
  const [taggedUsersText, setTaggedUsersText] = useState('');
  const [momentCategory, setMomentCategory] = useState<string | undefined>();
  // only used for upload purposes, undefined for editing is fine
  const videoDuration = moment ? undefined : route.params.media!.videoDuration;
  const mediaUri = moment ? moment.moment_url : route.params.media!.uri;
  const [isLockVisible, setIsLockVisible] = useState(false);
  // TODO: change this once moment refactor is done
  const isMediaAVideo = moment
    ? isUrlAVideo(moment.moment_url)
    : route.params.media?.isVideo ?? false;

  useEffect(() => {
    setTags(route.params.selectedTags ?? []);
  }, [route.params.selectedTags]);

  useEffect(() => {
    setMomentCategory(route.params.selectedCategory);
  }, [route.params.selectedCategory]);

  useEffect(() => {
    // if we're editing, hide tab bar
    if (moment) {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
    }
  }, [route.params.moment]);

  useEffect(() => {
    let listString = '';
    // Append non-truncated usernames together and no more than 21 characters total
    // e.g. "@ivan.tagg"
    // e.g. "@ivan.tagg @foobar . . ."
    for (const tag of tags) {
      const usernameStr = `@${tag.user.username} `;
      if (listString.length + usernameStr.length > 21) {
        listString = listString.concat('. . .');
        break;
      } else {
        listString = listString.concat(usernameStr);
      }
    }
    setTaggedUsersText(listString);
  }, [tags]);

  const handleFailed = (noCategory = false) => {
    setLoading(false);
    if (viaPostNowPopup) {
      track('PostNowPopupCaptionScreen', AnalyticVerb.Failed, AnalyticCategory.MomentUpload);
    }
    setTimeout(() => {
      if (noCategory) {
        Alert.alert(ERROR_NO_MOMENT_CATEGORY);
      } else {
        Alert.alert(moment ? ERROR_SOMETHING_WENT_WRONG_REFRESH : ERROR_UPLOAD);
      }
    }, 500);
  };
  const handleSuccess = (page: any) => {
    setLoading(false);
    navigation.getParent()?.setOptions({
      tabBarVisible: true,
    });
    if (!moment) {
      if (viaPostNowPopup) {
        track('PostNowPopupCaptionScreen', AnalyticVerb.Finished, AnalyticCategory.MomentUpload);
      }
      if (page) {
        navigation.navigate('Profile', {
          userXId: undefined,
          screenType: route.params.screenType,
          redirectToPage: page,
          showShareModalParm: false,
        });
        navigation.popToTop();
      } else {
        // if posting, pop all screens until at camera screen (default upload screen)
        // then switch to the profile tab
        navigation.popToTop();
        RootNavigation.navigate('ProfileTab');
      }
    } else {
      // if editing, simply go back to profile screen
      navigation.navigate('Profile', {
        userXId: undefined,
        screenType: route.params.screenType,
        redirectToPage: momentCategory ? momentCategory : undefined,
        showShareModalParm: false,
      });
    }
  };

  const formattedTags = () =>
    tags.map(tag => ({
      x: isMediaAVideo ? 0 : tag.x,
      y: isMediaAVideo ? 0 : tag.y,
      z: isMediaAVideo ? 0 : tag.z,
      user_id: tag.user.id,
    }));

  const handleShare = async () => {
    setLoading(true);
    if (moment || !momentCategory) {
      handleFailed(true);
      return;
    }
    if (isMediaAVideo) {
      dispatch(
        handleVideoMomentUpload(
          mediaUri,
          videoDuration ?? 30,
          caption,
          momentCategory,
          formattedTags(),
        ),
      );
    } else {
      dispatch(handleImageMomentUpload(mediaUri, caption, momentCategory, formattedTags()));
    }
    track('ComposeMoment', AnalyticVerb.Finished, AnalyticCategory.MomentUpload, {
      caption: caption !== '',
      tags: tags.length,
      isVideo: isMediaAVideo,
      videoDuration,
    });
    setTimeout(() => {
      handleSuccess(momentCategory);
      //reduce tagg score
      dispatch(
        updateTaggScore(
          TaggScoreActionsEnum.MOMENT_POST,
          userId,
          TaggScoreBannerText.PROFILE_LINK_READY_TO_SHARE,
        ),
      );
    }, 500);
  };

  const handleSubmitEditChanges = async () => {
    setLoading(true);
    if (moment?.moment_id && momentCategory) {
      const success = await patchMoment(moment.moment_id, caption, momentCategory, formattedTags());
      if (success) {
        dispatch(loadUserMoments(userId));
        handleSuccess(momentCategory);
      } else {
        handleFailed();
      }
      track('EditAMoment', AnalyticVerb.Finished, AnalyticCategory.MomentEdit, {
        success,
      });
    }
  };

  const SelectableItem: FC<{
    text: 'Tag Friends' | 'Page';
    imageUri: ImageSourcePropType;
    onPress: () => void;
  }> = ({ text, imageUri, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.selectableItemContainer}>
      <View style={styles.row}>
        {text === 'Page' && !momentCategory && <Text style={styles.asteriskText}>* </Text>}
        <Image style={styles.tagIcon} source={imageUri} />
        <Text style={styles.selectableItemTitle}>{text}</Text>
      </View>
      <View style={styles.row}>
        {text === 'Tag Friends' && <Text style={styles.itemInfoText}>{taggedUsersText}</Text>}
        {text === 'Page' && <Text style={styles.itemInfoText}>{momentCategory}</Text>}
        <SvgXml
          xml={icons.FrontArrow}
          width={normalize(13)}
          height={normalize(13)}
          color={'white'}
        />
      </View>
    </TouchableOpacity>
  );
  const isGray = () => {
    if (tagg_score > 4) {
      if (momentCategory) {
        return null;
      }
    }
    if (!moment && tagg_score < 5) {
      return styles.greyBackground;
    }
    if (!moment || !momentCategory) {
      return styles.greyBackground;
    }
    return null;
  };
  const isDisable = () => {
    if (moment && !momentCategory) {
      return true;
    } else if (moment) {
      return false;
    } else if (!momentCategory || tagg_score < 5) {
      return true;
    }
    return false;
  };
  const onpressLockModal = async () => {
    setIsLockVisible(false);
  };
  return (
    <SearchBackground>
      {loading && <TaggLoadingIndicator fullscreen />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={isIPhoneX() ? 40 : 30}
          style={styles.flex}>
          <View style={styles.contentContainer}>
            <View style={styles.buttonsContainer}>
              <Button
                title="Cancel"
                buttonStyle={styles.button}
                onPress={() => {
                  if (viaPostNowPopup) {
                    track(
                      'PostNowPopupCaptionScreen',
                      AnalyticVerb.Canceled,
                      AnalyticCategory.MomentUpload,
                    );
                  }
                  if (moment) {
                    navigation.getParent()?.setOptions({
                      tabBarVisible: true,
                    });
                  }
                  navigation.goBack();
                }}
              />
            </View>
            <CaptionScreenHeader style={styles.header} title={'Moments'} />
            <View style={styles.captionContainer}>
              {isMediaAVideo ? (
                <Video
                  style={styles.media}
                  source={{ uri: mediaUri }}
                  ignoreSilentSwitch={'ignore'}
                  muted={true}
                  repeat={true}
                />
              ) : (
                <Image style={styles.media} source={{ uri: mediaUri }} resizeMode={'contain'} />
              )}
              <MentionInputControlled
                style={styles.text}
                containerStyle={styles.flex}
                placeholder="Write something....."
                placeholderTextColor="white"
                value={caption}
                onChange={setCaption}
                partTypes={mentionPartTypes('white', 'caption', true)}
              />
            </View>
            {useMemo(
              () => (
                <SelectableItem
                  text={'Page'}
                  imageUri={images.main.images}
                  onPress={() =>
                    navigation.navigate('ChoosingCategoryScreen', {
                      newCustomCategory: momentCategory,
                    })
                  }
                />
              ),
              [momentCategory],
            )}
            {useMemo(
              () => (
                <SelectableItem
                  text={'Tag Friends'}
                  imageUri={images.main.tag_icon_white}
                  onPress={() =>
                    navigation.navigate('TagFriendsScreen', {
                      media: {
                        uri: mediaUri,
                        isVideo: isMediaAVideo,
                        videoDuration,
                      },
                      selectedTags: tags,
                    })
                  }
                />
              ),
              [taggedUsersText],
            )}
            <TaggSquareButton
              disabled={isDisable()}
              onPress={moment ? handleSubmitEditChanges : handleShare}
              title={moment ? 'Update' : 'Post'}
              buttonStyle={moment ? 'large' : 'customText'}
              buttonColor={'blue'}
              labelColor={'white'}
              style={[styles.postButton, isGray()]}
              labelStyle={styles.postText}>
              <Text style={styles.postText}>Post</Text>
              <Image source={images.main.moment_coin} style={styles.coin} />
              <Text style={styles.postText}>5</Text>
              <Text
                style={styles.infoIconText}
                onPress={() => {
                  setIsLockVisible(true);
                }}>
                {isDisable() && <Image source={images.main.infoicon} style={styles.infoIcon} />}
              </Text>
            </TaggSquareButton>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <LockedModal
        visible={isLockVisible}
        setVisible={setIsLockVisible}
        onPress={onpressLockModal}
        message={NOT_ENOUGH_COINS}
      />
    </SearchBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: StatusBarHeight,
    justifyContent: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '5%',
    marginRight: '5%',
  },
  button: {
    backgroundColor: 'transparent',
  },
  shareButtonTitle: {
    fontWeight: 'bold',
    color: TAGG_LIGHT_BLUE_2,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  captionContainer: {
    flexDirection: 'row',
    padding: normalize(15),
    marginBottom: normalize(35),
    borderColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  media: {
    height: normalize(150),
    aspectRatio: 9 / 16,
  },
  text: {
    color: 'white',
    fontSize: normalize(12),
    lineHeight: 14,
    fontWeight: '500',
    height: normalize(150),
    marginLeft: normalize(15),
  },
  flex: {
    flex: 1,
  },
  selectableItemTitle: {
    color: 'white',
    fontSize: normalize(14),
    lineHeight: normalize(16.71),
    letterSpacing: normalize(0.3),
    fontWeight: '600',
  },
  selectableItemContainer: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(42),
  },
  asteriskText: {
    color: TAGG_LIGHT_BLUE_2,
    fontWeight: 'bold',
    fontSize: normalize(15),
    height: 15,
    alignSelf: 'center',
  },
  itemInfoText: {
    color: 'white',
    width: 150,
    fontSize: normalize(10),
    lineHeight: normalize(11),
    letterSpacing: normalize(0.3),
    textAlign: 'right',

    marginRight: 5,
  },
  tagIcon: {
    width: normalize(20),
    height: normalize(20),
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
  },
  greyBackground: {
    backgroundColor: '#828282',
  },
  postButton: {
    width: SCREEN_WIDTH * 0.8,
    height: normalize(37),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
  },
  postText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(15),
    lineHeight: 18,
    letterSpacing: 2,
  },
  coin: {
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 4,
  },
  infoIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  infoIconText: {
    marginTop: 5,
  },
});

export default CaptionScreen;
