import React from 'react';

import { StyleProp, Text, TextStyle } from 'react-native';
import { isMentionPartType, parseValue, Part, PartType } from 'react-native-controlled-mentions';
import { TouchableOpacity } from 'react-native-gesture-handler';

import TaggTypeahead from '../components/common/TaggTypeahead';
import { TAGG_LIGHT_BLUE } from '../constants';
import { UserType } from '../types';
import { normalize } from './layouts';

/**
 * Part renderer
 *
 * https://github.com/dabakovich/react-native-controlled-mentions#rendering-mentioninputs-value
 */
const renderPart = (part: Part, index: number, handlePress: (user: UserType) => void) => {
  // Just plain text
  if (!part.partType) {
    return <Text key={index}>{part.text}</Text>;
  }

  // Mention type part
  if (isMentionPartType(part.partType)) {
    return (
      <TouchableOpacity
        key={`${index}-${part.data?.trigger}`}
        onPress={() => {
          if (part.data) {
            handlePress({
              userId: part.data.id,
              username: part.data.name,
            });
          }
        }}>
        <Text style={part.partType.textStyle}>{part.text}</Text>
      </TouchableOpacity>
    );
  }

  // Other styled part types
  return (
    <Text key={`${index}-pattern`} style={part.partType.textStyle}>
      {part.text}
    </Text>
  );
};

interface RenderProps {
  value: string;
  styles: StyleProp<TextStyle>;
  partTypes: PartType[];
  onPress: (user: UserType) => void;
}

/**
 * Value renderer. Parsing value to parts array and then mapping the array using 'renderPart'
 *
 * https://github.com/dabakovich/react-native-controlled-mentions#rendering-mentioninputs-value
 */
export const renderTextWithMentions: React.FC<RenderProps> = ({
  value,
  styles,
  partTypes,
  onPress,
}) => {
  const { parts } = parseValue(value, partTypes);
  return <Text style={styles}>{parts.map((part, index) => renderPart(part, index, onPress))}</Text>;
};

export const mentionPartTypes: (
  theme: 'blue' | 'white',
  component: 'caption' | 'comment',
  isShowBelowStyle?: boolean,
) => PartType[] = (theme, component, isShowBelowStyle = false) => [
  {
    trigger: '@',
    renderSuggestions: props => (
      <TaggTypeahead component={component} isShowBelowStyle={isShowBelowStyle} {...props} />
    ),
    allowedSpacesCount: 0,
    isInsertSpaceAfterMention: true,
    textStyle: _textStyle(theme),
  },
];

const _textStyle: (theme: 'blue' | 'white') => StyleProp<TextStyle> = theme => {
  switch (theme) {
    case 'blue':
      return {
        color: TAGG_LIGHT_BLUE,
        top: normalize(3),
      };
    case 'white':
    default:
      return {
        color: 'white',
        fontWeight: '800',
        top: normalize(3),
      };
  }
};
