import { HOMEPAGE } from 'constants';

import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { Image, ImageProps, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-animatable';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import { ButtonWithGradientBackground } from '../buttonWithGradientBackground';
import ProgressLiner from '../progressLiner';
import styles from './styles';

export enum Types {
  CHALLENGE,
  TAGS,
}
interface TaggsBlockProps {
  title?: string;
  type?: Types;
  subTitle?: string;
  tagsData?: {
    img?: ImageProps;
    title?: string;
    completed?: number;
    quantity?: number;
    info?: string;
  }[];
  subTitleBadge?: React.ReactNode;
  onPressStreak?: () => void;
  onPressBlock?: () => void;
}

export const TaggsBlock: React.FC<TaggsBlockProps> = ({
  title,
  subTitle,
  type = Types.TAGS,
  tagsData,
  subTitleBadge,
  onPressStreak,
  onPressBlock,
}) => {
  const navigation = useNavigation();
  const renderTagsData = () =>
    tagsData?.map(tag => (
      <View style={styles.taggItemTagg}>
        <View style={styles.coverContainer}>
          {tag.img && <Image source={tag.img} style={styles.tagItemBg} />}
        </View>
        <View style={[styles.titleButtonContainerTagg]}>
          <View>
            <Text style={styles.taggTitle}>{tag.title}</Text>
            <Text style={styles.taggInfoTag}>{tag.info}</Text>
          </View>
          <ButtonWithGradientBackground
            onPress={() => {
              navigation.navigate('AddTagg', { data: tag, screenType: HOMEPAGE });
            }}
          />
        </View>
      </View>
    ));
  const renderChallengeData = () =>
    tagsData?.map(tag => (
      <TouchableOpacity style={[styles.taggItem]} onPress={() => onPressBlock && onPressBlock()}>
        <View style={styles.coverContainer}>
          {tag.img && <Image source={tag.img} style={styles.tagItemBg} />}
        </View>
        <View style={styles.titleButtonContainer}>
          <View style={styles.rightBlockContainer}>
            <Text style={styles.taggTitle}>{tag.title}</Text>
            <View style={styles.linearWrapper}>
              <ProgressLiner completed={tag.completed || 0} quantity={tag.quantity || 0} />
            </View>
            <View style={styles.rightBottomBlock}>
              {tag.completed === tag.quantity ? (
                <SvgXml
                  xml={icons.CheckmarkGreen}
                  width={13}
                  height={13}
                  style={styles.checkIcon}
                />
              ) : null}
              <Text
                style={[tag.completed === tag.quantity ? styles.completeText : styles.taggInfo]}>
                {tag.completed === tag.quantity ? 'Complete' : `${tag.completed}/${tag.quantity}`}
              </Text>
            </View>
            {/*<Text style={styles.taggInfo}>{tag.info}</Text>*/}
          </View>
          {/*<GradientBorderButton*/}
          {/*  text={'Add'}*/}
          {/*  darkStyle*/}
          {/*  onPress={() => {}}*/}
          {/*  withBackground*/}
          {/*/>*/}

          {/*<ButtonWithGradientBackground*/}
          {/*  onPress={() => navigate('LinkTags')}*/}
          {/*/>*/}
        </View>
      </TouchableOpacity>
    ));
  return (
    <View style={styles.taggsBlock}>
      <Text style={styles.taggsTitle}>{title}</Text>
      <View style={styles.taggsSubTitleWrapper}>
        <Text style={styles.taggsSubTitle}>{subTitle}</Text>
        <TouchableOpacity onPress={() => onPressStreak && onPressStreak()}>
          {subTitleBadge && subTitleBadge}
        </TouchableOpacity>
      </View>
      {type === Types.TAGS && renderTagsData()}
      {type === Types.CHALLENGE && renderChallengeData()}
    </View>
  );
};
