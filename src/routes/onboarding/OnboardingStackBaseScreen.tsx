import React, { createContext, FC, useState } from 'react';

import { OnboardingContextType } from '../../types';
import OnboardingStackScreen from './OnboardingStackScreen';

export const OnboardingContext = createContext({} as OnboardingContextType);

const OnboardingStackBaseScreen: FC = () => {
  const [isVip, setIsVip] = useState(false);
  const [phone, setPhone] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [age, setAge] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [token, setToken] = useState<string>();
  return (
    <OnboardingContext.Provider
      value={{
        isVip,
        setIsVip,
        phone,
        setPhone,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        password,
        setPassword,
        age,
        setAge,
        gender,
        setGender,
        email,
        setEmail,
        userId,
        setUserId,
        token,
        setToken,
      }}>
      <OnboardingStackScreen />
    </OnboardingContext.Provider>
  );
};

export default OnboardingStackBaseScreen;
