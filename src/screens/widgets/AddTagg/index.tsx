import React, { useEffect, useState } from 'react';

import { RouteProp } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
//import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import { images } from 'assets/images';
import { makeWidgetLogo } from 'components/profile/WidgetsPlayground';
import { makeAction } from 'makeAction';

import { MainStackParams } from 'routes';
import { ArticleLinkContent } from 'screens/widgets/AddTagg/components/content/articleLink';
import { DefaultContent } from 'screens/widgets/AddTagg/components/content/default';
import { SocialContent } from 'screens/widgets/AddTagg/components/content/social';
import { WebsiteLinkContent } from 'screens/widgets/AddTagg/components/content/websiteLink';
import { YouTubeContent } from 'screens/widgets/AddTagg/components/content/youTube';
import {
  createApplicationLinkWidget,
  createGenericLinkWidget,
  createSocialMedaWidget,
  // createThumbnailForTaggs,
  createThumbnailForTaggsPost,
  createVideoLinkWidget,
  increment_coins,
} from 'services';
import { loadUserData } from 'store/actions';
import { RootState } from 'store/rootReducer';
import {
  AnalyticCategory,
  AnalyticVerb,
  ApplicationLinkWidgetLinkTypes,
  ApplicationLinkWidgetTypes,
  BackgroundGradientType,
  Banner,
  GenericLinkWidgetTypes,
  TaggScoreBannerText,
  VideoLinkWidgetLinkTypes,
} from 'types';
import { getTokenOrLogout, track } from 'utils';
import { useDebounce } from 'utils/hooks';
import { usePrevious } from 'utils/usePrevious';
import { generateLinkData } from 'utils/widgets';

import LinksWidget from '../../../components/widgets/LinksWidget';
import { BACKGROUND_GRADIENT_MAP, WHITE } from '../../../constants';
import { TaggShopData, WidgetsURLConstructor } from '../../../constants/widgets';
import styles from './styles';

type AddTaggRouteProps = RouteProp<MainStackParams, 'AddTagg'>;

type AddTaggNavigationProps = StackNavigationProp<MainStackParams, 'AddTagg'>;
interface AddTaggProps {
  route: AddTaggRouteProps;
  navigation: AddTaggNavigationProps;
}

const logo = images.socials.appleMusicBox;
export const bgTypes = {
  GRADIENT: 'gradient',
  SOLID: 'solid',
  IMAGE: 'image',
  NONE: 'none',
  FONT: 'font',
};

