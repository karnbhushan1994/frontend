import React, { FC, ReactFragment } from 'react';

import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { MentionPartType, Part, PartType } from 'react-native-controlled-mentions/dist/types';
import {
  defaultMentionTextStyle,
  isMentionPartType,
} from 'react-native-controlled-mentions/dist/utils';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { RootState } from 'store/rootReducer';
import { TemplateEnumType } from 'types';
import { normalize } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';

import { Avatar } from '../common';

type CommentTextFieldProps = {
  containerStyle: StyleProp<ViewStyle>;
  validateInput: any;
  keyboardText: string;
  partTypes: PartType[];
  renderMentionSuggestions: (mentionType: MentionPartType) => ReactFragment;
  handleTextInputRef: (ref: TextInput) => null;
  onChangeInput: (changedText: string) => null;
  handleSelectionChange: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => null;
  parts: Part[];
  addComment: () => any;
  comment?: string;
};

const CommentTextField: FC<CommentTextFieldProps> = ({
  containerStyle,
  validateInput,
  keyboardText,
  partTypes,
  renderMentionSuggestions,
  handleTextInputRef,
  onChangeInput,
  handleSelectionChange,
  parts,
  addComment,
  comment = '',
  ...textInputProps
}) => {
  const {
    avatar,
    cover,
    profileTemplate: {
      skin: { template_type },
    },
  } = useSelector((state: RootState) => state.user);

  const userAvatar = () => {
    switch (template_type) {
      case TemplateEnumType.Three:
        return cover;
      default:
        return avatar;
    }
  };

  return (
    <View style={containerStyle}>
      {validateInput(keyboardText)
        ? (
            partTypes.filter(
              one =>
                isMentionPartType(one) &&
                one.renderSuggestions != null &&
                !one.isBottomMentionSuggestionsRender,
            ) as MentionPartType[]
          ).map(renderMentionSuggestions)
        : null}

      <View style={styles.containerStyle}>
        <Avatar style={styles.avatar} uri={userAvatar()} userIcon={true} />
        <TextInput
          multiline
          {...textInputProps}
          ref={handleTextInputRef}
          onChangeText={onChangeInput}
          onSelectionChange={handleSelectionChange}
          style={styles.text}>
          <Text>
            {parts.map(({ text, partType, data }, index) =>
              partType ? (
                <Text
                  key={`${index}-${data?.trigger ?? 'pattern'}`}
                  style={partType.textStyle ?? defaultMentionTextStyle}>
                  {text}
                </Text>
              ) : (
                <Text key={index}>{text}</Text>
              ),
            )}
          </Text>
        </TextInput>
        <TouchableOpacity
          style={comment === '' ? [styles.submitButton, styles.greyButton] : styles.submitButton}
          disabled={comment === ''}
          onPress={addComment}>
          <SvgXml xml={icons.UpArrow} width={35} height={35} color={'white'} />
        </TouchableOpacity>
      </View>
      {validateInput(keyboardText) &&
        (
          partTypes.filter(
            one =>
              isMentionPartType(one) &&
              one.renderSuggestions != null &&
              one.isBottomMentionSuggestionsRender,
          ) as MentionPartType[]
        ).map(renderMentionSuggestions)}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: '3%',
    marginVertical: '2%',
  },
  containerStyle: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(45),
  },
  greyButton: {
    backgroundColor: 'grey',
  },
  submitButton: {
    height: 35,
    width: 35,
    backgroundColor: TAGG_LIGHT_BLUE,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
    marginVertical: '2%',
    alignSelf: 'flex-end',
  },
  text: { flex: 1 },
});

export { CommentTextField };
