import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import logger from 'utils/logger';

export const useAsyncStorage = (key: string, defaultValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(defaultValue);

  const getStoredItem = async (currentKey: string, currentValue: string) => {
    try {
      const item = await AsyncStorage.getItem(currentKey);
      const value = item ? item : currentValue;
      setStoredValue(value);
    } catch (error) {
      logger.log(error);
    }
  };

  useEffect(() => {
    getStoredItem(key, defaultValue);
  }, [key, defaultValue]);

  const setValue = async (value: string) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      logger.log(error);
    }
  };

  return [storedValue, setValue];
};

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
};
