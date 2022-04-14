import React, { useEffect, useRef, useState } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { Trimmer } from 'react-native-video-processing';

import { AnalyticCategory, AnalyticVerb } from 'types';
import { MediaContentDisplayRatio, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

interface TrimmerPlayerProps {
  source: string;
  hideTrimmer: boolean;
  handleLoad: Function;
  onChangedEndpoints: Function;
  muted: boolean;
}

const TrimmerPlayer: React.FC<TrimmerPlayerProps> = ({
  source,
  hideTrimmer,
  handleLoad,
  onChangedEndpoints,
  muted,
}) => {
  // Stores the reference to player for seeking
  const playerRef = useRef<Video>();
  const screenIsFocused = useIsFocused();
  // Stores where the video is playing (seekTime)
  const [seekTime, setSeekTime] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  // Stores where the tracker is
  const [trackerTime, setTrackerTime] = useState<number>(0);
  // Stores start/end of desired trimmed video
  const [end, setEnd] = useState<number>(60);
  const [start, setStart] = useState<number>(0);

  // Slight delay to play video since RNCamera can't record and play video here
  // at the same time.
  // see: https://github.com/react-native-camera/react-native-camera/issues/2592
  useEffect(() => {
    setTimeout(() => {
      setPaused(false);
    }, 1000);
  }, []);

  useEffect(() => {
    playerRef.current?.seek(seekTime);
  }, [seekTime]);
  useEffect(() => {
    if (!paused && (trackerTime >= end || trackerTime < start)) {
      setTrackerTime(start);
      playerRef.current?.seek(start);
    }
  }, [trackerTime]);
  useEffect(() => {
    setSeekTime(start);
    setTrackerTime(start);
  }, [start]);
  useEffect(() => {
    setSeekTime(end);
    setTrackerTime(start);
  }, [end]);
  // Callback so parent knows where the trimming endpts are
  useEffect(() => {
    track('Trim', AnalyticVerb.Updated, AnalyticCategory.MomentUpload);
    onChangedEndpoints({ end, start });
  }, [end, start]);

  useEffect(() => {
    playerRef.current?.seek(0);
  }, [hideTrimmer]);

  return (
    <>
      <Video
        // link to descr and use of props of video player ->
        // https://github.com/react-native-video/react-native-video
        ref={ref => {
          playerRef.current = ref || undefined;
        }}
        style={styles.video}
        source={{ uri: source }}
        ignoreSilentSwitch={'ignore'}
        rate={1.0}
        volume={1.0}
        muted={muted}
        paused={paused || !screenIsFocused}
        resizeMode={'contain'}
        repeat={true}
        onLoad={payload => {
          setEnd(payload.duration);
          const { width, height } = payload.naturalSize;
          if (payload.naturalSize.orientation === 'portrait') {
            handleLoad(height, width, payload.duration);
          } else {
            handleLoad(width, height, payload.duration);
          }
        }}
        onProgress={e => {
          if (!paused) {
            setTrackerTime(e.currentTime);
          }
        }} // Callback every ~250ms with currentTime
        onTouchEnd={() => {
          setPaused(state => !state);
        }}
      />
      {!hideTrimmer && (
        <View style={styles.trimmerContainer}>
          <Trimmer
            // link to descr and use of props for trimmer ->
            // https://github.com/shahen94/react-native-video-processing
            source={source}
            height={75}
            width={SCREEN_WIDTH}
            onTrackerMove={(e: { currentTime: number }) => {
              setPaused(true);
              setSeekTime(e.currentTime);
            }}
            currentTime={trackerTime}
            themeColor={'white'}
            thumbWidth={10}
            trackerColor={'white'}
            onChange={(e: { endTime: number; startTime: number }) => {
              setPaused(true);
              setEnd(e.endTime);
              setStart(e.startTime);
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  trimmerContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  video: {
    height: SCREEN_WIDTH / MediaContentDisplayRatio,
  },
});

export default TrimmerPlayer;
