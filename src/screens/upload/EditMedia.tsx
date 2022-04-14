import React, { useEffect, useRef, useState } from 'react';

// @ts-ignore no @types
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageZoom, { IOnMove } from 'react-native-image-pan-zoom';
import PhotoManipulator from 'react-native-photo-manipulator';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { SaveButton, TrimmerPlayer } from 'components';
import { DynamicBottomBar, TaggLoadingIndicator, TaggSquareButton } from 'components/common';

import { MainStackParams } from 'routes';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from 'types';
import {
  cropVideo,
  HeaderHeight,
  isIPhoneX,
  MediaContentDisplayRatio,
  normalize,
  saveMediaToGallery,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  track,
  trimVideo,
} from 'utils';
import logger from 'utils/logger';
import { addTaggWatermark } from 'utils/watermark';

import { ERROR_MOMENT_UPLOAD_IN_PROGRESS } from '../../constants/strings';

type EditMediaRouteProps = RouteProp<MainStackParams, 'EditMedia'>;
type EditMediaNavigationProps = StackNavigationProp<MainStackParams, 'EditMedia'>;
interface EditMediaProps {
  route: EditMediaRouteProps;
  navigation: EditMediaNavigationProps;
}

export const EditMedia: React.FC<EditMediaProps> = ({ route, navigation }) => {
  const {
    screenType,
    selectedCategory,
    media: { isVideo },
    viaPostNowPopup,
  } = route.params;
  const { username: loggedInUserName } = useSelector((state: RootState) => state.user.user);
  const { momentUploadProgressBar } = useSelector((state: RootState) => state.user);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  // width and height of video, if video
  const [origDimensions, setOrigDimensions] = useState<number[]>([0, 0]);
  const [mediaUri, setMediaUri] = useState<string>(route.params.media.uri);

  const vidRef = useRef<View>(null);
  const [cropLoading, setCropLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hideTrimmer, setHideTrimmer] = useState<boolean>(true);
  const [videoDuration, setVideoDuration] = useState<number | undefined>();

  // Stores the coordinates of the cropped image
  const [x0, setX0] = useState<number>();
  const [x1, setX1] = useState<number>();
  const [y0, setY0] = useState<number>();
  const [y1, setY1] = useState<number>();

  // Stores crop information for video
  const [videoCrop, setVideoCrop] = useState<{
    cropWidth?: number;
    cropHeight?: number;
    cropOffsetX?: number;
    cropOffsetY?: number;
  }>({});

  // Stores the current trim endpoints
  const [trimEnds, setTrimEnds] = useState<{
    end: number;
    start: number;
  }>({
    end: 60,
    start: 0,
  });

  // Stores audio on/off information
  const [audioOn, setAudioOn] = useState<boolean>(true);

  // Setting original aspect ratio of image
  useEffect(() => {
    if (mediaUri && !isVideo) {
      Image.getSize(
        mediaUri,
        (w, h) => {
          setAspectRatio(w / h);
        },
        err => logger.log(err),
      );
    } else if (mediaUri && isVideo) {
      setVideoCrop(prevState => ({
        ...prevState,
        cropWidth: origDimensions[0],
        cropHeight: origDimensions[1],
      }));
    }
  }, []);

  // Possible need to delay setting aspect ratio of video until loaded
  useEffect(() => {
    if (mediaUri && isVideo) {
      setVideoCrop(prevState => ({
        ...prevState,
        cropWidth: origDimensions[0],
        cropHeight: origDimensions[1],
      }));
    }
  }, [origDimensions]);

  // Crops original image based of (x0, y0) and (x1, y1) coordinates
  const processCropParamsForMedia = (callback: (finalUri: string) => void) => {
    if (!isVideo) {
      if (x0 !== undefined && x1 !== undefined && y0 !== undefined && y1 !== undefined) {
        PhotoManipulator.crop(mediaUri, {
          x: x0,
          y: y1,
          width: Math.abs(x0 - x1),
          height: Math.abs(y0 - y1),
        })
          .then(croppedURL => {
            // Pass the cropped image
            callback(croppedURL);
          })
          .catch(err => logger.log('err: ', err));
      } else if (x0 === undefined && x1 === undefined && y0 === undefined && y1 === undefined) {
        // If no crop coordinates are set, then we will just pass the original image
        callback(mediaUri);
      }
    } else {
      if (!videoCrop.cropHeight || !videoCrop.cropWidth) {
        setVideoCrop(prevState => ({
          ...prevState,
          cropWidth: origDimensions[0],
          cropHeight: origDimensions[1],
        }));
      }
      setCropLoading(true);
      cropVideo(
        mediaUri,
        (croppedURL: string) => {
          setCropLoading(false);
          // Pass the cropped video
          callback(croppedURL);
        },
        videoCrop,
        !audioOn,
      );
    }
  };

  // for whenever the video is altered by the user
  const onVideoMove = (zoomableEvent: any) => {
    const { originalHeight, originalWidth } = zoomableEvent;

    let cropWidth = 0;
    let cropHeight = 0;
    let cropOffsetX = 0;
    let cropOffsetY = 0;

    if (vidRef !== null && vidRef.current !== null) {
      vidRef.current.measure(
        (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          // width
          cropWidth = origDimensions[0] * (originalWidth / width);

          // offsetX
          cropOffsetX = -1 * origDimensions[0] * (pageX / width);
          if (cropOffsetX < 0) {
            cropOffsetX = 0;
          } else if (cropOffsetX + cropWidth > origDimensions[0] - 1) {
            cropOffsetX = origDimensions[0] - cropWidth - 1;
          }

          // height
          if (height * (SCREEN_WIDTH / aspectRatio / originalHeight) > SCREEN_HEIGHT) {
            const superHeight = width / aspectRatio;
            cropHeight = origDimensions[1] * (originalHeight / superHeight);

            // offsetY
            const topDeadZone = (height - superHeight) / 2;
            const offsetY = topDeadZone + pageY;
            cropOffsetY = -1 * origDimensions[1] * (offsetY / superHeight);
            if (cropOffsetY < 0) {
              cropOffsetY = 0;
            } else if (cropOffsetY + cropHeight > origDimensions[1]) {
              cropOffsetY = origDimensions[1] - cropHeight - 1;
            }
          } else {
            cropHeight = origDimensions[1];
          }
          setVideoCrop(prevState => ({
            ...prevState,
            cropWidth: cropWidth,
            cropHeight: cropHeight,
            cropOffsetX: cropOffsetX,
            cropOffsetY: cropOffsetY,
          }));
        },
      );
    }
  };

  /* Records (x0, y0) and (x1, y1) coordinates used later for cropping,
   * based on(x, y) - the center of the image and scale of zoom
   */
  const onMove = (position: IOnMove) => {
    Image.getSize(
      mediaUri,
      (w, h) => {
        const x = position.positionX;
        const y = position.positionY;
        const scale = position.scale;
        const screen_ratio = SCREEN_HEIGHT / SCREEN_WIDTH;
        let tempx0 = w / 2 - x * (w / SCREEN_WIDTH) - w / 2 / scale;
        let tempx1 = w / 2 - x * (w / SCREEN_WIDTH) + w / 2 / scale;
        if (tempx0 < 0) {
          tempx0 = 0;
        }
        if (tempx1 > w) {
          tempx1 = w;
        }
        const x_distance = Math.abs(tempx1 - tempx0);
        const y_distance = screen_ratio * x_distance;
        let tempy0 = h / 2 - y * (h / SCREEN_HEIGHT) + y_distance / 2;
        let tempy1 = h / 2 - y * (h / SCREEN_HEIGHT) - y_distance / 2;
        if (tempy0 > h) {
          tempy0 = h;
        }
        if (tempy1 < 0) {
          tempy1 = 0;
        }
        setX0(tempx0);
        setX1(tempx1);
        setY0(tempy0);
        setY1(tempy1);
      },
      err => logger.log(err),
    );
  };

  const handleNext = () => {
    track(
      viaPostNowPopup ? 'PostNowPopupToCaptionScreen' : 'NextToCaptionScreen',
      AnalyticVerb.Pressed,
      AnalyticCategory.MomentUpload,
      {
        isVideo,
      },
    );
    if (momentUploadProgressBar) {
      Alert.alert(ERROR_MOMENT_UPLOAD_IN_PROGRESS);
    } else {
      processCropParamsForMedia(uri => {
        track('EditMedia', AnalyticVerb.Finished, AnalyticCategory.MomentUpload);
        navigation.navigate('CaptionScreen', {
          screenType,
          media: {
            uri,
            isVideo,
            videoDuration,
          },
          selectedCategory,
          viaPostNowPopup: viaPostNowPopup,
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      {(cropLoading || loading) && <TaggLoadingIndicator fullscreen />}
      {hideTrimmer && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            track(
              viaPostNowPopup ? 'PostNowPopupEditMedia' : 'EditMediaScreen',
              AnalyticVerb.Closed,
              AnalyticCategory.MomentUpload,
              {
                isVideo,
                videoDuration,
              },
            );
            navigation.goBack();
          }}>
          <SvgXml xml={icons.CloseOutline} height={25} width={25} color={'white'} />
        </TouchableOpacity>
      )}
      {!hideTrimmer && (
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => {
              track('HideTrimmer', AnalyticVerb.Pressed, AnalyticCategory.MomentUpload);
              setHideTrimmer(true);
            }}>
            <Text style={styles.bigText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              track('Trim', AnalyticVerb.Pressed, AnalyticCategory.MomentUpload);
              trimVideo(
                mediaUri,
                (trimmedUri: string) => {
                  setCropLoading(true);
                  setMediaUri(trimmedUri);
                  setTimeout(() => {
                    setHideTrimmer(true);
                    setCropLoading(false);
                  }, 500);
                },
                trimEnds,
              );
            }}>
            <Text style={styles.bigText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isVideo ? (
        <ImageZoom
          style={styles.zoomView}
          cropWidth={SCREEN_WIDTH}
          cropHeight={SCREEN_WIDTH / MediaContentDisplayRatio}
          imageWidth={SCREEN_WIDTH}
          imageHeight={SCREEN_WIDTH / MediaContentDisplayRatio}
          onMove={onMove}>
          <Image
            style={styles.imageContent}
            source={{
              uri: mediaUri,
            }}
          />
        </ImageZoom>
      ) : (
        <View style={styles.zoomableVideoContainer}>
          <ReactNativeZoomableView
            maxZoom={10}
            minZoom={1}
            zoomStep={0.5}
            initialZoom={isIPhoneX() ? 1.1 : 1}
            bindToBorders={true}
            doubleTapDelay={0}
            zoomEnabled={hideTrimmer}
            onShiftingAfter={(_1: any, _2: any, zoomableViewEventObject: any) => {
              onVideoMove(zoomableViewEventObject);
            }}
            onShiftingEnd={(_1: any, _2: any, zoomableViewEventObject: any) => {
              onVideoMove(zoomableViewEventObject);
            }}
            onZoomAfter={(_1: any, _2: any, zoomableViewEventObject: any) => {
              onVideoMove(zoomableViewEventObject);
            }}
            onZoomEnd={(_1: any, _2: any, zoomableViewEventObject: any) => {
              onVideoMove(zoomableViewEventObject);
            }}
            style={styles.zoomView}>
            <View style={styles.videoParent} ref={vidRef}>
              <TrimmerPlayer
                hideTrimmer={true} // trimmer feature disabled
                source={mediaUri}
                handleLoad={(width: number, height: number, duration: number) => {
                  setVideoDuration(duration);
                  setOrigDimensions([width, height]);
                  setAspectRatio(width / height);
                }}
                onChangedEndpoints={(response: { start: number; end: number }) =>
                  setTrimEnds(response)
                }
                muted={!audioOn}
              />
            </View>
          </ReactNativeZoomableView>
        </View>
      )}
      {isVideo && hideTrimmer && (
        <View style={styles.iconCarrier}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              track('Audio', AnalyticVerb.Toggled, AnalyticCategory.MomentUpload, {
                newState: !audioOn,
              });
              setAudioOn(state => !state);
            }}>
            <Image
              style={styles.volumnIcon}
              source={audioOn ? images.main.volume_on : images.main.volume_off}
            />
            <Text style={styles.iconText}>Volume</Text>
          </TouchableOpacity>
        </View>
      )}
      <DynamicBottomBar>
        {hideTrimmer && (
          <>
            <SaveButton
              style={styles.saveButton}
              onPress={() => {
                track('SaveMedia', AnalyticVerb.Pressed, AnalyticCategory.MomentUpload, {
                  isVideo,
                });
                setLoading(true);
                processCropParamsForMedia(uri =>
                  addTaggWatermark(uri, loggedInUserName, isVideo, watermarkedUri => {
                    setLoading(false);
                    saveMediaToGallery(watermarkedUri, isVideo);
                  }),
                );
              }}
            />
            <TaggSquareButton
              style={styles.button}
              onPress={handleNext}
              title={'Next'}
              buttonStyle={'large'}
              buttonColor={'blue'}
              labelColor={'white'}
              labelStyle={styles.buttonLabel}
            />
          </>
        )}
      </DynamicBottomBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    paddingTop: HeaderHeight,
    zIndex: 1,
    marginLeft: '5%',
  },
  topContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    width: SCREEN_WIDTH * 0.9,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  bigText: {
    fontSize: normalize(15),
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    width: 50,
  },
  button: {
    width: normalize(108),
    height: normalize(36),
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: normalize(15),
    lineHeight: normalize(17.8),
    letterSpacing: normalize(1.3),
    textAlign: 'center',
  },
  iconCarrier: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.1,
    borderRadius: SCREEN_WIDTH * 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    right: SCREEN_WIDTH * 0.025,
    top: SCREEN_HEIGHT * 0.1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconText: {
    color: 'white',
    fontSize: normalize(11),
    fontWeight: 'bold',
  },
  videoParent: {
    flex: 1,
  },
  zoomView: {
    backgroundColor: 'black',
  },
  volumnIcon: {
    width: 25,
    height: 25,
  },
  imageContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH / MediaContentDisplayRatio,
    resizeMode: 'contain',
  },
  zoomableVideoContainer: {
    height: SCREEN_WIDTH / MediaContentDisplayRatio,
    overflow: 'hidden',
  },
});

export default EditMedia;