const AddTagg: React.FC<AddTaggProps> = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data, screenType, isEditTagg } = route.params;

  const userBGTaggEligiblity = useSelector((state: RootState) => state.user.userBGTaggEligiblity);

  const [thumbnail, setImage] = useState({});
  const Constructor =
    WidgetsURLConstructor[(data.link_type || data.type) as keyof typeof WidgetsURLConstructor];

  const {
    background_color_start,
    background_color_end,
    border_color_start,
    border_color_end,
    font_color,
  } = data;
  const [background_url, setbackground_url] = useState<any>(
    data.background_url ? data.background_url : null,
  );

  // let thumbnail_url = data.thumbnail_ur  ? data.thumbnail_url
  //   : 'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg';
  const { userId, username } = useSelector((state: RootState) => state.user.user);

  const [activeBgType, setActiveBgType] = useState<string>();
  const [loader, setLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState<boolean>(false);
  const [colorPickerColors, setColorPickerColors] = useState<string[]>(['#FFFFFF', '#FFFFFF']);
  const [edited, setEdited] = useState<boolean>(false);
  const prevColor = usePrevious(colorPickerColors);
  //const [taggTitleColor] = useState<string[]>([font_color || '#FFFFFF']);
  const tagg_score = useSelector((state: RootState) => state.user.profile.tagg_score);
  const [oldTaggScore, setOldTaggScore] = useState<number>(tagg_score);
  const [thmburi, setThmbUri] = React.useState<any>(null);
  const [bgImage, setbgImage] = useState<any>(null);
  const [thumbnail_url, setthumbnail_url] = React.useState<any>(
    data.thumbnail_url
      ? data.thumbnail_url
      : 'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg',
  );
  const [fontColor, setFontColor] = useState<string>(font_color ? font_color : '#FFFFFF');
  const prevFontColor = usePrevious(fontColor);
  const [previewTitle, setpreviewTitle] = useState<string>('');
  const [isFirstTimeLaunch, setIsFirstTimeLaunch] = useState<boolean>(true);
  const { linkData } = data;
  const index = data.link_type === ApplicationLinkWidgetLinkTypes.AMAZON && linkData ? 5 : 0;

  const image = (
    linkData?.images[index || 0]?.match('base64')
      ? { uri: linkData?.images[1] || '' }
      : linkData?.images[index || 0]?.match(/^data:image/)
      ? { uri: linkData?.images[1] || '' }
      : { uri: linkData?.images[index || 0] || '' }
  ) as ImageSourcePropType;
  useEffect(() => {
    if (background_color_start && background_color_end) {
      setColorPickerColors([background_color_start, background_color_end]);
      setActiveBgType(bgTypes.GRADIENT);
    } else if (border_color_start && border_color_end) {
      setColorPickerColors([border_color_start, border_color_end]);
      setActiveBgType(bgTypes.GRADIENT);
    } else if (background_color_start) {
      setColorPickerColors([background_color_start, background_color_start]);
      setActiveBgType(bgTypes.SOLID);
    } else if (border_color_start) {
      setColorPickerColors([border_color_start, border_color_start]);
      setActiveBgType(bgTypes.SOLID);
    } else {
      if (background_url) {
        setActiveBgType(bgTypes.IMAGE);
      } else {
        setActiveBgType(bgTypes.NONE);
      }
    }
  }, []);

  useEffect(() => {
    const c = font_color ? font_color : 'white';
    setFontColor(c);
    //setActiveBgType(bgTypes.FONT);
  }, []);

  useEffect(() => {
    if (prevColor && prevColor !== colorPickerColors) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  }, [colorPickerColors]);

  useEffect(() => {
    if (prevFontColor && prevFontColor !== fontColor) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  }, [fontColor]);

  const [innerData, setInnerData] = useState(data);

  const [values, setValues] = useState({
    url: data.url || '',
    title:
      data.type === ApplicationLinkWidgetTypes.SOCIAL
        ? data.title?.toUpperCase() == data.link_type
          ? ''
          : data.title || ''
        : data.id.length
        ? data.title
        : data.linkData?.title || '',
  });
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});
  const [status, setStatus] = useState('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const { url, title } = values;
  const debouncedUrl = useDebounce(url, 500);

  useEffect(() => {
    if (debouncedUrl.length) {
      if (Constructor?.validator(url)) {
        if (Constructor.title === 'Amazon') {
          let split_url = url.trim().split(' ');
          let sanitized_amazon_url = split_url[split_url.length - 1];
          setValues({ ...values, url: sanitized_amazon_url });
        }
        setLoading(true);
        let appendedUrl = url;
        if (
          appendedUrl.length > 5 &&
          !(appendedUrl.startsWith('https://') || appendedUrl.startsWith('http://'))
        ) {
          appendedUrl = 'https://' + appendedUrl;
        }
        generateLinkData(appendedUrl, data.link_type).then((res: any) => {
          if (values.title?.length === 0) {
            setValues({ ...values, title: res.title });
          }
          setLoading(false);
          setInnerData({ ...innerData, linkData: res });
        });

        setStatus('success');
      } else {
        setValues({ ...values, title: '' });
        setInnerData(data);
        setStatus('error');
      }
    } else {
      setStatus('');
    }
  }, [debouncedUrl]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: false,
    });
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setValues({ ...values, [name]: value });
    setpreviewTitle(value);
  };
  useEffect(() => {
    Object.keys(values).forEach((value: any) => {
      // @ts-ignore
      const val = values[value];
      const exclude = [VideoLinkWidgetLinkTypes.YOUTUBE];
      if (
        value === 'title' &&
        val?.length > 32 &&
        !exclude.includes(data.link_type as VideoLinkWidgetLinkTypes)
      ) {
        setErrors({ ...errors, [value]: 'Title must be max 32 character!' });
      } else {
        setErrors({});
      }
    });
  }, [values]);

  const handleSubmit = async () => {
    // if (!!isEditTagg && isEditTagg) {
    //   const pointsEarned = tagg_score - oldTaggScore;
    //   const bannerText = TaggScoreBannerText.TAGG_EDIT;
    //   setTimeout(() => {
    //     dispatch(makeAction(Banner.SHOW, true));
    //     dispatch(makeAction(Banner.TEXT, bannerText));
    //     dispatch(makeAction(Banner.POINT, `+ ${pointsEarned}`));
    //   }, 800);
    // }
    setLoader(true);
    const imageThumbnail =
      activeBgType === bgTypes.SOLID || activeBgType === bgTypes.GRADIENT
        ? colorPickerColors[0]
        : null;
    try {
      const token = await getTokenOrLogout(dispatch);
      switch (data.type) {
        case ApplicationLinkWidgetTypes.APPLICATION_LINK:
          await createApplicationLinkWidget(
            {
              ...values,
              order: 0,
              page: screenType,
              link_type: data.link_type,
              owner: userId,
              thumbnail_url,
              background_url,
              font_color: fontColor,
              background_color_start: imageThumbnail,
              background_color_end: activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
            },
            token,
            data.id,
          );
          break;
        case ApplicationLinkWidgetTypes.VIDEO_LINK:
          const t = title?.slice(0, 32);

          await createVideoLinkWidget(
            {
              ...values,
              order: 0,
              page: screenType,
              link_type: data.link_type,
              font_color: fontColor,
              border_color_start: imageThumbnail,
              border_color_end: activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
              title: t?.length > 0 ? t : 'Title',
              thumbnail_url,
              background_url,
              owner: userId,
            },
            token,
            data.id,
          );
          break;
        case ApplicationLinkWidgetTypes.GENERIC_LINK:
          await createGenericLinkWidget(
            {
              ...values,
              order: 0,
              page: screenType,
              thumbnail_url,
              background_url,
              font_color: fontColor,
              border_color_start: imageThumbnail,
              border_color_end: activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
              owner: userId,
              link_type: data.link_type,
            },
            token,
            data.id,
          );
          break;
        case ApplicationLinkWidgetTypes.SOCIAL:
          await createSocialMedaWidget(
            {
              order: 0,
              type: ApplicationLinkWidgetTypes.APPLICATION_LINK,
              page: screenType,
              link_type: data.link_type,
              owner: userId,
              // id: 'urn:uuid:5feff4c1-5144-f253-d125-f4497b4972a2',
              title: title || url,
              username: url,
              thumbnail_url,
              background_url,
              font_color: fontColor,
              background_color_start: imageThumbnail,
              background_color_end: activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
              social_type: data.link_type,
            },
            token,
            data.id,
          );
          break;
      }
      track('AddTagg', AnalyticVerb.Finished, AnalyticCategory.EditATagg, {
        type: data.type,
      });
      if (background_url) {
        if (data.background_url == null || background_url != data.background_url) {
          const request = new FormData();
          // we pass any number of coins depend upon requirement
          request.append('coins', 5);
          const res = await increment_coins(request);
          console.log(res);
        }
      }
      await dispatch(loadUserData({ userId, username }));
      setIsFirstTimeLaunch(false);
      setTimeout(async () => {
        await navigation.navigate('Profile', { showShareModalParm: true });
      }, 800);
    } catch (e) {
      // console.log(e);
      Alert.alert('Error', JSON.stringify(e));
    } finally {
      setLoader(false);
    }
  };

  const cbForCustomThumbnail = async (
    image: any,
    dataToPost2: any,
    imgUrl: string,
    baseUrl: string,
  ) => {
    setThmbUri(image.uri);
    setthumbnail_url(imgUrl);
    await createThumbnailForTaggsPost({ ...dataToPost2, file: image }, baseUrl);
  };
  const cbForCustomThumbnailBackground2 = async (
    image: any,
    dataToPost2: any,
    imgUrl: string,
    baseUrl: string,
  ) => {
    setbgImage(image.uri);
    setbackground_url(imgUrl);
    await createThumbnailForTaggsPost({ ...dataToPost2, file: image }, baseUrl);
  };
  useEffect(() => {
    // Display banner if score increased compared to score since the page was visited
    if (oldTaggScore < tagg_score && !isFirstTimeLaunch) {
      // const options = {
      //   enableVibrateFallback: true,
      //   ignoreAndroidSystemSettings: false,
      // };
      // ReactNativeHapticFeedback.trigger('impactLight', options);
      console.log(edited);
      const pointsEarned = tagg_score - oldTaggScore;
      const bannerText =
        !!isEditTagg && isEditTagg ? TaggScoreBannerText.TAGG_EDIT : TaggScoreBannerText.TAGG_ADD;
      setTimeout(() => {
        dispatch(makeAction(Banner.SHOW, true));
        dispatch(makeAction(Banner.TEXT, bannerText));
        dispatch(makeAction(Banner.POINT, `+ ${pointsEarned}`));
      }, 800);
      setOldTaggScore(tagg_score);
    }
  }, [tagg_score]);

  const renderContent = () => {
    let tmb = data.thumbnail_url;
    let tmbb = data.background_url;
    const props = {
      data,
      constructor: Constructor,
      url,
      image,
      tmb,
      tmbb,
      status,
      handleInputChange,
      isColorPickerVisible,
      activeBgType,
      bgTypes,
      colorPickerColors,
      setIsColorPickerVisible,
      setColorPickerColors,
      setActiveBgType,
      handleSubmit,
      errors,
      title,
      loader,
      setImage,
      cbForCustomThumbnail,
      fontColor,
      setFontColor,
      cbForCustomThumbnailBackground2,
      setIsImageLoading,
      screenType,
      userBGTaggEligiblity,
      setbackground_url,
      setbgImage,
    };
    if (data.type === ApplicationLinkWidgetTypes.SOCIAL) {
      return <SocialContent {...props} url={props.url} />;
    }

    switch (data.link_type) {
      case VideoLinkWidgetLinkTypes.YOUTUBE:
        return <YouTubeContent {...props} />;
      case GenericLinkWidgetTypes.WEBSITE:
        return <WebsiteLinkContent {...props} />;
      case GenericLinkWidgetTypes.ARTICLE:
        return <ArticleLinkContent {...props} />;
      default:
        return <DefaultContent {...props} loading={loading} recent={false} />;
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={BACKGROUND_GRADIENT_MAP[BackgroundGradientType.Dark]}
          style={styles.container}>
          <StatusBar barStyle={'light-content'} />
          <SafeAreaView>
            <View style={styles.listContainer}>
              <View style={styles.topBlock}>
                {logo && thmburi ? (
                  <LinksWidget
                    data={{
                      ...innerData,
                      background_color_start:
                        activeBgType === bgTypes.SOLID || activeBgType === bgTypes.GRADIENT
                          ? colorPickerColors[0]
                          : null,
                      background_color_end:
                        activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
                      thumbnail_url1: thumbnail.uri,
                    }}
                    background_url={background_url}
                    fallbackImage={thmburi}
                    title={values.title}
                    bgImage={bgImage}
                    thumbnailIcon={true}
                    isImageLoading={isImageLoading}
                    widgetLogo={data.widgetLogo ? data.widgetLogo : makeWidgetLogo(data.link_type)}
                  />
                ) : !innerData.linkData ? (
                  <>
                    <Image source={data.img} style={styles.logo} resizeMode={'contain'} />
                    {isImageLoading && (
                      <ActivityIndicator style={styles.loader} color={WHITE} size="large" />
                    )}
                  </>
                ) : (
                  <LinksWidget
                    data={{
                      ...innerData,
                      background_color_start:
                        activeBgType === bgTypes.SOLID || activeBgType === bgTypes.GRADIENT
                          ? colorPickerColors[0]
                          : null,
                      background_color_end:
                        activeBgType === bgTypes.GRADIENT ? colorPickerColors[1] : null,
                      thumbnail_url1: thumbnail.uri,
                    }}
                    fallbackImage={
                      data.img
                        ? data.img
                        : TaggShopData.filter(tagg => tagg.link_type === data.link_type)[0]?.img
                    }
                    isImageLoading={isImageLoading}
                    // title={values.title}
                    background_url={background_url}
                    bgImage={bgImage}
                    fontColor={fontColor}
                    widgetLogo={data.widgetLogo ? data.widgetLogo : makeWidgetLogo(data.link_type)}
                    title={previewTitle ? previewTitle : values.title}
                  />
                )}
              </View>
              {renderContent()}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default AddTagg;
