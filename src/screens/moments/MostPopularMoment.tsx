import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Video from 'react-native-video';

import { useDispatch, useSelector } from 'react-redux';

import { insightsIcons } from 'assets/insights';
import { Divider } from 'components/divider/Divider';
import MomentsTotal from 'components/moments/MomentsTotal';
import TopMomentStats from 'components/moments/TopMomentStats';
import { RangePicker } from 'components/rangePicker';

import { getMomentInsights } from 'services';
import { RootState } from 'store/rootReducer';
import { MomentType, ProfileInsightsEnum } from 'types';
import { getTokenOrLogout, isUrlAVideo, normalize } from 'utils';

interface State {
  moment: {
    total_views: number;
    top_moment: {
      moment?: MomentType;
      views: number;
      shares: number;
      comments: number;
    };
  };
}
const momentInitData = {
  moment: {
    total_views: 0,
    top_moment: {
      moment: undefined,
      views: 0,
      shares: 0,
      comments: 0,
    },
  },
};
export const MostPopularMoment = () => {
  const {
    user: { userId },
  } = useSelector((state: RootState) => state.user);
  const [insights, setInsights] = useState(ProfileInsightsEnum.Week);
  const [data, setData] = useState<State>(momentInitData);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.moment?.top_moment?.moment) {
      setIsVideo(isUrlAVideo(data.moment.top_moment.moment.moment_url));
      setUrl(data.moment.top_moment.moment.moment_url);
    }
  }, [data?.moment?.top_moment?.moment]);

  const dispatch = useDispatch();
  const getData = async () => {
    //setData(momentInitData);
    const token = await getTokenOrLogout(dispatch);
    const moment = (await getMomentInsights(token, userId, insights)) as any;
    setData({ moment });
  };
  const init = useCallback(() => {
    getData();
  }, [data, insights]);
  useEffect(() => {
    const sub = init();
    return sub;
  }, [userId, insights]);

  const Moment = useMemo(
    () =>
      data?.moment?.top_moment?.moment ? (
        isVideo ? (
          <View style={styles.videoContainer}>
            <Video
              source={{
                uri: url,
              }}
              onLoadStart={() => setLoading(true)}
              onReadyForDisplay={() => setLoading(false)}
              style={styles.moment}
              resizeMode={'cover'}
              ignoreSilentSwitch={'obey'}
              volume={1}
              repeat={true}
            />
          </View>
        ) : (
          <Image
            source={{ uri: url }}
            style={styles.moment}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        )
      ) : (
        <>
          <View style={styles.content}>
            <View style={styles.podcastLayer}>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.podcastImage}
                  source={insightsIcons.NoMoments}
                />
                <Text style={styles.noMomentText}>{'No Moments'}</Text>
              </View>
            </View>
          </View>
        </>
      ),
    [data?.moment?.top_moment?.moment, url],
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <RangePicker insights={insights} changeInsights={setInsights} />
        <Divider />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <MomentsTotal total={data?.moment?.total_views} rangeDay={insights} />
          <Divider />
          <View style={styles.momentContainer}>
            {loading && (
              <View style={styles.loaderStyle}>
                <ActivityIndicator size="large" color={'gray'} />
              </View>
            )}
            {Moment}
          </View>
          <Divider />
          <TopMomentStats top_moment={data?.moment?.top_moment} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  podcastLayer: {
    backgroundColor: '#DADADA',
    width: 240,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 7.15,
    paddingTop: 5,
    paddingBottom: 30,
  },
  container: { paddingTop: 50, flex: 1 },
  blockArea: { position: 'absolute', zIndex: 999, backgroundColor: 'rgba(0, 0, 0,0.6)' },
  videoContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  moment: { width: 240, height: 420, alignSelf: 'center' },
  noMomentView: {
    width: 240,
    height: 420,
    alignSelf: 'center',
    backgroundColor: '#DADADA',
  },
  noMomentText: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#828282',
    alignSelf: 'center',
    paddingTop: 10,
  },
  podcastImage: {
    width: 200,
    height: 200,
  },
  momentContainer: { paddingVertical: 10 },
  contentContainer: {
    paddingBottom: 60,
  },
  loaderStyle: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
