import React, { useEffect, useState } from 'react';

import { Text, Image, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import ImagePicker2 from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { useDispatch, useSelector } from 'react-redux';

import { icons } from 'assets/icons';
import { images } from 'assets/images';
import { UnwrapImageRewardPopup, UnwrapThumbnail } from 'components';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import LockedModal from 'components/modals/lockedModal';
import InputTaggLink from 'components/widgets/InputTaggLink';
import SimpleButton from 'components/widgets/SimpleButton';
import { ContentType } from 'screens/widgets/AddTagg/components/content/types';
import { ImagePicker } from 'screens/widgets/AddTagg/components/ImagePicker';
import styles from 'screens/widgets/AddTagg/styles';
import {
  checkIfFontUnlocked,
  checkIfThumbnailUnlocked,
  createThumbnailForTaggs,
  unlock_Font,
  unlock_Thumbnail,
} from 'services';
import { loadUserData } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { getTokenOrLogout } from 'utils';

export const WebsiteLinkContent: React.FC<ContentType> = ({
  constructor,
  url,
  tmb,
  tmbb,
  image,
  status,
  handleInputChange,
  isColorPickerVisible,
  colorPickerColors,
  activeBgType,
  setIsColorPickerVisible,
  setColorPickerColors,
  setFontColor,
  errors,
  title,
  handleSubmit,
  loader,
  setActiveBgType,
  bgTypes,
  setImage,
  cbForCustomThumbnail,
  cbForCustomThumbnailBackground2,
  setIsImageLoading,
  screenType,
  userBGTaggEligiblity,
  setbackground_url,
  setbgImage,
}) => {
  const dispatch = useDispatch();
  const [thumnailIcon, setthumnailIcon] = useState<any>(null);
  const tagg_score = useSelector((state: RootState) => state.user.profile.tagg_score);
  const [unwarpReward, setunwarpReward] = useState<boolean>(false);
  const [isFontAvailable, setisFontAvailable] = useState<boolean>(false);
  const [score, setscore] = useState<any>('');
  const [isDiablePopupBtn, seIsDiablePopupBtn] = useState<any>(true);
  const [isThumbnailAvailable, setIsThumbnailAvailable] = useState<boolean>(false);
  const [is_award_shown, setIs_award_shown] = useState<boolean>(false);
  const [unwrapCount, setUnwrapCount] = useState<any>(0);
  const {
    user: { userId, username },
  } = useSelector((state: RootState) => state.user);
  const [unwarpRewardThumbnail, setunwarpRewardThumbnail] = useState<boolean>(false);
  const openImage = async () => {
    ImagePicker2.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(async image => {
      setIsImageLoading(true);
      const token = await getTokenOrLogout(dispatch);
      const filename = Math.floor(Math.random() * 1000000000) + '' + image?.filename;
      const res = await createThumbnailForTaggs({ filename }, token);
      setthumnailIcon(image.path);

      setTimeout(() => {
        cbForCustomThumbnail(
          {
            name: filename,
            type: image.mime,
            uri: image.path,
          },
          res.response_url.fields,
          res.image_path,
          res.response_url.url,
        );
        setIsImageLoading(false);
      }, 200);
    });
  };

  const cbForCustomThumbnailBackground = (
    data: any,
    dataToPost: any,
    imageUrl: any,
    baseUrl: string,
  ) => {
    setIsImageLoading(true);
    setTimeout(() => {
      cbForCustomThumbnailBackground2(data, dataToPost, imageUrl, baseUrl);
      setIsImageLoading(false);
    }, 200);
  };
  const [isLockVisible, setIsLockVisible] = useState<boolean>(false);
  const [isFontSelected, setIsFontSelected] = useState<boolean>(false);

  const selectFontColor = (c: string) => {
    setFontColor(c[0]);
    setIsFontSelected(false);
  };
  const onpressLockModal = async () => {
    setIsLockVisible(false);
    const res = await unlock_Font();
    if (res.tagg_title_font_color_unlocked) {
      dispatch(loadUserData({ userId, username }));
      setisFontAvailable(true);
      setunwarpReward(true);
    }
  };
  useEffect(() => {
    setscore(tagg_score);
    checkfont();
  }, []);
  useEffect(() => {
    if (unwrapCount == 3) {
      callUnwrap();
    }
  }, [unwarpRewardThumbnail]);
  const callUnwrap = async () => {
    const res = await unlock_Thumbnail();
    if (res.tagg_thumb_image_unlocked) {
      setIsThumbnailAvailable(true);
      seIsDiablePopupBtn(false);
    }
  };
  const checkfont = async () => {
    const isAvaliableFont = await checkIfFontUnlocked();
    setisFontAvailable(isAvaliableFont);
    const isAvaliableThumnail = await checkIfThumbnailUnlocked();
    setIsThumbnailAvailable(isAvaliableThumnail.tagg_thumb_image_unlocked);
    setIs_award_shown(isAvaliableThumnail.widget_count);
  };
  return (
    <View style={styles.bottomBlock}>
      <Text style={[styles.title, styles.smallBottom]}>Website Links</Text>
      <Text style={[styles.subTitle]}>Add link to a website</Text>
      <View style={styles.urlInputWrapper}>
        <InputTaggLink
          label={'Add a Link'}
          placeholder={constructor?.urlPlaceholder}
          containerStyle={[styles.inputContainer]}
          value={url}
          validation={status}
          name="url"
          onChange={handleInputChange}
        />
        <InputTaggLink
          label={'Link Title'}
          placeholder={'Enter a title for your link'}
          containerStyle={styles.inputContainer}
          name="title"
          value={title}
          onChange={handleInputChange}
          error={errors.title}
          validation={errors.title?.length ? 'error' : title.length ? 'success' : ''}
        />

        {status === 'error' ? (
          <View style={styles.errorCloud}>
            <Text style={styles.errorCloudText}>Insert valid link</Text>
            <View style={styles.errorCloudTriangle} />
          </View>
        ) : null}
      </View>

      {/*  <TouchableOpacity
        style={styles.fieldButton}
        onPress={() => {
          setIsLockVisible(true);
          // setIsColorPickerVisible(true)
        }}>
        <SvgXml xml={icons.Lock} height={15} width={15} />
        <Text style={styles.fontText}>Font</Text>
        <SvgXml xml={icons.PlusIconWhite} height={13} width={13} color={'#828282'} />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          setscore(tagg_score);
          if (isFontAvailable) {
            setIsColorPickerVisible(true);
            setIsFontSelected(true);
          } else {
            setIsLockVisible(true);
            if (tagg_score >= 30) {
              seIsDiablePopupBtn(false);
            } else {
              seIsDiablePopupBtn(true);
            }
          }
        }}
        style={styles.fieldButton}>
        <Text style={styles.titleText}>Font color</Text>
        <SvgXml xml={icons.PlusIconWhite} height={13} width={13} color={'#111111'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fieldButton}
        onPress={async () => {
          setscore(null);
          if (isThumbnailAvailable) {
            openImage();
          } else {
            if (is_award_shown) {
              setunwarpRewardThumbnail(true);
            } else {
              seIsDiablePopupBtn(true);
              setIsLockVisible(true);
            }
          }
        }}>
        {thumnailIcon ? (
          <Image source={{ uri: thumnailIcon }} style={styles.thumbnailIcon} />
        ) : tmb && tmb != 'https://tagg-prod.s3.us-east-2.amazonaws.com/misc/not+found.jpg' ? (
          <Image source={{ uri: tmb }} style={styles.thumbnailIcon} />
        ) : image.uri ? (
          <Image source={{ uri: image.uri }} style={styles.thumbnailIcon} />
        ) : (
          <Image
            source={require('../../../../../../assets/icons/picture-com.png')}
            style={styles.thumbnailIcon}
          />
        )}
        <Text style={styles.fontTextThumbnail}>Thumbnail</Text>
        <SvgXml xml={icons.PlusIconWhite} height={13} width={13} color={'#000000'} />
      </TouchableOpacity>

      {isColorPickerVisible && (
        <ColorPicker
          gradient={activeBgType === bgTypes?.GRADIENT && !isFontSelected}
          colorPickerColors={colorPickerColors}
          setIsModalVisible={setIsColorPickerVisible}
          setColorPickerColors={c =>
            isFontSelected ? selectFontColor(c) : setColorPickerColors(c)
          }
          setActiveBgType={setActiveBgType}
          // font
        />
      )}
      <View style={styles.bgBlock}>
        <TouchableWithoutFeedback
          onPress={() => {
            setActiveBgType && setActiveBgType(bgTypes.GRADIENT);
            setIsColorPickerVisible(true);
          }}>
          <View
            style={[styles.bgType, activeBgType === bgTypes.GRADIENT ? styles.activeBgType : {}]}>
            {activeBgType === bgTypes?.GRADIENT ? (
              <LinearGradient
                colors={colorPickerColors}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.bgTypeGradient}>
                <View>
                  <Text style={styles.bgTypeText}>Gradient</Text>
                </View>
              </LinearGradient>
            ) : (
              <LinearGradient colors={['#e1e1e1', '#b7b7b7']} style={styles.bgTypeGradient}>
                <View>
                  <Text style={styles.bgTypeText}>Gradient</Text>
                </View>
              </LinearGradient>
            )}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setActiveBgType(bgTypes.SOLID);
            setIsColorPickerVisible(true);
          }}>
          {activeBgType === bgTypes?.SOLID ? (
            <View
              style={[
                styles.bgType,
                styles.bgTypeSolidGrey,
                activeBgType === bgTypes.SOLID ? styles.activeBgType : {},
                { backgroundColor: colorPickerColors[0] },
              ]}>
              <Text style={styles.bgTypeText}>Solid</Text>
            </View>
          ) : (
            <View
              style={[
                styles.bgType,
                styles.bgTypeSolidGrey,
                activeBgType === bgTypes.SOLID ? styles.activeBgType : {},
              ]}>
              <Text style={styles.bgTypeText}>Solid</Text>
            </View>
          )}
        </TouchableWithoutFeedback>
        <ImagePicker
          cbForCustomThumbnailBackground={cbForCustomThumbnailBackground}
          activeBgType={activeBgType}
          setActiveBgType={setActiveBgType}
          setImage={setImage}
          tmbb={tmbb}
          screenType={screenType}
          userBGTaggEligiblity={userBGTaggEligiblity}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            setbgImage(null);
            setbackground_url(null);
            setActiveBgType(bgTypes.NONE);
            setColorPickerColors(['#FFFFFF', '#FFFFFF']);
          }}>
          <View
            style={[
              styles.bgType,
              styles.bgTypeNone,
              activeBgType === bgTypes.NONE ? styles.activeBgType : {},
            ]}>
            <Text style={styles.bgTypeText}>None</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <SimpleButton
        title={'Save'}
        onPress={handleSubmit}
        containerStyles={styles.buttonContainer}
        disabled={
          !constructor?.validator(url) ||
          Object.keys(errors).length > 0 ||
          loader ||
          title.length < 1
        }
        loader={loader}
      />
      <UnwrapImageRewardPopup visible={unwarpReward} setVisible={setunwarpReward} />
      <UnwrapThumbnail
        visible={unwarpRewardThumbnail}
        setVisible={setunwarpRewardThumbnail}
        setCount={setUnwrapCount}
      />
      <LockedModal
        visible={isLockVisible}
        setVisible={setIsLockVisible}
        onPress={onpressLockModal}
        //isDisable={score >= 30 ? false : true}
        isDisable={isDiablePopupBtn}
        message={score >= 30 ? 'Tagg Font Color' : ''}
        buttonTitle={score ? 'showCoinInText' : 'continue'}
        icon={
          score >= 30 ? <Image source={images.main.fontpopup} style={styles.imagelockModal} /> : ''
        }
      />
    </View>
  );
};
