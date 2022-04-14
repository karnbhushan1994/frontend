import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { UniversityIcon } from 'components';
import { BadgeIcon, MutualFriends } from 'components/suggestedPeople';
import {
  ProfilePreviewType,
  ScreenType,
  SuggestedPeopleDataType,
  UniversityBadgeDisplayType,
} from 'types';
import { badgesToDisplayBadges, isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface SPBodyProps {
  item: SuggestedPeopleDataType;
  itemIndex: number;
  onAddFriend: (user: ProfilePreviewType) => Promise<void>;
  onCancelRequest: (user: ProfilePreviewType) => void;
  loggedInUserId: string;
}

const SPBody: React.FC<SPBodyProps> = ({
  item: { user, university, mutual_friends, suggested_people_url, friendship, badges },
  itemIndex,
  onAddFriend,
  onCancelRequest,
  loggedInUserId,
}) => {
  const firstItem = itemIndex === 0;
  const screenType = ScreenType.DiscoverMoments;
  const [displayBadges, setDisplayBadges] = useState<UniversityBadgeDisplayType[]>([]);
  const navigation = useNavigation();
  useEffect(() => {
    setDisplayBadges(badgesToDisplayBadges(badges, university));
  }, []);

  const FriendButton = () => {
    switch (friendship.status) {
      case 'friends':
        return <Fragment />;
      case 'requested':
        if (friendship.requester_id === loggedInUserId) {
          return (
            <TouchableOpacity
              style={styles.requestedButton}
              onPress={() => onCancelRequest(user)}
              disabled={false}>
              <SvgXml
                xml={icons.RequestedButton}
                width={SCREEN_WIDTH * 0.3}
                height={SCREEN_HEIGHT * 0.085}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity style={styles.addButton} disabled={true}>
              <Text style={styles.addButtonTitle}>{'Pending'}</Text>
            </TouchableOpacity>
          );
        }
      case 'no_record':
        return (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddFriend(user)}
            disabled={false}>
            {/*<Text style={styles.addButtonTitle}>{'Add Friend'}</Text>*/}
          </TouchableOpacity>
        );
      default:
        return <Fragment />;
    }
  };

  const backgroundImage = useMemo(
    () => (
      <Image
        source={{
          uri: suggested_people_url,
        }}
        style={styles.image}
      />
    ),
    [suggested_people_url],
  );

  const NamePlate = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Profile', {
          userXId: loggedInUserId === user.id ? undefined : user.id,
          screenType: screenType,
          showShareModalParm: false,
        });
      }}>
      <Text style={styles.firstName}>{user.first_name}</Text>
      <Text style={styles.username}>@{user.username}</Text>
    </TouchableOpacity>
  );

  const Badges = () => (
    // Badges aligned left and spaced as if there are 5 items
    <View style={styles.badgeContainer}>
      {displayBadges.map((displayBadge, index) => (
        <BadgeIcon key={index} badge={displayBadge} style={styles.badge} />
      ))}
      {Array(5)
        .fill(0)
        .splice(displayBadges.length, 5)
        .map((_, index) => (
          <View key={index} style={styles.badge} />
        ))}
    </View>
  );

  return (
    <View>
      {backgroundImage}
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{firstItem && 'Suggested People'}</Text>
          <UniversityIcon
            university={university}
            style={styles.universityIcon}
            imageStyle={styles.universityIcon}
          />
        </View>
        <View>
          <View style={styles.marginManager}>
            <View style={styles.addUserContainer}>
              <NamePlate />
              {user.id !== loggedInUserId && <FriendButton />}
            </View>
          </View>
          {displayBadges.length !== 0 && <Badges />}
          <View style={styles.marginManager}>
            <MutualFriends user={user} friends={mutual_friends} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingVertical: '15%',
    paddingBottom: '20%',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  topContainer: {
    height: isIPhoneX() ? SCREEN_HEIGHT * 0.11 : SCREEN_HEIGHT * 0.13,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  marginManager: { marginHorizontal: '5%' },
  image: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 0,
  },
  title: {
    zIndex: 1,
    paddingTop: '3%',
    alignSelf: 'center',
    fontSize: normalize(22),
    lineHeight: normalize(26),
    fontWeight: '800',
    letterSpacing: normalize(3),
    color: '#FFFEFE',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: normalize(2), height: normalize(2) },
    textShadowRadius: normalize(2),
  },
  firstName: {
    color: '#fff',
    fontWeight: '800',
    fontSize: normalize(24),
    lineHeight: normalize(29),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: normalize(2), height: normalize(2) },
    textShadowRadius: normalize(2),
    letterSpacing: normalize(2.5),
    alignSelf: 'baseline',
  },
  username: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(15),
    lineHeight: normalize(18),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: normalize(2), height: normalize(2) },
    textShadowRadius: normalize(2),
    letterSpacing: normalize(2),
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.085,
    padding: 0,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 1,
    marginLeft: '1%',
    marginTop: '4%',
    shadowColor: 'rgb(0, 0, 0)',
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  addButtonTitle: {
    color: 'white',
    padding: 0,
    fontSize: normalize(15),
    lineHeight: normalize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: normalize(1),
  },
  addUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '5%',
  },
  requestedButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.085,
    padding: 0,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 1,
    marginLeft: '1%',
    marginTop: '4%',
    shadowColor: 'rgb(0, 0, 0)',
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  universityIcon: {
    left: '5%',
    width: normalize(31),
    height: normalize(38),
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 25,
  },
  badge: {
    width: normalize(52),
    height: normalize(52),
  },
});

export default SPBody;
