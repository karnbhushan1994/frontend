import React from 'react';

import { Text, Image, TouchableOpacity } from 'react-native';

import { styles } from './styles';

interface InterestListProps {
  interests: string[];
  interestIcons: NodeRequire[];
  selectedInterests: string[];
  enableMaximizeButton: boolean;
  showMinimize: boolean;
  minimizeLabel: string;
  startIndex: number;
  lastIndex: number;
  onChange: (vlaue: string) => void;
  onMinimize: (vlaue: boolean) => void;
}

const InterestList: React.FC<InterestListProps> = ({
  interests,
  selectedInterests,
  interestIcons,
  enableMaximizeButton,
  showMinimize,
  startIndex,
  lastIndex,
  minimizeLabel,
  onChange,
  onMinimize,
}: InterestListProps): React.ReactElement => (
  <>
    {interests.slice(startIndex, lastIndex).map((interest: string, index: number) => (
      <TouchableOpacity
        onPress={() => onChange(interest)}
        style={[
          styles.interestContainer,
          selectedInterests.includes(interest) && styles.selectedInterest,
        ]}>
        <Image source={interestIcons[index]} />
        <Text style={[styles.text, selectedInterests.includes(interest) && styles.selectedText]}>
          {interest}
        </Text>
      </TouchableOpacity>
    ))}
    {enableMaximizeButton && (
      <TouchableOpacity
        onPress={() => onMinimize(!showMinimize)}
        style={[styles.interestContainer, styles.selectedInterest]}>
        <Text style={[styles.text, styles.selectedText]}>{minimizeLabel}</Text>
      </TouchableOpacity>
    )}
  </>
);

export default InterestList;
