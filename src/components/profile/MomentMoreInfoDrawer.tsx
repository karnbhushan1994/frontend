import { TaggAlertTextList } from 'constants';

import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import { Alert, GestureResponderEvent, TextStyle, ViewProps } from 'react-native';

import { deleteMoment, sendReport } from 'services';
import { MomentTagType, MomentType, ScreenType } from 'types/types';

import { ERROR_DELETE_MOMENT, MOMENT_DELETED_MSG } from '../../constants/strings';

import { GenericMoreInfoDrawer, TaggAlert } from '../common';

enum MomentDrawerOptions {
  DeleteMoment = 'Delete Moment',
  ReportIssue = 'Report an Issue',
  RemoveTag = 'Remove yourself from moment',
  EditMoment = 'Edit Moment',
  EditPage = 'Edit Page',
}
interface MomentMoreInfoDrawerProps extends ViewProps {
  isOpen: boolean;
  setIsOpen: (visible: boolean) => void;
  isOwnProfile: boolean;
  isDiscoverMomentPost: boolean;
  momentTagId?: string;
  removeTag?: () => Promise<void>;
  dismissScreenAndUpdate?: () => void;
  screenType: ScreenType;
  moment?: MomentType;
  tags?: MomentTagType[];
  title?: string;
}

type DrawerButtonType = [
  string,
  (event: GestureResponderEvent) => void,
  JSX.Element?,
  TextStyle?,
][];

const MomentMoreInfoDrawer: React.FC<MomentMoreInfoDrawerProps> = props => {
  const {
    setIsOpen,
    isOwnProfile,
    dismissScreenAndUpdate,
    momentTagId,
    removeTag,
    screenType,
    moment,
    tags,
    title,
    isDiscoverMomentPost,
  } = props;

  const navigation = useNavigation();

  const [drawerButtons, setDrawerButtons] = useState<DrawerButtonType>([]);
  const [showDeleteMomentAlert, setShowDeleteMomentAlert] = useState(false);

  const handleDeleteMoment = async () => {
    setIsOpen(false);
    setShowDeleteMomentAlert(false);
    if (!moment || !dismissScreenAndUpdate) {
      return;
    }
    deleteMoment(moment.moment_id).then(success => {
      if (success) {
        // set time out for UI transitions
        setTimeout(() => {
          Alert.alert(MOMENT_DELETED_MSG, '', [
            {
              text: 'OK',
              onPress: () => dismissScreenAndUpdate(),
              style: 'cancel',
            },
          ]);
        }, 500);
      } else {
        setTimeout(() => {
          Alert.alert(ERROR_DELETE_MOMENT);
        }, 500);
      }
    });
  };

  const handleRemoveTag = async () => {
    setIsOpen(false);
    setTimeout(() => {
      Alert.alert(
        MomentDrawerOptions.RemoveTag,
        'Are you sure you want to be removed from this moment?',
        [
          {
            text: 'Remove',
            onPress: removeTag,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }, 500);
  };

  const handleReportMoment = async () => {
    setIsOpen(false);
    if (!moment) {
      return;
    }
    setTimeout(() => {
      Alert.alert(
        'Report Issue',
        undefined,
        [
          {
            text: 'Mark as inappropriate',
            onPress: () => sendReport(moment.moment_id, 'Mark as inappropriate'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Mark as abusive',
            onPress: () => sendReport(moment.moment_id, 'Mark as abusive'),
          },
        ],
        { cancelable: false },
      );
    }, 500);
  };

  const handleEditMoment = async () => {
    setIsOpen(false);
    if (!moment) {
      return;
    }
    navigation.navigate('CaptionScreen', {
      screenType: screenType,
      selectedTags: tags,
      moment: moment,
      selectedCategory: moment.moment_category,
    });
  };

  const handleEditPage = async () => {
    setIsOpen(false);
    navigation.navigate('EditMomentsPage', {
      screenType: screenType,
      currentPageName: title ? title : moment ? moment.moment_category : '',
    });
  };

  /*
   *  Update bottom drawer options to contain/not contain 'remove tag' option
   */
  useEffect(() => {
    let newButtons: [string, (event: GestureResponderEvent) => void, JSX.Element?, TextStyle?][] =
      [];
    if (moment && !isOwnProfile) {
      newButtons.push([
        MomentDrawerOptions.ReportIssue,
        handleReportMoment,
        undefined,
        { color: 'red' },
      ]);
      // should we have the "delete moment" option?
      if (moment && momentTagId !== '') {
        newButtons.push([
          MomentDrawerOptions.RemoveTag,
          handleRemoveTag,
          undefined,
          { color: 'red' },
        ]);
      }
    } else {
      if (moment) {
        newButtons.push([
          MomentDrawerOptions.DeleteMoment,
          () => {
            setIsOpen(false);
            setShowDeleteMomentAlert(true);
          },
          undefined,
          { color: 'red' },
        ]);
        if (!isDiscoverMomentPost) {
          newButtons.push([MomentDrawerOptions.EditMoment, handleEditMoment]);
        }
      }
      if (!isDiscoverMomentPost) {
        newButtons.push([MomentDrawerOptions.EditPage, handleEditPage]);
      }
    }
    setDrawerButtons(newButtons);
  }, [tags, momentTagId]);

  if (showDeleteMomentAlert) {
    return (
      <TaggAlert
        alertVisible={showDeleteMomentAlert}
        setAlertVisible={setShowDeleteMomentAlert}
        title={TaggAlertTextList.DELETE_MOMENT.title}
        subheading={TaggAlertTextList.DELETE_MOMENT.subheading}
        acceptButtonText={TaggAlertTextList.DELETE_MOMENT.acceptButtonText}
        handleAccept={handleDeleteMoment}
      />
    );
  }
  return <GenericMoreInfoDrawer {...props} showIcons={false} buttons={drawerButtons} />;
};

export default MomentMoreInfoDrawer;
