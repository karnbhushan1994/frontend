import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import {
  Background,
  SocialIcon,
  TabsGradient,
  TaggBigInput,
  TaggDropDown,
  TaggInput,
} from 'components';
import TaggLoadingIndicator from 'components/common/TaggLoadingIndicator';

import { MainStackParams } from 'routes';
import { patchEditProfile } from 'services';
import { loadUserData, resetHeaderAndProfileImage } from 'store/actions';
import { RootState } from 'store/rootReducer';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType, ScreenType } from 'types';
import { HeaderHeight, SCREEN_HEIGHT, track } from 'utils';

import { bioRegex, CLASS_YEAR_LIST, genderRegex, websiteRegex } from '../../constants';
import {
  ERROR_UPLOAD_LARGE_PROFILE_PIC,
  ERROR_UPLOAD_SMALL_PROFILE_PIC,
} from '../../constants/strings';

type EditProfileNavigationProp = StackNavigationProp<MainStackParams, 'EditProfile'>;

interface EditProfileProps {
  route: RouteProp<MainStackParams, 'EditProfile'>;
  navigation: EditProfileNavigationProp;
}

/**
 * Create profile screen for onboarding.
 * @param navigation react-navigation navigation object
 */

const EditProfile: React.FC<EditProfileProps> = ({ route, navigation }) => {
  const y: Animated.Value<number> = Animated.useValue(0);
  const { userId, username } = route.params;
  const {
    profile: { website, biography, gender, snapchat, tiktok, university_class },
    avatar,
    cover,
  } = useSelector((state: RootState) => state.user);

  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (needsUpdate) {
      dispatch(resetHeaderAndProfileImage());
      dispatch(loadUserData({ userId, username }));
    }
  }, [dispatch, needsUpdate, userId, username]);

  const [isCustomGender, setIsCustomGender] = useState<boolean>(
    gender !== '' && gender !== 'female' && gender !== 'male',
  );

  const [form, setForm] = useState({
    largePic: cover ? cover : '',
    smallPic: avatar ? avatar : '',
    website: website ? website : '',
    bio: biography ? biography : '',
    gender: isCustomGender ? 'custom' : gender,
    customGenderText: isCustomGender ? gender : '',
    snapchat: snapchat,
    tiktok: tiktok,
    isValidWebsite: true,
    isValidBio: true,
    isValidGender: true,
    isValidSnapchat: true,
    isValidTiktok: true,
    attemptedSubmit: false,
    classYear: university_class,
  });

  var classYearList: Array<any> = [];

  CLASS_YEAR_LIST.map(value => {
    classYearList.push({ label: value, value: value });
  });

  const goToGalleryLargePic = useCallback(() => {
    ImagePicker.openPicker({
      smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
      width: 580,
      height: 580,
      cropping: true,
      cropperToolbarTitle: 'Select Header',
      mediaType: 'photo',
    }).then(picture => {
      if ('path' in picture) {
        track('LargeProfilePicture', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
        setForm({
          ...form,
          largePic: picture.path,
        });
      }
    });
  }, [form]);

  const goToGallerySmallPic = useCallback(() => {
    ImagePicker.openPicker({
      smartAlbums: ['Favorites', 'RecentlyAdded', 'SelfPortraits', 'Screenshots', 'UserLibrary'],
      width: 580,
      height: 580,
      cropping: true,
      cropperToolbarTitle: 'Select Profile Picture',
      mediaType: 'photo',
      cropperCircleOverlay: true,
    }).then(picture => {
      if ('path' in picture) {
        track('SmallProfilePicture', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
        setForm({
          ...form,
          smallPic: picture.path,
        });
      }
    });
  }, [form]);

  /**
   * Profile screen "Add header image" button
   */
  const LargeProfilePic = useMemo(
    () => (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="ADD HEADER IMAGE"
        onPress={() => goToGalleryLargePic()}
        style={styles.largeProfileUploader}>
        {form.largePic ? (
          <Image source={{ uri: form.largePic, cache: 'reload' }} style={styles.largeProfilePic} />
        ) : (
          <Text style={styles.largeProfileText}>ADD HEADER IMAGE</Text>
        )}
      </TouchableOpacity>
    ),
    [form.largePic, goToGalleryLargePic],
  );

  /**
   * Profile screen "Add profile picture" button
   */
  const SmallProfilePic = useMemo(
    () => (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="ADD PROFILE PICTURE"
        onPress={() => goToGallerySmallPic()}
        style={styles.smallProfileUploader}>
        {form.smallPic ? (
          <Image source={{ uri: form.smallPic, cache: 'reload' }} style={styles.smallProfilePic} />
        ) : (
          <Text style={styles.smallProfileText}>ADD PROFILE PICTURE</Text>
        )}
      </TouchableOpacity>
    ),
    [form.smallPic, goToGallerySmallPic],
  );

  /*
   * Handles changes to the website field value and verifies the input by updating state and running a validation function.
   */
  const handleWebsiteUpdate = (newWebsite: string) => {
    newWebsite = newWebsite.trim();
    let isValidWebsite: boolean = websiteRegex.test(newWebsite);
    if (isValidWebsite) {
      track('Website', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    }
    setForm({
      ...form,
      website: newWebsite,
      isValidWebsite,
    });
  };

  /*
   * Handles changes to the bio field value and verifies the input by updating state and running a validation function.
   */
  const handleBioUpdate = (newBio: string) => {
    let isValidBio: boolean = bioRegex.test(newBio);
    if (isValidBio) {
      track('Biography', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    }
    setForm({
      ...form,
      bio: newBio,
      isValidBio,
    });
  };

  const handleGenderUpdate = (newGender: string) => {
    if (newGender === 'custom') {
      track('CustomGenderOption', AnalyticVerb.Pressed, AnalyticCategory.EditProfile);
      setForm({ ...form, gender: newGender });
      setIsCustomGender(true);
    } else if (newGender === null) {
      // not doing anything will make the picker "bounce back"
    } else {
      setIsCustomGender(false);
      let isValidGender: boolean = true;
      track('Gender', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
      setForm({
        ...form,
        gender: newGender,
        isValidGender,
      });
    }
  };

  const handleCustomGenderUpdate = (customGenderText: string) => {
    let isValidGender: boolean = genderRegex.test(customGenderText);
    customGenderText = customGenderText.replace(' ', '-');
    if (isValidGender) {
      track('CustomGender', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    }
    setForm({
      ...form,
      customGenderText,
      isValidGender,
    });
  };

  const handleSnapchatUpdate = (newUsername: string) => {
    // Allow any username, empty means to "un-link" it
    // TODO: refresh taggs bar after
    track('Snapchat', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    setForm({
      ...form,
      snapchat: newUsername,
    });
  };

  const handleTikTokUpdate = (newUsername: string) => {
    // Allow any username, empty means to "un-link" it
    // TODO: refresh taggs bar after
    track('TikTok', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    setForm({
      ...form,
      tiktok: newUsername,
    });
  };

  const handleClassYearUpdate = (value: string) => {
    const classYear = parseInt(value, 10);
    track('ClassYear', AnalyticVerb.Updated, AnalyticCategory.EditProfile);
    setForm({
      ...form,
      classYear,
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!form.largePic) {
      Alert.alert(ERROR_UPLOAD_LARGE_PROFILE_PIC);
      return;
    }
    if (!form.smallPic) {
      Alert.alert(ERROR_UPLOAD_SMALL_PROFILE_PIC);
      return;
    }
    if (!form.attemptedSubmit) {
      setForm({
        ...form,
        attemptedSubmit: true,
      });
    }
    let invalidFields: boolean = false;
    const request = new FormData();
    if (form.largePic) {
      request.append('largeProfilePicture', {
        uri: form.largePic,
        name: 'large_profile_pic.jpg',
        type: 'image/jpg',
      });
    }
    if (form.smallPic) {
      request.append('smallProfilePicture', {
        uri: form.smallPic,
        name: 'small_profile_pic.jpg',
        type: 'image/jpg',
      });
    }

    if (form.isValidWebsite) {
      request.append('website', form.website);
    } else {
      setForm({ ...form, attemptedSubmit: false });
      setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
      invalidFields = true;
    }

    if (form.bio) {
      if (form.isValidBio) {
        request.append('biography', form.bio.trim());
      } else {
        setForm({ ...form, attemptedSubmit: false });
        setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
        invalidFields = true;
      }
    }

    if (isCustomGender) {
      if (form.isValidGender) {
        request.append('gender', form.customGenderText);
      } else {
        setForm({ ...form, attemptedSubmit: false });
        setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
        invalidFields = true;
      }
    } else {
      if (form.isValidGender) {
        request.append('gender', form.gender);
      }
    }

    if (form.isValidSnapchat) {
      request.append('snapchat', form.snapchat);
    } else {
      setForm({ ...form, attemptedSubmit: false });
      setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
      invalidFields = true;
    }

    if (form.isValidTiktok) {
      request.append('tiktok', form.tiktok);
    } else {
      setForm({ ...form, attemptedSubmit: false });
      setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
      invalidFields = true;
    }

    if (form.classYear !== university_class) {
      if (!form.classYear) {
        invalidFields = true;
        Alert.alert('Please select a valid class year');
      } else {
        request.append('university_class', form.classYear);
      }
    }

    if (invalidFields) {
      return;
    }

    patchEditProfile(request, userId)
      .then(_ => {
        setNeedsUpdate(true);
        navigation.pop();
      })
      .catch(error => {
        Alert.alert(error);
      });
  }, [form, isCustomGender, university_class, userId, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title={'Save'}
          buttonStyle={styles.headerRightButton}
          titleStyle={styles.boldFont}
          onPress={() => {
            track('SubmitButton', AnalyticVerb.Pressed, AnalyticCategory.EditProfile);
            setLoading(true);
            handleSubmit().then(() => setLoading(false));
          }}
        />
      ),
    });
  }, [navigation, handleSubmit]);

  return (
    <Background centered gradientType={BackgroundGradientType.Light}>
      {loading ? <TaggLoadingIndicator fullscreen /> : <Fragment />}
      <SafeAreaView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Animated.ScrollView
            style={styles.container}
            onScroll={e => y.setValue(e.nativeEvent.contentOffset.y)}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            alwaysBounceVertical
            contentContainerStyle={{ paddingBottom: SCREEN_HEIGHT / 15 }}>
            <StatusBar barStyle="light-content" translucent={false} />
            <View style={styles.relativeCenter}>
              <View>
                <View style={styles.profile}>
                  {LargeProfilePic}
                  {SmallProfilePic}
                </View>
                <View style={styles.relativeCenterWithWidth}>
                  <TaggInput
                    accessibilityHint="Enter a website."
                    accessibilityLabel="Website input field."
                    placeholder="Website"
                    autoCompleteType="off"
                    textContentType="URL"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onChangeText={handleWebsiteUpdate}
                    blurOnSubmit={false}
                    valid={form.isValidWebsite}
                    attemptedSubmit={form.attemptedSubmit}
                    invalidWarning={'Website must be a valid link to your website'}
                    value={form.website}
                  />
                  <TaggBigInput
                    accessibilityHint="Enter a bio."
                    accessibilityLabel="Bio input field."
                    placeholder="Bio"
                    autoCompleteType="off"
                    textContentType="none"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onChangeText={handleBioUpdate}
                    blurOnSubmit={false}
                    valid={form.isValidBio}
                    attemptedSubmit={form.attemptedSubmit}
                    invalidWarning={'Bio must be less than 150 characters'}
                    width={280}
                    value={form.bio}
                  />

                  <TaggDropDown
                    value={form.gender}
                    onValueChange={(value: string) => handleGenderUpdate(value)}
                    items={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Custom', value: 'custom' },
                    ]}
                    placeholder={{
                      label: 'Gender',
                      value: null,
                      color: '#fff',
                    }}
                  />
                  {isCustomGender && (
                    <TaggInput
                      accessibilityHint="Custom"
                      accessibilityLabel="Gender input field."
                      attemptedSubmit={form.attemptedSubmit}
                      autoCapitalize="none"
                      autoCompleteType="off"
                      blurOnSubmit={false}
                      invalidWarning={'Custom field can only contain letters and hyphens'}
                      onChangeText={handleCustomGenderUpdate}
                      placeholder="Enter your gender"
                      returnKeyType="done"
                      style={styles.customGenderInput}
                      textContentType="none"
                      valid={form.isValidGender}
                      value={form.customGenderText}
                    />
                  )}

                  <TaggDropDown
                    value={form.classYear.toString()}
                    onValueChange={(value: string) => handleClassYearUpdate(value)}
                    items={classYearList}
                    placeholder={{
                      label: 'Class Year',
                      value: null,
                      color: '#ddd',
                    }}
                  />
                  {snapchat !== '' && (
                    <View style={styles.row}>
                      <SocialIcon
                        social={'Snapchat'}
                        style={styles.icon}
                        screenType={ScreenType.Profile}
                      />
                      <View style={styles.taggInput}>
                        <TaggInput
                          accessibilityHint="Snapchat Username"
                          accessibilityLabel="Snapchat Username Input Field."
                          attemptedSubmit={form.attemptedSubmit}
                          autoCapitalize="none"
                          autoCompleteType="off"
                          autoCorrect={false}
                          blurOnSubmit={false}
                          enablesReturnKeyAutomatically={true}
                          invalidWarning={'Please enter something!'}
                          onChangeText={handleSnapchatUpdate}
                          onSubmitEditing={Keyboard.dismiss}
                          placeholder="Username"
                          returnKeyType="done"
                          textContentType="none"
                          valid={form.isValidSnapchat}
                          value={form.snapchat && form.snapchat}
                        />
                      </View>
                    </View>
                  )}
                  {tiktok !== '' && (
                    <View style={styles.row}>
                      <SocialIcon social={'TikTok'} style={styles.icon} whiteRing={undefined} />
                      <View style={styles.taggInput}>
                        <TaggInput
                          accessibilityHint="TikTok Username"
                          accessibilityLabel="TikTok Username Input Field."
                          attemptedSubmit={form.attemptedSubmit}
                          autoCapitalize="none"
                          autoCompleteType="off"
                          autoCorrect={false}
                          blurOnSubmit={false}
                          enablesReturnKeyAutomatically={true}
                          invalidWarning={'Please enter something!'}
                          onChangeText={handleTikTokUpdate}
                          onSubmitEditing={Keyboard.dismiss}
                          placeholder="Username"
                          returnKeyType="done"
                          textContentType="none"
                          valid={form.isValidTiktok}
                          value={form.tiktok}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <TabsGradient />
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: HeaderHeight,
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  profile: {
    flexDirection: 'row',
    marginBottom: '5%',
    justifyContent: 'flex-end',
  },
  largeProfileUploader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginLeft: '13%',
    marginTop: '5%',
    height: 230,
    width: 230,
    borderRadius: 23,
  },
  largeProfileText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#863FF9',
  },
  largeProfilePic: {
    height: 230,
    width: 230,
    borderRadius: 23,
  },
  smallProfileUploader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E1F0FF',
    right: '18%',
    marginTop: '38%',
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  smallProfileText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#806DF4',
  },
  smallProfilePic: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  customGenderInput: {
    width: '100%',
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    borderColor: '#fffdfd',
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 13,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    aspectRatio: 1,
    flex: 1,
  },
  taggInput: {
    flex: 6.5,
    marginLeft: '3%',
  },
  headerRightButton: {
    backgroundColor: 'transparent',
    marginRight: 15,
  },
  boldFont: {
    fontWeight: 'bold',
  },
  relativeCenter: {
    position: 'relative',
    alignSelf: 'center',
  },
  relativeCenterWithWidth: {
    position: 'relative',
    width: 280,
    alignSelf: 'center',
  },
});

export default EditProfile;
