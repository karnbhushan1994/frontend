import React, { useEffect, useState } from 'react';

import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { getLinkedSocials } from 'services';
import { loadIndividualSocial, updateSocial } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types';

import { INTEGRATED_SOCIAL_LIST, PROFILE_CUTOUT_BOTTOM_Y, SOCIAL_LIST } from '../../constants';

import Tagg from './Tagg';

const { View, ScrollView } = Animated;
interface TaggsBarProps {
  y: Animated.SharedValue<number>;
  profileBodyHeight: number;
  userXId: string | undefined;
  screenType: ScreenType;
  linkedSocials?: string[];
  onLayout: (event: LayoutChangeEvent) => void;
}
const TaggsBar: React.FC<TaggsBarProps> = ({
  y,
  profileBodyHeight,
  userXId,
  screenType,
  linkedSocials,
  onLayout,
}) => {
  const dispatch = useDispatch();
  let [taggs, setTaggs] = useState<Object[]>([]);
  let [taggsNeedUpdate, setTaggsNeedUpdate] = useState(true);
  const { user } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );
  const insetTop = useSafeAreaInsets().top;
  /**
   * Updates the individual social that needs update
   * If username is empty, update nonintegrated socials like Snapchat and TikTok
   * @param socialType Type of the social that needs update
   */
  const handleSocialUpdate = (socialType: string, username: string) => {
    if (username !== '') {
      dispatch(updateSocial(socialType, username));
    } else {
      dispatch(loadIndividualSocial(user.userId, socialType));
    }
  };

  /**
   * This useEffect should be called evey time the user being viewed is changed OR
   * And update is triggered manually
   */
  useEffect(() => {
    const loadData = async () => {
      const socials: string[] = linkedSocials ? linkedSocials : await getLinkedSocials(user.userId);
      const unlinkedSocials = SOCIAL_LIST.filter(s => socials.indexOf(s) === -1);
      let new_taggs = [];
      let i = 0;
      for (let social of socials) {
        new_taggs.push(
          <Tagg
            key={i}
            social={social}
            userXId={userXId}
            user={user}
            isLinked={true}
            isIntegrated={INTEGRATED_SOCIAL_LIST.indexOf(social) !== -1}
            setTaggsNeedUpdate={setTaggsNeedUpdate}
            setSocialDataNeedUpdate={handleSocialUpdate}
          />,
        );
        i++;
      }
      if (!userXId) {
        for (let social of unlinkedSocials) {
          new_taggs.push(
            <Tagg
              key={i}
              social={social}
              isLinked={false}
              isIntegrated={INTEGRATED_SOCIAL_LIST.indexOf(social) !== -1}
              setTaggsNeedUpdate={setTaggsNeedUpdate}
              setSocialDataNeedUpdate={handleSocialUpdate}
              userXId={userXId}
              user={user}
            />,
          );
          i++;
        }
      }
      setTaggs(new_taggs);
      setTaggsNeedUpdate(false);
    };
    if (user.userId) {
      loadData();
    }
  }, [taggsNeedUpdate, user]);
  const paddingTopStylesProgress = interpolate(
    y.value,
    [PROFILE_CUTOUT_BOTTOM_Y, PROFILE_CUTOUT_BOTTOM_Y + profileBodyHeight],
    [0, 1],
    Extrapolate.CLAMP,
  );
  const shadowOpacityStylesProgress = useDerivedValue(() =>
    interpolate(
      y.value,
      [
        PROFILE_CUTOUT_BOTTOM_Y + profileBodyHeight,
        PROFILE_CUTOUT_BOTTOM_Y + profileBodyHeight + insetTop,
      ],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  );
  const animatedStyles = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacityStylesProgress.value / 5,
    paddingTop: paddingTopStylesProgress + insetTop,
  }));

  return taggs.length > 0 ? (
    <View style={[styles.container, animatedStyles]} onLayout={onLayout}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer]}>
        {taggs}
      </ScrollView>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
});

export default TaggsBar;
