import React, { useEffect, useState } from 'react';

import { RouteProp, useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Friends } from 'components';

import { MainStackParams } from 'routes/main';
import { getUsersReactedToAComment } from 'services';
import { ProfilePreviewType } from 'types';
import { HeaderHeight, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { ERROR_SOMETHING_WENT_WRONG } from '../../constants/strings';

type CommentReactionScreenRouteProps = RouteProp<MainStackParams, 'CommentReactionScreen'>;

interface CommentReactionScreenProps {
  route: CommentReactionScreenRouteProps;
}

const CommentReactionScreen: React.FC<CommentReactionScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { comment, screenType } = route.params;
  const [users, setUsers] = useState<ProfilePreviewType[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await getUsersReactedToAComment(comment);
      if (response.length !== 0) {
        setUsers(response);
      } else {
        Alert.alert(ERROR_SOMETHING_WENT_WRONG);
        navigation.goBack();
      }
    };
    loadUsers();
  }, []);

  return (
    <View style={styles.background}>
      <SafeAreaView>
        <ScrollView style={styles.container}>
          <Friends result={users} screenType={screenType} userId={undefined} hideFriendsFeature />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  container: {
    marginTop: HeaderHeight,
    height: SCREEN_HEIGHT - HeaderHeight,
  },
});

export default CommentReactionScreen;
