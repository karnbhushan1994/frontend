import React, { useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { AvatarTitle, SocialMediaInfo, TabsGradient, TaggPost, TwitterTaggPost } from 'components';
import TaggLoadingIndicator from 'components/common/TaggLoadingIndicator';
import { MainStackParams } from 'routes';
import { RootState } from 'store/rootReducer';
import { SimplePostType, SocialAccountType, TwitterPostType } from 'types';
import { AvatarHeaderHeight, SCREEN_HEIGHT } from 'utils';

import { AVATAR_GRADIENT } from '../../constants';

type SocialMediaTaggsRouteProp = RouteProp<MainStackParams, 'SocialMediaTaggs'>;

type SocialMediaTaggsNavigationProp = StackNavigationProp<MainStackParams, 'SocialMediaTaggs'>;

interface SocialMediaTaggsProps {
  route: SocialMediaTaggsRouteProp;
  navigation: SocialMediaTaggsNavigationProp;
}

const SocialMediaTaggs: React.FC<SocialMediaTaggsProps> = ({ route, navigation }) => {
  const [accountData, setAccountData] = useState<SocialAccountType>({
    posts: [],
  });
  const { socialMediaType, userXId, screenType } = route.params;
  const {
    avatar,
    profile: { name },
  } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const { socialAccounts } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId]
      : state.socialAccounts,
  );

  useEffect(() => {
    const currentSocialData = { ...socialAccounts[socialMediaType] };
    if (currentSocialData) {
      setAccountData(currentSocialData);
    }
  }, [socialAccounts, setAccountData]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <AvatarTitle avatar={avatar} />,
    });
  }, [avatar, navigation]);

  return (
    <LinearGradient
      useAngle={true}
      angle={148}
      style={styles.flex}
      colors={[AVATAR_GRADIENT.start, AVATAR_GRADIENT.end]}>
      <StatusBar barStyle={'light-content'} />
      {/* Cropping the scroll view to mimic the presence of a header while preserving the gradient background */}

      {accountData?.posts && accountData.posts.length > 0 ? (
        <View
          // we want a slightly bigger header here for the avatar image
          style={[styles.flex, { marginTop: AvatarHeaderHeight }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            <SocialMediaInfo fullname={name} type={socialMediaType} handle={accountData?.handle} />
            {(accountData?.posts as Array<SimplePostType | TwitterPostType>).map((post, index) =>
              socialMediaType === 'Twitter' ? (
                <TwitterTaggPost
                  key={index}
                  ownerHandle={accountData?.handle || '_'}
                  post={post as TwitterPostType}
                />
              ) : (
                <TaggPost key={index} post={post as SimplePostType} social={socialMediaType} />
              ),
            )}
          </ScrollView>
          <TabsGradient />
        </View>
      ) : (
        <TaggLoadingIndicator />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: SCREEN_HEIGHT / 15,
  },
  flex: {
    flex: 1,
  },
});

export default SocialMediaTaggs;
