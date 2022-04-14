import { TAGG_PURPLE } from 'constants';

import React, { useEffect, useRef, useState } from 'react';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { normalize } from 'react-native-elements';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { MomentPost, TabsGradient, TaggToast } from 'components';

import { MainStackParams } from 'routes';
import { MomentContextType, MomentPostType, TaggToastType } from 'types';
import { incrementMomentShareCount, SCREEN_HEIGHT } from 'utils';

import { ERROR_MOMENT_UNAVAILABLE, MOMENT_NO_LONGER_AVAILABLE } from '../../constants/strings';
import { RootState } from '../../store/rootReducer';

export const MomentContext = React.createContext({} as MomentContextType);

type IndividualMomentRouteProp = RouteProp<MainStackParams, 'IndividualMoment'>;

type IndividualMomentNavigationProp = StackNavigationProp<MainStackParams, 'IndividualMoment'>;

interface IndividualMomentProps {
  route: IndividualMomentRouteProp;
  navigation: IndividualMomentNavigationProp;
}

const IndividualMoment: React.FC<IndividualMomentProps> = ({ route }) => {
  const {
    userXId,
    screenType,
    moment: { moment_category, moment_id },
    needToOpenCommentDrawer,
    ownProfile,
  } = route.params;
  const navigation = useNavigation();
  const { moments } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.moments,
  );
  const { loading } = useSelector((state: RootState) => state.apiLoader);
  const onLongPressMethod = (): void => {};
  const scrollRef = useRef<FlatList<MomentPostType>>(null);
  const [momentData, setMomentData] = useState<MomentPostType[]>([]);
  const [isMomentAvailable, setIsMomentAvailable] = useState<boolean>(false);
  // To display error message when moment unavailable
  const toast = useToast();
  useEffect(() => {
    const extractedMoments = moments.filter(m => m.moment_category === moment_category);
    if (extractedMoments.findIndex(m => m.moment_id === moment_id) === -1) {
      setIsMomentAvailable(true);
    } else {
      setIsMomentAvailable(false);
    }
    /* momentData cannot be set as a dependency since it gets
     * updated when view count changes
     */
    if (
      extractedMoments.length > 0 &&
      extractedMoments.findIndex(m => m.moment_id === moment_id) === -1
    ) {
      TaggToast(toast, TaggToastType.Error, ERROR_MOMENT_UNAVAILABLE);
    }
    setMomentData(extractedMoments);
  }, [moments]);
  const initialIndex = momentData.findIndex(m => m.moment_id === moment_id);
  const [currentVisibleMomentId, setCurrentVisibleMomentId] = useState<string | undefined>();
  const [viewableItems, setViewableItems] = useState<ViewToken[]>([]);
  const [stateComment, setstateComment] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(loading);
  // https://stackoverflow.com/a/57502343
  const viewabilityConfigCallback = useRef((info: { viewableItems: ViewToken[] }) => {
    setViewableItems(info.viewableItems);
  });

  useEffect(() => {
    setTimeout(() => {
      setLoader(loading);
    }, 500);
  }, [loading]);

  useEffect(() => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && momentData.length > 0) {
        setCurrentVisibleMomentId(momentData[index].moment_id);
      }
    }
  }, [viewableItems]);
  useEffect(() => {
    if (needToOpenCommentDrawer) {
      setstateComment(needToOpenCommentDrawer);
    }
  }, [route.params]);
  const callVibrationheptic = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
  };
  if (loader) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator style={styles.loader} size="large" color={TAGG_PURPLE} />
      </View>
    );
  }
  const goBackHandler = () => navigation.goBack();

  return (
    <MomentContext.Provider
      value={{
        currentVisibleMomentId,
        isDiscoverMoment: false,
      }}>
      <>
        {!userXId && !ownProfile && (
          <SvgXml
            xml={icons.BackArrow}
            height={normalize(18)}
            width={normalize(18)}
            color={'white'}
            style={styles.backArrow}
            onPress={goBackHandler}
          />
        )}
        {isMomentAvailable ? (
          <View style={styles.momentDeleted}>
            <Image source={images.main.nomomenticon} style={styles.infoIcon} />
            <Text style={styles.noMomentAvialable}>{MOMENT_NO_LONGER_AVAILABLE}</Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={scrollRef}
              data={momentData}
              maxToRenderPerBatch={1}
              updateCellsBatchingPeriod={1}
              initialNumToRender={1}
              windowSize={1}
              renderItem={({ index, item }) => (
                <Animated.View style={[styles.flatlistItem, {}]}>
                  <MomentPost
                    key={item.moment_id}
                    moment={item}
                    screenType={screenType}
                    incrementMomentShareCount={() => {
                      if (currentVisibleMomentId) {
                        incrementMomentShareCount(
                          currentVisibleMomentId,
                          momentData,
                          setMomentData,
                        );
                      }
                    }}
                    momentContext={MomentContext}
                    individualScroll={true}
                    index={index}
                    userXId={userXId}
                    setLongPressed={onLongPressMethod}
                    onItemChange={viewableItems}
                    needToOpenCommentDrawer={stateComment}
                  />
                </Animated.View>
              )}
              keyExtractor={(item, _) => item.moment_id}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={initialIndex}
              onViewableItemsChanged={viewabilityConfigCallback.current}
              getItemLayout={(data, index) => ({
                length: SCREEN_HEIGHT,
                offset: SCREEN_HEIGHT * index,
                index,
              })}
              pagingEnabled
              onScrollEndDrag={() => {
                callVibrationheptic();
              }}
              onScrollBeginDrag={() => {
                callVibrationheptic();
              }}
              keyboardShouldPersistTaps="always"
            />
            <TabsGradient />
          </>
        )}
      </>
    </MomentContext.Provider>
  );
};

const styles = StyleSheet.create({
  flatlistItem: {
    backgroundColor: 'black',
    zIndex: 99999,
    flex: 1,
  },
  loaderWrapper: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  momentDeleted: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  infoIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  noMomentAvialable: {
    color: '#BDBDBD',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  backArrow: {
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    position: 'absolute',
    left: 25,
    top: 55,
    zIndex: 100,
  },
});

export default IndividualMoment;
