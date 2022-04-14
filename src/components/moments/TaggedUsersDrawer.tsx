import React from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomDrawer, ProfilePreview } from 'components';
import { ProfilePreviewType, ScreenType } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface TaggedUsersDrawerProps {
  users: ProfilePreviewType[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
const TaggedUsersDrawer: React.FC<TaggedUsersDrawerProps> = ({ users, isOpen, setIsOpen }) => (
  <BottomDrawer
    initialSnapPosition={isIPhoneX() ? '35%' : '40%'}
    showHeader={false}
    isOpen={isOpen}
    setIsOpen={setIsOpen}>
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tagged Friends</Text>
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {users.map(profilePreview => (
            <ProfilePreview
              key={profilePreview.id}
              previewType={'Suggested People Drawer'}
              screenType={ScreenType.DiscoverMoments}
              profilePreview={profilePreview}
              setMFDrawer={setIsOpen}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setIsOpen(false)}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </BottomDrawer>
);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.46,
    borderTopRightRadius: normalize(13),
    borderTopLeftRadius: normalize(13),
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(17),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(13),
    borderTopLeftRadius: normalize(13),
  },
  title: {
    fontSize: normalize(17),
    lineHeight: 20,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    height: isIPhoneX() ? 153 : 135,
    shadowColor: 'rgb(125, 125, 125)',
    marginTop: '1%',
  },
  scrollView: {
    height: '95%',
    padding: 0,
    marginHorizontal: '5%',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButtonText: {
    top: isIPhoneX() ? '6%' : '7%',
    color: '#698DD3',
    fontSize: normalize(16),
    fontWeight: '700',
    lineHeight: normalize(20),
    letterSpacing: normalize(0.1),
  },
});

export default TaggedUsersDrawer;
