import {useNavigation} from '@react-navigation/core';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {BadgeIcon} from '..';
import PlusIconImage from '../../assets/icons/plus-icon-thin.svg';
import {BADGE_LIMIT} from '../../constants';
import {RootState} from '../../store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  BadgeDisplayType,
  ScreenType,
} from '../../types';
import {badgesToDisplayBadges, normalize, track} from '../../utils';
import BadgeDetailView from '../common/BadgeDetailView';

interface ProfileBadgesProps {
  userXId: string | undefined;
  screenType: ScreenType;
}

// Displayed on ProfileScreen in the header area
const ProfileBadges: React.FC<ProfileBadgesProps> = ({userXId, screenType}) => {
  const navigation = useNavigation();
  const {badges, name} = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId].profile : state.user.profile,
  );
  const [displayBadges, setDisplayBadges] = useState<BadgeDisplayType[]>([]);
  const [isEditBadgeModalVisible, setIsEditBadgeModalVisible] = useState(false);
  const isOwnProfile = userXId === undefined;

  useEffect(() => {
    setDisplayBadges(badgesToDisplayBadges(badges));
  }, [badges]);

  const PlusIcon: FC = () => (
    <TouchableOpacity
      onPress={() => {
        track('BadgePlusIcon', AnalyticVerb.Pressed, AnalyticCategory.Profile);
        navigation.navigate('BadgeSelection', {editing: true});
      }}>
      <PlusIconImage style={styles.plus} />
    </TouchableOpacity>
  );

  const CloseIcon: FC = () => (
    <TouchableOpacity
      onPress={() => {
        track('ProfileBadges', AnalyticVerb.Closed, AnalyticCategory.Profile);
        setIsEditBadgeModalVisible(true);
      }}>
      <PlusIconImage style={styles.close} />
    </TouchableOpacity>
  );

  return (
    <>
      {/* Tutorial text */}
      {displayBadges.length === 0 && isOwnProfile && (
        // Grey circle placeholders
        <ScrollView
          contentContainerStyle={styles.badgeContainer}
          scrollEnabled={false}
          horizontal>
          <PlusIcon />
          {Array(BADGE_LIMIT)
            .fill(0)
            .map((_item, index) => (
              <View key={index} style={[styles.grey, styles.circle]} />
            ))}
        </ScrollView>
      )}
      {displayBadges.length !== 0 && (
        // Populating actual badges
        <ScrollView
          contentContainerStyle={styles.badgeContainer}
          scrollEnabled={false}
          horizontal>
          {/* Actual badges */}
          {displayBadges.map((displayBadge) => (
            <BadgeIcon
              key={displayBadge.id}
              badge={displayBadge}
              screenType={screenType}
            />
          ))}
          {/* Plus icon */}
          {displayBadges.length < BADGE_LIMIT && isOwnProfile && <PlusIcon />}
          {/* Empty placeholders for space-between styling */}
          {Array(BADGE_LIMIT + 1)
            .fill(0)
            .splice(displayBadges.length + 1, BADGE_LIMIT)
            .map((_item, index) => (
              <View key={index} style={styles.circle} />
            ))}
          {/* X button */}
          {displayBadges.length === BADGE_LIMIT && isOwnProfile && (
            <CloseIcon />
          )}
        </ScrollView>
      )}
      {isEditBadgeModalVisible && (
        <BadgeDetailView
          userXId={userXId}
          screenType={screenType}
          isEditable={isOwnProfile}
          userFullName={name}
          setBadgeViewVisible={setIsEditBadgeModalVisible}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  circle: {
    width: normalize(31),
    height: normalize(31),
    borderRadius: normalize(31) / 2,
  },
  grey: {
    backgroundColor: '#c4c4c4',
  },
  plus: {
    width: normalize(31),
    height: normalize(31),
    color: 'black',
  },
  close: {
    width: normalize(31),
    height: normalize(31),
    color: 'grey',
    transform: [{rotate: '45deg'}],
  },
});

export default ProfileBadges;
