import React, { useState } from 'react';

import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { normalize } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { BottomDrawer, TabsGradient } from 'components';
import { ProfilePreviewType, ScreenType } from 'types';
import { isIPhoneX, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { ProfilePreview } from '../profile';

interface MutualFriendsProps {
  user: ProfilePreviewType;
  friends: ProfilePreviewType[];
}

const MutualFriends: React.FC<MutualFriendsProps> = ({ user, friends }): JSX.Element => {
  // Getting list of first 4 friends to display on suggested people screen
  const friendsPreview = friends.slice(0, 4);

  // Count to be displayed after + symbol
  const count = friends.length - friendsPreview.length;

  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      {friends && friends.length > 0 && (
        <SafeAreaView>
          <View style={styles.body}>
            <Text style={styles.title}>Mutual Friends</Text>
            <View style={styles.previewProfilesContainer}>
              {friendsPreview.map(profilePreview => (
                <ProfilePreview
                  previewType={'Suggested People Screen'}
                  screenType={ScreenType.DiscoverMoments}
                  profilePreview={profilePreview}
                />
              ))}
              {friends && friends.length > 4 && (
                <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                  <View style={styles.mutualFriendsButton}>
                    <Text style={styles.plusSign}>+</Text>
                    <Text style={styles.count}>{count}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <BottomDrawer
                initialSnapPosition={isIPhoneX() ? '43%' : '50%'}
                showHeader={false}
                isOpen={drawerVisible}
                setIsOpen={setDrawerVisible}>
                <View style={styles.mainContainer}>
                  <View style={styles.headerContainer}>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.headerTitle}>Mutual Friends</Text>
                      <Text style={styles.headerDescription} numberOfLines={2}>
                        @{user.username} and you are both friends with
                      </Text>
                    </View>
                  </View>
                  <View style={styles.scrollViewContainer}>
                    <ScrollView
                      contentContainerStyle={styles.scrollView}
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {friends.map(profilePreview => (
                        <ProfilePreview
                          previewType={'Suggested People Drawer'}
                          screenType={ScreenType.DiscoverMoments}
                          profilePreview={profilePreview}
                          setMFDrawer={setDrawerVisible}
                        />
                      ))}
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setDrawerVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </BottomDrawer>
            </View>
          </View>
        </SafeAreaView>
      )}
      <TabsGradient />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    width: SCREEN_WIDTH * 0.9,
    height: isIPhoneX() ? SCREEN_HEIGHT * 0.065 : SCREEN_HEIGHT * 0.08,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: isIPhoneX() ? 25 : 5,
  },
  title: {
    fontSize: normalize(12),
    lineHeight: normalize(12),
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: normalize(0.1),
    paddingBottom: '3.5%',
  },
  mutualFriendsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusSign: {
    fontSize: normalize(16),
    lineHeight: normalize(18),
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: normalize(0.1),
  },
  count: {
    fontSize: normalize(13),
    lineHeight: normalize(16),
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: normalize(0.1),
  },
  previewProfilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    width: SCREEN_WIDTH + 2,
    height: isIPhoneX() ? '28%' : '35%',
    borderTopRightRadius: normalize(13),
    borderTopLeftRadius: normalize(13),
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    shadowColor: '#7D7D7D',
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    marginBottom: 5.5,
    alignSelf: 'center',
  },
  headerTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '90%',
    alignSelf: 'center',
    marginTop: '4%',
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: '700',
    lineHeight: normalize(20.29),
    marginBottom: '0.5%',
    letterSpacing: normalize(0.1),
  },
  headerDescription: {
    fontSize: normalize(13),
    lineHeight: normalize(15),
    fontWeight: '600',
    color: '#828282',
    paddingTop: '2%',
    letterSpacing: normalize(0.05),
    textAlign: 'center',
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

export default MutualFriends;
