import React from 'react';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomDrawer, ShareToSocialTile } from 'components';
import { MomentContextType, MomentPostType, ScreenType, ShareToType } from 'types';
import { isIPhoneX, normalize, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

interface ShareMomentDrawerProps {
  isOpen: boolean;
  moment: MomentPostType;
  setIsOpen: (open: boolean) => void;
  isVideo: boolean;
  screenType: ScreenType;
  incrementMomentShareCount: () => void;
  momentContext: React.Context<MomentContextType>;
}

const ShareMomentDrawer: React.FC<ShareMomentDrawerProps> = ({
  isOpen,
  setIsOpen,
  moment,
  isVideo,
  incrementMomentShareCount,
  momentContext,
}) => {
  // See https://github.com/TaggiD-Inc/Frontend/pull/566
  // To see the removed code for sharing to Tagg DM.

  const SHARE_TO_OPTIONS: ShareToType[] = [
    'Copy Link',
    'SMS',
    // 'Snapchat',
    'Twitter',
    // 'Facebook',
    'Instagram',
    'Others',
  ];
  return (
    <BottomDrawer
      initialSnapPosition={isIPhoneX() ? '28%' : '32%'}
      showHeader={false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Share to</Text>
        </View>
        <View style={styles.scrollViewSocialsContainer}>
          <FlatList
            style={styles.scrollViewSocials}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SHARE_TO_OPTIONS}
            keyExtractor={(item: string, index) => item + index}
            renderItem={({ item: shareToOption }: { item: ShareToType }) => (
              <ShareToSocialTile
                key={shareToOption}
                shareTo={shareToOption}
                moment={moment}
                isVideo={isVideo}
                incrementMomentShareCount={incrementMomentShareCount}
                momentContext={momentContext}
              />
            )}
          />
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsOpen(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

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
    paddingVertical: normalize(10),
    backgroundColor: '#fff',
    borderTopRightRadius: normalize(13),
    borderTopLeftRadius: normalize(13),
  },
  title: {
    fontSize: normalize(17),
    lineHeight: normalize(20),
    fontWeight: '700',
  },
  scrollViewUsersContainer: {
    height: isIPhoneX() ? 110 : 95,
    backgroundColor: '#fff',
    paddingTop: '3%',
  },
  scrollViewUsers: {
    height: '95%',
    padding: 0,
  },
  scrollViewSocialsContainer: {
    height: isIPhoneX() ? 110 : 95,
    paddingTop: '3%',
    backgroundColor: 'white',
  },
  scrollViewSocials: {
    padding: 0,
  },
  cancelButton: {
    backgroundColor: '#f9f9f9',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopColor: '#f0f0f0',
    borderTopWidth: 1,
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

export default ShareMomentDrawer;
