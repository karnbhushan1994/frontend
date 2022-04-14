import React from 'react';

import { StyleSheet, View } from 'react-native';
import { useStore } from 'react-redux';
import {
  AutoCompleteInput,
  MessageInputProps,
  useMessageInputContext,
} from 'stream-chat-react-native';

import { Avatar } from 'components/common';
import { RootState } from 'store/rootReducer';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
} from 'types';
import { normalize } from 'utils';

import { ChatInputSubmit } from '../messages';

const ChatInput: React.FC<
  MessageInputProps<
    LocalAttachmentType,
    LocalChannelType,
    LocalCommandType,
    LocalEventType,
    LocalMessageType,
    LocalReactionType,
    LocalUserType
  >
> = () => {
  const state: RootState = useStore().getState();
  const avatar = state.user.avatar;
  const { sendMessage, text } = useMessageInputContext();
  // const {
  //   setSelectedImages,
  //   selectedImages,
  //   openPicker,
  // } = useAttachmentPickerContext();

  // const selectImage = () => {
  //   ImagePicker.openPicker({
  //     cropping: true,
  //     freeStyleCropEnabled: true,
  //     mediaType: 'photo',
  //     multiple: true,
  //     // includeBase64: true,
  //   })
  //     .then((pictures) => {
  //       pictures.map((pic) =>
  //         uploadNewImage({
  //           width: pic.width,
  //           height: pic.height,
  //           source: 'picker',
  //           uri: 'ph://' + pic.localIdentifier,
  //         }),
  //       );
  //     })
  //     .catch((error) => {
  //       logger.log(error);
  //     });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Avatar style={styles.avatar} uri={avatar} />
        <AutoCompleteInput />
        <View style={styles.actionButtons}>
          {/* TODO: Not working, toggled off for now */}
          {/* <TouchableOpacity onPress={openPicker}> */}
          {/* <TouchableOpacity onPress={selectImage}>
            <Image
              style={{width: normalize(23), height: normalize(23)}}
              source={require('assets/images/camera.png')}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => setText('/')}>
            <Image
              style={{width: normalize(23), height: normalize(23)}}
              source={require('assets/images/gif.png')}
            />
          </TouchableOpacity> */}
          <ChatInputSubmit onPress={sendMessage} outlined={text.length === 0} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    top: -10,
  },
  textContainer: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '3%',
    borderRadius: 25,
  },
  text: {
    flex: 1,
    padding: '1%',
    marginHorizontal: '1%',
  },
  avatar: {
    height: normalize(30),
    width: normalize(30),
    borderRadius: 30,
    marginRight: 10,
    marginLeft: '3%',
    marginVertical: 5,
    alignSelf: 'flex-end',
  },
  whiteBackround: {
    backgroundColor: '#fff',
  },
  actionButtons: {
    height: normalize(30) + 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
    width: 50,
    alignSelf: 'flex-end',
  },
});

export default ChatInput;
