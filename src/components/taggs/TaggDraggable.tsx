import React, { RefObject } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import Avatar from 'components/common/Avatar';
import { RootState } from 'store/rootReducer';
import { ProfilePreviewType, ScreenType, UserType } from 'types';
import { normalize } from 'utils';
import { navigateToProfile } from 'utils/users';

interface TaggDraggableProps extends ViewProps {
  draggableRef: RefObject<View>;
  taggedUser: ProfilePreviewType;
  editingView: boolean;
  deleteFromList: () => void;
}

const TaggDraggable: React.FC<TaggDraggableProps> = (props: TaggDraggableProps) => {
  const { draggableRef, taggedUser, editingView, deleteFromList } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useSelector((rs: RootState) => rs);
  let uriX = images.main.draggableX;
  let uriTip = images.main.tagg_triangle;

  const user: UserType = {
    userId: taggedUser.id,
    username: taggedUser.username,
  };

  return (
    <TouchableWithoutFeedback>
      <View ref={draggableRef}>
        <TouchableOpacity
          style={styles.container}
          disabled={editingView}
          onPress={() => navigateToProfile(state, dispatch, navigation, ScreenType.Profile, user)}>
          <Image style={styles.imageTip} source={uriTip} />
          <View style={styles.content}>
            <Avatar style={styles.avatar} uri={taggedUser.thumbnail_url} />
            <Text style={editingView ? styles.buttonTitle : styles.buttonTitleX}>
              @{taggedUser.username}
            </Text>
            {editingView && (
              <TouchableOpacity onPress={deleteFromList} style={styles.imageX}>
                <Image style={styles.imageX} source={uriX} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageTip: {
    height: 12,
    aspectRatio: 12 / 8,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: normalize(11),
    fontWeight: '700',
    lineHeight: normalize(13.13),
    letterSpacing: normalize(0.6),
    paddingHorizontal: '1%',
  },
  buttonTitleX: {
    color: 'white',
    fontSize: normalize(11),
    fontWeight: '700',
    lineHeight: normalize(13.13),
    letterSpacing: normalize(0.6),
    paddingHorizontal: '1%',
  },
  avatar: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(20) / 2,
  },
  imageX: {
    width: normalize(15),
    height: normalize(15),
  },
  content: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(8),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default TaggDraggable;
