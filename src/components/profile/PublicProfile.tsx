import React, { useCallback, useEffect, useState } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';

import { deleteUserMomentsForCategory, updateMomentCategories } from 'store/actions';
import { EMPTY_MOMENTS_LIST, NO_PROFILE } from 'store/initialStates';
import { AnalyticCategory, AnalyticVerb, ContentProps, MomentType } from 'types';
import { moveCategory, normalize, SCREEN_HEIGHT, track } from 'utils';

import { TAGG_LIGHT_BLUE } from '../../constants';
import {
  UPLOAD_MOMENT_PROMPT_THREE_HEADER,
  UPLOAD_MOMENT_PROMPT_THREE_MESSAGE,
  UPLOAD_MOMENT_PROMPT_TWO_HEADER,
  UPLOAD_MOMENT_PROMPT_TWO_MESSAGE,
} from '../../constants/strings';

import { RootState } from '../../store/rootReducer';
import { TaggPrompt } from '../common';
import { Moment } from '../moments';

const PublicProfile: React.FC<ContentProps> = ({
  userXId,
  screenType,
  setScrollEnabled,
  profileBodyHeight,
  socialsBarHeight,
  scrollViewRef,
}) => {
  const dispatch = useDispatch();

  const { profile = NO_PROFILE } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.user,
  );

  const { moments = EMPTY_MOMENTS_LIST } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId] ? state.userX[screenType][userXId] : state.moments,
  );

  const { momentCategories = [] } = useSelector((state: RootState) =>
    userXId && state.userX[screenType][userXId]
      ? state.userX[screenType][userXId]
      : state.momentCategories,
  );

  const navigation = useNavigation();

  /**
   * States
   */
  const [imagesMap, setImagesMap] = useState<Map<string, MomentType[]>>(new Map());

  const [isStageTwoPromptClosed, setIsStageTwoPromptClosed] = useState(false);
  const [isStageOnePromptClosed, setIsStageOnePromptClosed] = useState(false);
  const [isStageThreePromptClosed, setIsStageThreePromptClosed] = useState(false);

  const move = (direction: 'up' | 'down', title: string) => {
    track('MoveMomentCategory', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
      direction,
      title,
    });
    let categories = [...momentCategories];
    categories = moveCategory(categories, title, direction === 'up');
    dispatch(updateMomentCategories(categories));
  };

  /**
   * Prompt user to perform an activity based on their profile completion stage
   * To fire 2 seconds after the screen comes in focus
   * 1 means STAGE_1:
   *    The user must upload a moment, so take them to a screen  guiding them to post a moment
   * 2 means STAGE_2:
   *    The user must create another category so show a prompt on top of the screen
   * 3 means STAGE_3:
   *    The user must upload a moment to the second category, so show a prompt on top of the screen
   * Else, profile is complete and no prompt needs to be shown
   */
  useFocusEffect(
    useCallback(() => {
      const navigateToMomentUploadPrompt = () => {
        switch (profile.profile_completion_stage) {
          case 1:
            if (
              momentCategories &&
              momentCategories[0] &&
              !isStageOnePromptClosed &&
              scrollViewRef.current
            ) {
              setScrollEnabled(false);
              if (scrollViewRef && scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0 });
              }
              navigation.navigate('MomentUploadPrompt', {
                screenType,
                momentCategory: momentCategories[0],
                profileBodyHeight,
                socialsBarHeight,
              });
              setIsStageOnePromptClosed(true);
            }
            break;
          case 2:
            setIsStageTwoPromptClosed(false);
            break;
          case 3:
            setIsStageThreePromptClosed(false);
            break;
          default:
            break;
        }
      };
      if (!userXId) {
        setTimeout(() => {
          navigateToMomentUploadPrompt();
          setScrollEnabled(true);
        }, 2000);
      }
    }, [
      userXId,
      profile.profile_completion_stage,
      momentCategories,
      isStageOnePromptClosed,
      setScrollEnabled,
      navigation,
      screenType,
      profileBodyHeight,
      socialsBarHeight,
      scrollViewRef,
    ]),
  );

  /**
   * Handle deletion of a category
   * Confirm with user before deleting the category
   * @param category category to be deleted
   */
  const handleCategoryDeletion = (category: string) => {
    track('MomentCategoryDelete', AnalyticVerb.Pressed, AnalyticCategory.Moment, {
      category,
    });
    Alert.alert(
      'Category Deletion',
      `Are you sure that you want to delete the category ${category} ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            track('DeleteMomentCategory', AnalyticVerb.Finished, AnalyticCategory.Moment, {
              category,
            });
            dispatch(updateMomentCategories(momentCategories.filter(mc => mc !== category)));
            dispatch(deleteUserMomentsForCategory(category));
          },
        },
      ],
      { cancelable: true },
    );
  };

  const createImagesMap = useCallback(() => {
    let map = new Map();
    moments.forEach(imageObject => {
      let moment_category = imageObject.moment_category;
      if (map.has(moment_category)) {
        map.get(moment_category).push(imageObject);
      } else {
        map.set(moment_category, [imageObject]);
      }
    });
    setImagesMap(map);
  }, [moments]);

  useEffect(() => {
    createImagesMap();
  }, [createImagesMap]);

  return (
    <View style={styles.momentsContainer}>
      {userXId && moments.length === 0 && (
        <View style={styles.plusIconContainer}>
          <SvgXml xml={icons.GreyPlusLogo} width={90} height={90} />
          <Text style={styles.noMomentsText}>{`Looks like ${
            profile.name.split(' ')[0]
          } has not posted any moments yet`}</Text>
        </View>
      )}
      {!userXId && profile.profile_completion_stage === 2 && !isStageTwoPromptClosed && (
        <TaggPrompt
          messageHeader={UPLOAD_MOMENT_PROMPT_TWO_HEADER}
          messageBody={UPLOAD_MOMENT_PROMPT_TWO_MESSAGE}
          logoType="tagg"
          onClose={() => {
            setIsStageTwoPromptClosed(true);
          }}
        />
      )}
      {!userXId && profile.profile_completion_stage === 3 && !isStageThreePromptClosed && (
        <TaggPrompt
          messageHeader={UPLOAD_MOMENT_PROMPT_THREE_HEADER}
          messageBody={UPLOAD_MOMENT_PROMPT_THREE_MESSAGE}
          logoType="tagg"
          onClose={() => {
            setIsStageThreePromptClosed(true);
          }}
        />
      )}
      {momentCategories.map(
        (title, index) =>
          (!userXId || imagesMap.get(title)) && (
            <Moment
              key={index}
              title={title}
              images={imagesMap.get(title)}
              userXId={userXId}
              screenType={screenType}
              handleMomentCategoryDelete={handleCategoryDeletion}
              shouldAllowDeletion={momentCategories.length > 1}
              showUpButton={index !== 0}
              showDownButton={index !== momentCategories.length - 1}
              move={move}
            />
          ),
      )}
      {!userXId && (
        <TouchableOpacity
          onPress={() => {
            track('CreateNewCategory', AnalyticVerb.Pressed, AnalyticCategory.Moment);
            navigation.navigate('CategorySelection', {
              newCustomCategory: undefined,
            });
          }}
          style={styles.createCategoryButton}>
          <Text style={styles.createCategoryButtonLabel}>Create a new category</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  momentsContainer: {
    backgroundColor: '#f2f2f2',
    paddingBottom: SCREEN_HEIGHT * 0.15,
    flex: 1,
    flexDirection: 'column',
  },
  createCategoryButton: {
    backgroundColor: TAGG_LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: 30,
    marginTop: '15%',
    alignSelf: 'center',
  },
  createCategoryButtonLabel: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: 'white',
  },
  plusIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '10%',
  },
  noMomentsText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: 'gray',
    marginVertical: '8%',
  },
});

export default PublicProfile;
