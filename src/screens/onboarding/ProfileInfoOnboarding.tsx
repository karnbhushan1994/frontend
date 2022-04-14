import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';

import { images } from 'assets/images';
import {
  Background,
  BirthDatePicker,
  TaggDropDown,
  TaggInput,
  UniversitySelection,
} from 'components';

import { OnboardingStackParams } from 'routes/onboarding';
import { patchEditProfile } from 'services';
import { AnalyticCategory, AnalyticVerb, BackgroundGradientType, UniversityType } from 'types';
import { normalize, SCREEN_HEIGHT, SCREEN_WIDTH, track } from 'utils';

import { CLASS_YEAR_LIST, genderRegex, TAGG_PURPLE } from '../../constants';
import {
  ERROR_SELECT_BIRTHDAY,
  ERROR_SELECT_CLASS_YEAR,
  ERROR_SELECT_GENDER,
  ERROR_SELECT_UNIVERSITY,
} from '../../constants/strings';

type ProfileInfoOnboardingRouteProp = RouteProp<OnboardingStackParams, 'ProfileInfoOnboarding'>;
type ProfileInfoOnboardingNavigationProp = StackNavigationProp<
  OnboardingStackParams,
  'ProfileInfoOnboarding'
>;
interface ProfileInfoOnboardingProps {
  route: ProfileInfoOnboardingRouteProp;
  navigation: ProfileInfoOnboardingNavigationProp;
}

type FormType = {
  smallPic: string;
  university: UniversityType;
  birthdate: string | undefined;
  gender: string;
  isValidGender: boolean;
  classYear: number;
  attemptedSubmit: boolean;
};

