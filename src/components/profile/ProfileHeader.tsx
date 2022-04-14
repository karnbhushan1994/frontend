import React, { useRef, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import { PROFILE_CUTOUT_TOP_Y } from '../../constants';
import { RootState } from '../../store/rootReducer';
import { AnalyticCategory, AnalyticVerb, ScreenType } from '../../types';
import { normalize, track } from '../../utils';
import FriendsCount from './FriendsCount';
import ProfileMoreInfoDrawer from './ProfileMoreInfoDrawer';
import TaggAvatar from './TaggAvatar';
import UniversityIcon from './UniversityIcon';

type ProfileHeaderProps = {
  userXId: string | undefined;
  screenType: ScreenType;
  isBlocked: boolean;
  handleBlockUnblock: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userXId,
  screenType,
  isBlocked,
  handleBlockUnblock,
}) => {
  const {
    profile: { name = '', university_class = 2021, university },
    user: { username: userXName = '', userId },
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const {
    user: { username = '' },
  } = useSelector((state: RootState) => state.user);

  const [drawerVisible, setDrawerVisible] = useState(false);

  const containerRef = useRef(null);
  const childRef = useRef(null);

  return (
    <View ref={containerRef} style={styles.container}>
      <ProfileMoreInfoDrawer
        isOpen={drawerVisible}
        isBlocked={isBlocked}
        handleBlockUnblock={handleBlockUnblock}
        userXId={userXId}
        userXName={userXName}
        setIsOpen={setDrawerVisible}
      />
      <View style={styles.row}>
        <TaggAvatar
          style={styles.avatar}
          userXId={userXId}
          screenType={screenType}
          editable={true}
        />
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.friendsAndUniversity}>
            <FriendsCount screenType={screenType} userXId={userXId} />
            <TouchableOpacity
              onPress={() => {
                track('UniversityCrest', AnalyticVerb.Pressed, AnalyticCategory.Profile, {
                  university,
                  user: {
                    username,
                    userId,
                  },
                });
              }}>
              <View ref={childRef}>
                <UniversityIcon
                  {...{
                    university,
                    university_class,
                    needsShadow: true,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: PROFILE_CUTOUT_TOP_Y * 1.02,
    width: '100%',
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginRight: '15%',
    marginLeft: '5%',
    flex: 1,
  },
  avatar: {
    marginLeft: '3%',
    top: '-8%',
  },
  name: {
    fontSize: normalize(17),
    fontWeight: '500',
    alignSelf: 'center',
  },
  friendsAndUniversity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: 50,
  },
  emptyContainer: { backgroundColor: 'white', width: 50, height: 50 },
});

export default ProfileHeader;
