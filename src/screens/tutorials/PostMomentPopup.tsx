import React, { Dispatch, SetStateAction } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons as basicIcons } from 'assets/icons';
import { TaggSquareButton } from 'components';

import { updateProfileTutorialStage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ProfileTutorialStage, ScreenType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

import { icons } from '../../assets/profileTutorialVideos/index';

interface PostMomentPopupProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  screenType: ScreenType;
}
const PostMomentPopup: React.FC<PostMomentPopupProps> = ({ visible, setVisible, screenType }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { profile_tutorial_stage } = useSelector((state: RootState) => state.user.profile);

  const handleDismiss = async () => {
    track('PostNowPopup', AnalyticVerb.Closed, AnalyticCategory.MomentUpload);
    setVisible(false);
    await dispatch(
      updateProfileTutorialStage(
        profile_tutorial_stage === ProfileTutorialStage.SHOW_POST_MOMENT_1
          ? ProfileTutorialStage.TRACK_LOGIN_AFTER_POST_MOMENT_1
          : ProfileTutorialStage.COMPLETE,
      ),
    );
  };

  const handlePostNow = async () => {
    track('PostNowPopup', AnalyticVerb.Selected, AnalyticCategory.MomentUpload);

    setVisible(false);
    await dispatch(
      updateProfileTutorialStage(
        profile_tutorial_stage === ProfileTutorialStage.SHOW_POST_MOMENT_1
          ? ProfileTutorialStage.TRACK_LOGIN_AFTER_POST_MOMENT_1
          : ProfileTutorialStage.COMPLETE,
      ),
    );

    navigation.navigate('SlideInCameraScreen', {
      screenType: screenType,
      viaPostNow: true,
    });
  };

  return (
    <Modal animationType="fade" transparent visible={visible} presentationStyle="overFullScreen">
      <TouchableOpacity style={styles.overlayTouchableOpacity} onPress={handleDismiss}>
        <View style={styles.backgroundOverlay}>
          <View style={styles.popupMainView}>
            <TouchableOpacity
              style={{ width: normalize(18), height: normalize(18) }}
              onPress={handleDismiss}>
              <SvgXml xml={basicIcons.CloseOutline} color={'#000'} />
            </TouchableOpacity>
            <SvgXml xml={icons.PostMoment} style={styles.postMomentIcon} />
            <Text style={styles.title}>Post a Moment</Text>
            <Text style={styles.subtext}>
              {'Grow your Tagg score and unlock more\ntools to build your profile!'}
            </Text>
            <TaggSquareButton
              title="Post now"
              onPress={handlePostNow}
              buttonColor="blue"
              buttonStyle="normal"
              labelColor="white"
              labelStyle={styles.buttonLabel}
              style={styles.button}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  postMomentIcon: { alignSelf: 'center' },
  popupMainView: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 336, //SCREEN_WIDTH * 0.8,
    height: 320, //SCREEN_HEIGHT * 0.5,
    zIndex: 2,
    padding: '3%',
  },
  backgroundOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTouchableOpacity: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  title: {
    color: '#000',
    fontSize: normalize(17),
    lineHeight: normalize(20),
    fontWeight: '700',
    textAlign: 'center',
  },
  subtext: {
    color: '#828282',
    fontSize: normalize(13),
    lineHeight: normalize(20),
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: '4%',
    paddingBottom: '6%',
  },
  buttonLabel: {
    fontSize: normalize(15),
    lineHeight: normalize(21),
    fontWeight: '700',
  },
  button: { width: 181, height: 37, alignSelf: 'center' },
});

export default PostMomentPopup;