const ProfileInfoOnboarding: React.FC<ProfileInfoOnboardingProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [form, setForm] = React.useState<FormType>({
    smallPic: '',
    university: UniversityType.Empty,
    birthdate: undefined,
    gender: '',
    isValidGender: true,
    classYear: -1,
    attemptedSubmit: false,
  });
  const [customGender, setCustomGender] = React.useState(false);

  const classYearList = CLASS_YEAR_LIST.map(value => ({
    label: value,
    value,
  }));

  /**
   * Profile screen "Add profile picture" button
   */
  const SmallProfilePic = () => (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel="ADD PROFILE PICTURE"
      onPress={goToGallerySmallPic}
      style={styles.smallProfileUploader}>
      {form.smallPic ? (
        <Image source={{ uri: form.smallPic }} style={styles.smallProfilePic} />
      ) : (
        <Text style={styles.smallProfileText}>ADD PROFILE PICTURE</Text>
      )}
    </TouchableOpacity>
  );

  const goToGallerySmallPic = () => {
    track('SmallProfilePictureStep', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
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
        setForm({
          ...form,
          smallPic: picture.path,
        });
      }
    });
  };

  const handleGenderUpdate = (gender: string) => {
    track('GenderStep', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    if (gender === 'custom') {
      setCustomGender(true);
    } else {
      setCustomGender(false);
      let isValidGender: boolean = true;
      setForm({
        ...form,
        gender,
        isValidGender,
      });
    }
  };

  const handleClassYearUpdate = (value: string) => {
    const classYear = parseInt(value, 10);
    track('ClassYearStep', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    setForm({
      ...form,
      classYear,
    });
  };

  const handleCustomGenderUpdate = (gender: string) => {
    track('CustomGenderStep', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    let isValidGender: boolean = genderRegex.test(gender);
    gender = gender.replace(' ', '-');
    setForm({
      ...form,
      gender,
      isValidGender,
    });
  };

  const handleBirthdateUpdate = (birthdate: Date) => {
    track('BirthdayStep', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    setForm({
      ...form,
      birthdate: birthdate && moment(birthdate).format('YYYY-MM-DD'),
    });
  };

  const handleSubmit = async () => {
    track('SubmitProfileInfoButton', AnalyticVerb.Pressed, AnalyticCategory.Onboarding);
    if (form.classYear === -1) {
      Alert.alert(ERROR_SELECT_CLASS_YEAR);
      return;
    }
    if (form.university === UniversityType.Empty) {
      Alert.alert(ERROR_SELECT_UNIVERSITY);
      return;
    }
    if (!form.birthdate) {
      Alert.alert(ERROR_SELECT_BIRTHDAY);
      return;
    }
    if (form.gender === '') {
      Alert.alert(ERROR_SELECT_GENDER);
      return;
    }
    if (!form.attemptedSubmit) {
      setForm({
        ...form,
        attemptedSubmit: true,
      });
    }
    const request = new FormData();
    if (form.smallPic) {
      request.append('smallProfilePicture', {
        uri: form.smallPic,
        name: 'small_profile_pic.jpg',
        type: 'image/jpg',
      });
    }

    if (customGender) {
      if (form.isValidGender) {
        request.append('gender', form.gender);
      } else {
        setForm({ ...form, attemptedSubmit: false });
        setTimeout(() => setForm({ ...form, attemptedSubmit: true }));
        return;
      }
    } else {
      if (form.isValidGender) {
        request.append('gender', form.gender);
      }
    }

    request.append('birthday', form.birthdate);
    request.append('university_class', form.classYear);
    request.append('university', form.university);

    patchEditProfile(request, userId)
      .then(_ => {
        track('ProfileInfoOnboarding', AnalyticVerb.Finished, AnalyticCategory.Onboarding);
        navigation.navigate('InvitationCodeVerification', route.params);
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  return (
    <Animated.ScrollView bounces={false}>
      <Background centered gradientType={BackgroundGradientType.Light} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.profile}>
          <SmallProfilePic />
          <Image source={images.main.purple_plus} style={styles.purplePlus} />
        </View>
        <View style={styles.contentContainer}>
          <UniversitySelection
            selected={form.university}
            setSelected={selected => {
              setForm({
                ...form,
                university: selected,
              });
            }}
          />
          <TaggDropDown
            onValueChange={(value: string) => handleClassYearUpdate(value)}
            items={classYearList}
            placeholder={{
              label: 'Class Year',
              value: null,
              color: '#ddd',
            }}
          />
          <BirthDatePicker
            handleBDUpdate={handleBirthdateUpdate}
            width={280}
            date={form.birthdate as Date | undefined}
            showPresetdate={false}
          />
          {customGender && (
            <TaggInput
              accessibilityHint="Custom"
              accessibilityLabel="Gender input field."
              placeholder="Enter your gender"
              autoCompleteType="off"
              textContentType="none"
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={handleCustomGenderUpdate}
              onSubmitEditing={() => handleSubmit()}
              valid={form.isValidGender}
              attemptedSubmit={form.attemptedSubmit}
              invalidWarning={'Custom field can only contain letters and hyphens'}
            />
          )}
          <TaggDropDown
            onValueChange={(value: string) => handleGenderUpdate(value)}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Custom', value: 'custom' },
            ]}
            placeholder={{
              label: 'Gender',
              value: null,
              color: '#ddd',
            }}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitBtnLabel}>Let's start!</Text>
          </TouchableOpacity>
        </View>
      </Background>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT,
  },
  profile: {
    marginTop: '10%',
    marginBottom: '5%',
  },
  contentContainer: {
    position: 'relative',
    width: 280,
  },
  smallProfileUploader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E1F0FF',
    height: normalize(150),
    width: normalize(150),
    borderRadius: normalize(150),
  },
  smallProfileText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#806DF4',
  },
  smallProfilePic: {
    height: normalize(150),
    width: normalize(150),
    borderRadius: normalize(150),
    borderWidth: 2,
    borderColor: 'white',
  },
  submitBtn: {
    backgroundColor: TAGG_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 2.5,
    height: SCREEN_WIDTH / 10,
    borderRadius: 5,
    marginTop: '5%',
    alignSelf: 'center',
  },
  submitBtnLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  goBack: {
    textDecorationLine: 'underline',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: SCREEN_HEIGHT * 0.15,
  },
  wizard: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
  },
  purplePlus: {
    position: 'absolute',
    height: normalize(40),
    width: normalize(40),
    bottom: 0,
    right: 0,
  },
});

export default ProfileInfoOnboarding;
