import React, { useCallback, useEffect, useRef, useState } from 'react';

import CameraRoll from '@react-native-community/cameraroll';
import { RouteProp } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, FlashMode, RNCamera } from 'react-native-camera';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TouchableOpacity as TouchableOpacityGH } from 'react-native-gesture-handler';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { DynamicBottomBar, FlashButton, FlipButton, GalleryIcon } from 'components';
import { MainStackParams } from 'routes';
import { AnalyticCategory, AnalyticVerb } from 'types';
import {
  HeaderHeight,
  isIPhoneX,
  isUrlAVideo,
  MediaContentDisplayRatio,
  normalize,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  track,
} from 'utils';
import { showGIFFailureAlert, takePicture, takeVideo } from 'utils/camera';
import logger from 'utils/logger';

import { MAX_VIDEO_RECORDING_DURATION, TAGG_PURPLE } from '../../constants';

type CameraScreenRouteProps = RouteProp<MainStackParams, 'CameraScreen'>;
export type CameraScreenNavigationProps = StackNavigationProp<MainStackParams, 'CameraScreen'>;
interface CameraScreenProps {
  route: CameraScreenRouteProps;
  navigation: CameraScreenNavigationProps;
}
const CameraScreen: React.FC<CameraScreenProps> = ({ route, navigation }) => {
  const { screenType, selectedCategory, viaPostNow } = route.params;
  const cameraRef = useRef<RNCamera>(null);
  const [cameraType, setCameraType] = useState<keyof CameraType>('back');
  const [flashMode, setFlashMode] = useState<keyof FlashMode>('off');
  const [mostRecentPhoto, setMostRecentPhoto] = useState<string>('');
  const [recordingStarted, setRecordingStarted] = useState<boolean>(false);
  const [showCaptureButtons, setShowCaptureButtons] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [videoUri, setVideoUri] = useState<string | undefined>();

  useEffect(() => {
    if (recordingStarted && videoUri) {
      navigateToEditMedia(videoUri);
    }
  }, [videoUri]);

  useEffect(() => {
    track('Camera', AnalyticVerb.Toggled, AnalyticCategory.Camera, {
      newState: cameraType,
    });
  }, [cameraType]);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarVisible: false,
      });
      setVideoUri(undefined);
      setRecordingStarted(false);
      setShowCaptureButtons(true);
      setShowCamera(true);
      return () => {
        setTimeout(() => {
          setShowCamera(false);
        }, 500);
      };
    }, [navigation]),
  );

  /*
   *  Chooses the last picture from gallery to display as the gallery button icon
   */
  useEffect(() => {
    CameraRoll.getPhotos({ first: 1 })
      .then(lastPhoto => {
        if (lastPhoto.edges.length > 0) {
          const image = lastPhoto.edges[0].node.image;
          setMostRecentPhoto(image.uri);
        }
      })
      .catch(_err => logger.log('Unable to fetch preview photo for gallery'));
  }, []);

  const navigateToEditMedia = (uri: string) => {
    const isVideo = isUrlAVideo(uri);
    track(
      viaPostNow ? 'PostNowPopupToSelectMedia' : 'SelectMedia',
      AnalyticVerb.Pressed,
      AnalyticCategory.MomentUpload,
    );

    navigation.navigate('EditMedia', {
      screenType,
      media: {
        uri,
        isVideo,
      },
      selectedCategory,
      viaPostNowPopup: viaPostNow,
    });
  };

  const handleClose = () => {
    track(
      viaPostNow ? 'PostNowPopupCamera' : 'CameraScreen',
      AnalyticVerb.Closed,
      AnalyticCategory.Camera,
    );

    navigation.getParent()?.setOptions({
      tabBarVisible: true,
    });
    navigation.goBack();
  };

  const captureButton = (
    <View style={styles.captureButtonContainer}>
      <TouchableOpacityGH
        style={
          recordingStarted ? styles.captureButtonOutlineRecording : styles.captureButtonOutline
        }
        activeOpacity={1}
        onLongPress={() => {
          track('TakeVideo', AnalyticVerb.Pressed, AnalyticCategory.Camera);
          takeVideo(cameraRef, cameraType, vid => setVideoUri(vid.uri));
        }}
        onPressOut={() => cameraRef.current?.stopRecording()}
        onPress={() => {
          setShowCaptureButtons(false);
          takePicture(cameraRef, cameraType, pic => {
            track('TakePicture', AnalyticVerb.Pressed, AnalyticCategory.Camera);
            navigateToEditMedia(pic.uri);
          });
        }}>
        <View style={styles.captureButton} />
      </TouchableOpacityGH>
      {recordingStarted && (
        <AnimatedCircularProgress
          size={95}
          width={6}
          fill={100}
          rotation={0}
          duration={(MAX_VIDEO_RECORDING_DURATION + 1) * 1000} // an extra second for UI to load
          tintColor={TAGG_PURPLE}
          style={styles.circularProgress}
          lineCap={'round'}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={recordingStarted && !videoUri && cameraType === 'front' && flashMode === 'on'}>
        <View style={styles.flashView} />
      </Modal>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <SvgXml xml={icons.CloseOutline} height={25} width={25} color={'white'} />
      </TouchableOpacity>
      <FlashButton flashMode={flashMode} setFlashMode={setFlashMode} />
      {showCamera && (
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={
            flashMode === 'on' && recordingStarted && cameraType === 'back' ? 'torch' : flashMode
          }
          onDoubleTap={() => {
            if (showCaptureButtons) {
              setCameraType(cameraType === 'front' ? 'back' : 'front');
            }
          }}
          onRecordingStart={() => setRecordingStarted(true)}>
          {isIPhoneX() && <View style={styles.captureButtonContaineriPhoneX}>{captureButton}</View>}
        </RNCamera>
      )}
      <DynamicBottomBar>
        {showCaptureButtons && (
          <>
            <GalleryIcon
              mostRecentPhotoUri={mostRecentPhoto}
              callback={media => {
                const filename = media.filename;
                track('SelectingMediaFromGallery', AnalyticVerb.Finished, AnalyticCategory.Camera, {
                  fileType: filename?.split('.').pop(),
                });
                if (filename && (filename.endsWith('gif') || filename.endsWith('GIF'))) {
                  showGIFFailureAlert(() => navigateToEditMedia(media.path));
                } else {
                  navigateToEditMedia(media.path);
                }
              }}
            />
            {isIPhoneX() ? <Text style={styles.momentsText}>Moments</Text> : captureButton}
            <FlipButton cameraType={cameraType} setCameraType={setCameraType} />
          </>
        )}
      </DynamicBottomBar>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: SCREEN_WIDTH / MediaContentDisplayRatio,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  flashView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  captureButtonOutlineRecording: {
    borderRadius: 100,
    borderWidth: 15,
    borderColor: 'rgba(255,255,255,0.3)',
    width: 93,
    height: 93,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOutline: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#fff',
    width: 93,
    height: 93,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    width: 68,
    height: 68,
    borderRadius: 100,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    paddingTop: HeaderHeight,
    zIndex: 1,
    marginLeft: '5%',
  },
  captureButtonContainer: {
    alignSelf: 'center',
  },
  captureButtonContaineriPhoneX: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
  },
  circularProgress: {
    position: 'absolute',
  },
  momentsText: {
    color: 'white',
    fontSize: normalize(20),
    fontWeight: 'bold',
    lineHeight: 24,
  },
});

export default CameraScreen;
