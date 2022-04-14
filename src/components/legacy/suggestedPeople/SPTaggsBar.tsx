
import { INTEGRATED_SOCIAL_LIST, SOCIAL_LIST } from '../../../constants';

import React, { useEffect, useState } from 'react';

import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import Tagg from 'components/taggs/Tagg';

import { getLinkedSocials } from 'services';
import { loadIndividualSocial, updateSocial } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { ScreenType } from 'types';

const { View, ScrollView } = Animated;
interface TaggsBarProps {
  userXId: string | undefined;
  screenType: ScreenType;
  linkedSocials?: string[];
}
const TaggsBar: React.FC<TaggsBarProps> = ({ userXId, screenType, linkedSocials }) => {
  let [taggs, setTaggs] = useState<Object[]>([]);
  let [taggsNeedUpdate, setTaggsNeedUpdate] = useState(true);
  const { user } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const dispatch = useDispatch();

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
            screenType={screenType}
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
              screenType={screenType}
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

  return taggs.length > 0 ? (
    <View style={styles.spContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {taggs}
      </ScrollView>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  spContainer: {
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1,
    marginBottom: 25,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 5,
  },
});

export default TaggsBar;
