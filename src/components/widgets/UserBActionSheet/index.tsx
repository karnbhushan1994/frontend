import { TaggAlertTextList, TaggToastTextList } from 'constants';

import React, { FC, useContext, useRef, useState } from 'react';

import { Appearance, StyleSheet, TouchableOpacity } from 'react-native';
import AS from 'react-native-actionsheet';
import { SvgXml } from 'react-native-svg';

import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector, useStore } from 'react-redux';

import threeDots from 'assets/icons/three-dots.svg';

import { TaggAlert } from 'components';
import { TaggToast } from 'components/toasts';
import { ProfileContext } from 'screens/profile/ProfileScreen';
import { blockUnblockUser } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb } from 'types';
import { TaggToastType } from 'types/types';
import { isIPhoneX, track } from 'utils';

import ShareProfileDrawer from '../ShareProfileDrawer';

type Props = {};

export const UserBActionSheet: FC<Props> = ({ userXUsername, templateNumber }) => {
  const { userXId, is_blocked } = useContext(ProfileContext);
  const { userId } = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const state: RootState = useStore().getState();
  const [showBlockUserAlert, setShowBlockUserAlert] = useState<boolean>(false);

  // Test
  const actionSheetRef = useRef<AS>(null);
  const [tintColor, setTintColor] = useState(
    Appearance.getColorScheme() === 'dark' ? 'white' : '#333333',
  );
  const [shareProfile, setShareProfile] = useState<boolean>(false);

  const options = ['Share Profile', is_blocked ? 'Unblock User' : 'Block User', 'Cancel'];
  let options_indices: { [option: string]: number } = {};
  for (let i = 0; i < options.length; i++) {
    options_indices[options[i]] = i;
  }

  let styleToUse;
  switch (templateNumber) {
    case 'one':
      styleToUse = styles.tempOne;
      break;
    case 'two':
      styleToUse = styles.tempOne;
      break;
    case 'three':
      styleToUse = styles.tempThree;
      break;
    case 'four':
      styleToUse = styles.tempFour;
      break;
    case 'five':
      styleToUse = styles.tempFive;
  }

  const showActionSheet = async () => {
    await setTintColor(Appearance.getColorScheme() === 'dark' ? 'white' : '#333333');
    //track('Fab', AnalyticVerb.Pressed, AnalyticCategory.Profile);
    actionSheetRef.current?.show();
  };

  const handleBlockUnblock = async (isBoolean: boolean) => {
    if (userXId) {
      const success = await blockUnblockUser(userId, userXId, is_blocked, state, dispatch);
      if (success) {
        TaggToast(
          toast,
          isBoolean ? TaggToastType.Success : TaggToastType.Error,
          isBoolean ? TaggToastTextList.PROFILE_UNBLOCLKED : TaggToastTextList.PROFILE_BLOCKED,
        );
      }
    }
  };
  return (
    <>
      <TouchableOpacity style={styleToUse} onPress={showActionSheet}>
        <SvgXml xml={threeDots} />
      </TouchableOpacity>
      <AS
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={options_indices.Cancel}
        tintColor={tintColor}
        onPress={async index => {
          switch (index) {
            case options_indices['Share Profile']:
              track('UserBContainerShareProfile', AnalyticVerb.Pressed, AnalyticCategory.Profile);
              setShareProfile(true);
              break;
            case options_indices['Block User']:
              track('UserBContainerBlockUser', AnalyticVerb.Pressed, AnalyticCategory.Profile);
              setShowBlockUserAlert(true);
              break;
            case options_indices['Unblock User']:
              if (is_blocked) {
                track('UserBContainerUnblockUser', AnalyticVerb.Pressed, AnalyticCategory.Profile);
                handleBlockUnblock(is_blocked);
              }
          }
        }}
      />
      <TaggAlert
        alertVisible={showBlockUserAlert}
        setAlertVisible={setShowBlockUserAlert}
        title={TaggAlertTextList.BLOCK_USER.title}
        subheading={TaggAlertTextList.BLOCK_USER.subheading}
        acceptButtonText={TaggAlertTextList.BLOCK_USER.acceptButtonText}
        handleAccept={async () => {
          if (!is_blocked) {
            track('BlockUser', AnalyticVerb.Finished, AnalyticCategory.EditAPage);
            handleBlockUnblock(is_blocked);
          }

          // Hide block user alert
          setShowBlockUserAlert(false);
        }}
      />
      <ShareProfileDrawer
        isOpen={shareProfile}
        setIsOpen={setShareProfile}
        username={userXUsername}
      />
    </>
  );
};

const styles = StyleSheet.create({
  tempOne: {
    top: isIPhoneX() ? '25%' : '20%',
    right: '5%',
    position: 'absolute',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  tempThree: {
    top: isIPhoneX() ? '16.75%' : '13%',
    right: '5%',
    position: 'absolute',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  tempFour: {
    top: '-5%',
    right: '6%',
    position: 'absolute',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  tempFive: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
});
