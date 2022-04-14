import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { TAGG_DARK_BLUE, TAGG_LIGHT_BLUE } from '../../constants';

import { RootState } from '../../store/rootReducer';
import { GenericMoreInfoDrawer } from '../common';

interface ProfileMoreInfoDrawerProps {
  isOpen: boolean;
  setIsOpen: (visible: boolean) => void;
  userXId: string | undefined;
  userXName: string;
  isBlocked: boolean;
  handleBlockUnblock: (callback?: () => void) => void;
}

const ProfileMoreInfoDrawer: React.FC<ProfileMoreInfoDrawerProps> = props => {
  const navigation = useNavigation();
  const { setIsOpen, userXId, isBlocked, handleBlockUnblock, userXName } = props;
  const {
    user: { userId, username },
  } = useSelector((state: RootState) => state.user);
  const isOwnProfile = !userXId || userXName === username;

  const goToEditProfile = () => {
    navigation.navigate('EditProfile', {
      userId: userId,
      username: username,
    });
    setIsOpen(false);
  };

  const goToSettingsPage = () => {
    navigation.navigate('SettingsScreen');
    setIsOpen(false);
  };

  const onBlockUnblock = () => {
    handleBlockUnblock(() => setIsOpen(false));
  };

  return (
    <>
      <TouchableOpacity
        style={styles.more}
        onPress={() => {
          setIsOpen(true);
        }}>
        <SvgXml xml={icons.MoreHoriz} height={30} width={30} color={TAGG_DARK_BLUE} />
      </TouchableOpacity>
      {!isOwnProfile ? (
        <GenericMoreInfoDrawer
          {...props}
          showIcons={false}
          buttons={[
            [
              (isBlocked ? 'Unblock' : 'Block') + ` ${userXName}`,
              onBlockUnblock,
              undefined,
              { color: 'red' },
            ],
          ]}
        />
      ) : (
        <GenericMoreInfoDrawer
          {...props}
          showIcons={true}
          buttons={[
            [
              'Settings',
              goToSettingsPage,
              <Image source={images.settings.settings} style={styles.image} />,
              { color: 'black' },
            ],
            [
              'Edit Profile',
              goToEditProfile,
              <Image source={images.settings.editProfile} style={styles.image} />,
              { color: 'black' },
            ],
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  panel: {
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelButton: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    height: 25,
    width: 25,
    color: 'black',
    marginLeft: SCREEN_WIDTH * 0.3,
    marginRight: 25,
  },
  panelButtonTitleCancel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TAGG_LIGHT_BLUE,
  },
  divider: { height: 1, borderWidth: 1, borderColor: '#e7e7e7' },
  more: {
    position: 'absolute',
    right: '5%',
    zIndex: 1,
  },
  image: {
    width: 25,
    height: 25,
  },
});

export default ProfileMoreInfoDrawer;
