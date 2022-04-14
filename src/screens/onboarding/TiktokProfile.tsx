import React, { useContext, useEffect, useState } from 'react';

import { StackNavigationProp } from '@react-navigation/stack';

import { getLinkPreview } from 'link-preview-js';

import { Alert, Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { createVideoLinkWidget } from 'services';

import { Images } from '../../assets';
import {
  ArrowButton,
  Background,
  CustomToolTip,
  TaggInput,
  TaggLoadingIndicator,
} from '../../components';
import {
  AUTOCAPITALIZE,
  ERROR_SOMETHING_WENT_WRONG,
  HOMEPAGE,
  KEYBOARD_VERTICLEHEIGHT,
  NAME,
  PLACEHOLDER_COLOR,
  RETURNKEY,
  SELECTIONCOLOR,
  TIKTOK,
  TIKTOk_SUBHEADER,
  TIKTOK_TITLE,
  TIK_TOK,
  WEBSITE_TOOLTIP,
} from '../../constants';
import { OnboardingContext, OnboardingStackParams } from '../../routes';
import { sendRegister } from '../../services';
import {
  AnalyticCategory,
  AnalyticVerb,
  BackgroundGradientType,
  VideoLinkWidgetLinkTypes,
} from '../../types';
import { SCREEN_HEIGHT, track } from '../../utils';
import { Behavior } from '../../utils/helper';
import { onBoardingStyles } from './Styles';

type TiktokProfileNavigationProps = StackNavigationProp<OnboardingStackParams, 'TiktokProfile'>;

interface TiktokProfileProps {
  navigation: TiktokProfileNavigationProps;
}

const TiktokProfile: React.FC<TiktokProfileProps> = ({
  navigation,
}: TiktokProfileProps): React.ReactElement => {
  const { firstName, lastName, phone, email, username, gender, age, isVip, setUserId, setToken } =
    useContext(OnboardingContext);
  const [attemptedSubmit] = useState<boolean>(false);
  const [valid] = useState<boolean>(false);
  const [tiktokLink, setTiktokLink] = useState<string>('');
  const [toolTip, setToolTip] = useState<boolean>(false);
  const [toolTipState, setToolTipState] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isValidName: boolean = TIK_TOK.test(tiktokLink);
    if (isValid) {
      if (isValidName === false) {
        setToolTip(true);
        setToolTipState(WEBSITE_TOOLTIP);
      } else {
        setToolTip(false);
      }
    }
    if (isValidName) {
      setIsValid(true);
    }
  }, [tiktokLink, isValid]);

  const registerUser = async () => {
    setLoading(true);
    if (firstName && lastName && phone && email && username && tiktokLink && gender && age) {
      const response = await sendRegister(
        firstName,
        lastName,
        phone,
        email,
        username,
        tiktokLink,
        gender,
        age,
      );

      if (response) {
        track('TiktokProfileStep', AnalyticVerb.Finished, AnalyticCategory.Onboarding, {
          isVip,
        });
        const { user_id, token } = response;
        setUserId(user_id);
        setToken(token);
        setLoading(false);
        if (isVip) {
          navigation.navigate('Interest');
        } else {
          track('OnboardingWaitlist', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
          navigation.navigate('Waitlist');
        }

        let appendedUrl = tiktokLink;
        let linkData = {
          images: [''],
          title: '',
        };
        if (
          appendedUrl.length > 5 &&
          !(appendedUrl.startsWith('https://') || appendedUrl.startsWith('http://'))
        ) {
          appendedUrl = 'https://' + appendedUrl;
        }
        try {
          linkData = await getLinkPreview(appendedUrl, {
            // imagesPropertyType: "og", // fetches only open-graph images
            headers: {
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
              // "Accept-Language": "en-US", // fetches site for English language
              // ...other optional HTTP request headers
            },
            timeout: 6000,
          }).then();

          const t = linkData.title?.slice(0, 32);

          await createVideoLinkWidget(
            {
              url: appendedUrl,
              order: 0,
              page: HOMEPAGE,
              link_type: VideoLinkWidgetLinkTypes.TIKTOK,
              font_color: 'white',
              border_color_start: null,
              border_color_end: null,
              title: t.length > 0 ? t : 'Title',
              thumbnail_url:
                !!linkData && !!linkData.images && !!linkData.images[0] ? linkData.images[0] : '',
              // background_url,
              owner: user_id,
            },
            token,
            // data.id,
          );
        } catch (e) {
          console.log(e);
          // Alert.alert('Error', JSON.stringify(e));
        }
      } else {
        track('TiktokProfileStep', AnalyticVerb.Failed, AnalyticCategory.Onboarding, {
          isVip,
        });
        setLoading(false);
        Alert.alert(ERROR_SOMETHING_WENT_WRONG);
      }
    } else {
      setLoading(false);
      Alert.alert(ERROR_SOMETHING_WENT_WRONG);
    }
  };

  const nextNavigate = (): void => {
    let isValidName: boolean = TIK_TOK.test(tiktokLink);
    if (!isValidName) {
      setIsValid(true);
      return;
    }
    registerUser();
  };

  return (
    <Background style={onBoardingStyles.container} gradientType={BackgroundGradientType.Light}>
      {loading && <TaggLoadingIndicator fullscreen />}
      <KeyboardAvoidingView
        behavior={Behavior(Platform.OS)}
        keyboardVerticalOffset={-(SCREEN_HEIGHT * KEYBOARD_VERTICLEHEIGHT)}
        style={onBoardingStyles.container}>
        <View style={onBoardingStyles.leftArrow}>
          <ArrowButton
            style={onBoardingStyles.backArrow}
            direction="backward"
            onboarding={true}
            onPress={() => {
              navigation.goBack();
              track('TiktokProfileStep', AnalyticVerb.Canceled, AnalyticCategory.Onboarding, {
                isVip,
              });
            }}
          />
        </View>
        <View style={onBoardingStyles.textView}>
          <Text style={onBoardingStyles.formHeader}>{TIKTOK}</Text>
          <Text style={onBoardingStyles.formSubHeader}>{TIKTOk_SUBHEADER}</Text>
        </View>

        <View style={onBoardingStyles.tiktokFormContainer}>
          <View style={onBoardingStyles.tiktokIcon}>
            <Image source={Images.SignUp.TiktokIcon} style={onBoardingStyles.logo} />
          </View>
          <TaggInput
            placeholder={TIKTOK_TITLE}
            autoCompleteType={NAME}
            autoCapitalize={AUTOCAPITALIZE}
            placeholderTextColor={PLACEHOLDER_COLOR}
            textContentType={NAME}
            returnKeyType={RETURNKEY}
            selectionColor={SELECTIONCOLOR}
            onChangeText={setTiktokLink}
            onSubmitEditing={nextNavigate}
            value={tiktokLink}
            autoFocus={true}
            blurOnSubmit={false}
            externalStyles={{
              warning: onBoardingStyles.passWarning,
            }}
            valid={valid}
            attemptedSubmit={attemptedSubmit}
            image={isValid ? (toolTip ? Images.SignUp.RedCross : Images.SignUp.GreenCheck) : null}
          />
          {toolTip && <CustomToolTip toolTipText={toolTipState} />}
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

export default TiktokProfile;
