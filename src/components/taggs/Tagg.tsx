import React, { Fragment, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';

import {
  getNonIntegratedURL,
  handlePressForAuthBrowser,
  registerNonIntegratedSocialLink,
} from 'services';
import { AnalyticCategory, AnalyticVerb, UserType } from 'types';
import { track } from 'utils';

import { INTEGRATED_SOCIAL_LIST, TAGG_RING_DIM } from '../../constants';
import { ERROR_LINK, ERROR_UNABLE_TO_FIND_PROFILE, SUCCESS_LINK } from '../../constants/strings';
import { SocialIcon, SocialLinkModal } from '../common';

interface TaggProps {
  social: string;
  isLinked: boolean;
  isIntegrated: boolean;
  setTaggsNeedUpdate: (_: boolean) => void;
  setSocialDataNeedUpdate: (social: string, username: string) => void;
  userXId: string | undefined;
  user: UserType;
}

const Tagg: React.FC<TaggProps> = ({
  social,
  isLinked,
  isIntegrated,
  setTaggsNeedUpdate,
  setSocialDataNeedUpdate,
  userXId,
  user,
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const youMayPass = isLinked || userXId;

  /*
  case isProfileView:
    case linked:
      show normal ring, navigate to taggs view
    case !linked:
      don't show tagg
  case !isProfileView:
    case linked:
      show normal ring, navigate to taggs view
    case !linked:
      show ring+, then...
        case integrated_social:
          show auth browser
        case !integrated_social:
          show modal
  Tagg's "Tagg" will use the Ring instead of PurpleRing
  */

  const modalOrAuthBrowserOrPass = async () => {
    if (youMayPass) {
      track('LinkedSocial', AnalyticVerb.Viewed, AnalyticCategory.Profile, {
        social,
      });
      if (INTEGRATED_SOCIAL_LIST.indexOf(social) !== -1) {
        navigation.navigate('SocialMediaTaggs', {
          socialMediaType: social,
          userXId,
        });
      } else {
        getNonIntegratedURL(social, user.userId).then(socialURL => {
          if (socialURL) {
            Linking.openURL(socialURL);
          } else {
            Alert.alert(ERROR_UNABLE_TO_FIND_PROFILE);
          }
        });
      }
    } else {
      track('LinkSocial', AnalyticVerb.Pressed, AnalyticCategory.Profile, {
        social,
      });
      if (isIntegrated) {
        handlePressForAuthBrowser(social).then(success => {
          setTaggsNeedUpdate(success);
          if (success) {
            track('LinkingAnIntegratedSocial', AnalyticVerb.Finished, AnalyticCategory.Profile, {
              social,
            });
            setSocialDataNeedUpdate(social, '');
          }
        });
      } else {
        setModalVisible(true);
      }
    }
  };

  const pickTheRightRingHere = () => {
    if (youMayPass) {
      if (social === 'Tagg') {
        return <SvgXml xml={icons.Ring} width={TAGG_RING_DIM} height={TAGG_RING_DIM} />;
      } else {
        return <SvgXml xml={icons.PurpleRing} width={TAGG_RING_DIM} height={TAGG_RING_DIM} />;
      }
    } else {
      if (social === 'Tagg') {
        return <SvgXml xml={icons.RingPlus} width={TAGG_RING_DIM} height={TAGG_RING_DIM} />;
      } else {
        return <SvgXml xml={icons.PurpleRingPlus} width={TAGG_RING_DIM} height={TAGG_RING_DIM} />;
      }
    }
  };

  const linkNonIntegratedSocial = async (username: string) => {
    if (await registerNonIntegratedSocialLink(social, username)) {
      track('LinkingANonIntegratedSocial', AnalyticVerb.Finished, AnalyticCategory.Profile, {
        social,
      });
      Alert.alert(SUCCESS_LINK(social));
      setTaggsNeedUpdate(true);
      setSocialDataNeedUpdate(social, username);
    } else {
      // If we display too fast the alert will get dismissed with the modal
      setTimeout(() => {
        Alert.alert(ERROR_LINK(social));
      }, 500);
    }
  };

  return (
    <>
      {userXId && !isLinked ? (
        <Fragment />
      ) : (
        <>
          <SocialLinkModal
            social={social}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            completionCallback={linkNonIntegratedSocial}
          />
          <View style={styles.container}>
            <TouchableOpacity style={styles.iconTap} onPress={modalOrAuthBrowserOrPass}>
              <SocialIcon style={styles.icon} social={social} whiteRing />
              {pickTheRightRingHere()}
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  iconTap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '77%',
    height: '77%',
    borderRadius: 30,
    position: 'absolute',
  },
});

export default Tagg;
