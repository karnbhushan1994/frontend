import React, { useContext, useEffect, useState } from 'react';

import LottieView from 'lottie-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { ActionSheet } from 'components/widgets/ActionSheet';
import { ProfileContext, ProfileHeaderContext } from 'screens/profile/ProfileScreen';
import { updateProfileTutorialStage } from 'store/actions';
import { ProfileTutorialStage } from 'types';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { icons } from '../../../assets/icons/index';
import { tutorialGIFs } from '../../../assets/profileTutorialVideos/lotties/index';
import { HOMEPAGE } from '../../../constants';

const ExploreTutorialScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {
    profile: { profile_tutorial_stage },
  } = useContext(ProfileHeaderContext);
  const { ownProfile } = useContext(ProfileContext);

  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  /**
   * To make the screen appear 800ms after the gif tutorials
   * And disappear the moment the user performs an exit action
   */
  useEffect(() => {
    if (profile_tutorial_stage === ProfileTutorialStage.SHOW_STEWIE_GRIFFIN && ownProfile) {
      setTimeout(() => {
        // setShowTutorial(true);
      }, 800);
    } else {
      setShowTutorial(false);
    }
  }, [profile_tutorial_stage, ownProfile]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={showTutorial}
      presentationStyle={'overFullScreen'}>
      <TouchableOpacity
        style={styles.overlayTouchableOpacity}
        onPress={async () => {
          setShowTutorial(false);
          await dispatch(updateProfileTutorialStage(ProfileTutorialStage.SHOW_POST_MOMENT_1));
        }}>
        <View style={styles.tutorialMain}>
          <View style={styles.gifView}>
            <LottieView resizeMode={'cover'} source={tutorialGIFs.kid} autoPlay loop />
          </View>
          <View style={styles.exploreView}>
            <Text style={styles.exploreTitle}>Add a Tagg</Text>
            <Text style={styles.exploreSubheading}>
              {'Continue to build your profile by adding more taggs'}
            </Text>
          </View>
          <SvgXml xml={icons.WhiteTriangle} color={'white'} style={styles.viewTip} />
        </View>
        <ActionSheet screenType={HOMEPAGE} activeTab={HOMEPAGE} momentCategories={[]} />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tutorialMain: {
    width: 210,
    height: 200,
    backgroundColor: 'white',
    position: 'absolute',
    right: 27,
    bottom: 183,
    flexDirection: 'column',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowRadius: 8,
  },
  overlayTouchableOpacity: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gifView: {
    width: '100%',
    height: 107,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  exploreView: {
    height: 100,
    backgroundColor: '#FFFFFF',
    top: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  exploreTitle: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 17,
    textAlign: 'center',
    paddingBottom: '3%',
  },
  exploreSubheading: { textAlign: 'center', width: 189 },
  viewTip: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: -1,
      height: 1,
    },
  },
});

export default ExploreTutorialScreen;
