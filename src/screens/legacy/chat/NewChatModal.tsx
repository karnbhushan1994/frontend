import { SEARCH_ENDPOINT_MESSAGES, SEARCH_ENDPOINT_SUGGESTED } from '../../../constants';

import React, { useEffect, useState } from 'react';

import { Keyboard, SectionListData, StatusBar, StyleSheet, Text, View } from 'react-native';

import { BottomDrawer } from 'components';
import { loadSearchResults } from 'services';
import { ScreenType } from 'types';
import { normalize } from 'utils';

import { ChatResultsList, ChatSearchBar } from './index';

interface NewChatModalProps {
  modalVisible: boolean;
  setChatModalVisible: (open: boolean) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ modalVisible, setChatModalVisible }) => {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SectionListData<any>[]>([]);
  const [query, setQuery] = useState<string>('');
  const handleFocus = () => {
    setSearching(true);
  };
  const handleBlur = () => {
    Keyboard.dismiss();
  };
  const handleCancel = () => {
    setQuery('');
    setChatModalVisible(false);
  };

  const getDefaultSuggested = async () => {
    const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT_SUGGESTED}`);
    const sanitizedResult = [
      {
        title: 'users',
        data: searchResults?.users,
      },
    ];
    setResults(sanitizedResult);
  };

  const getQuerySuggested = async () => {
    const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT_MESSAGES}?query=${query}`);
    if (query.length > 2) {
      const sanitizedResult = [
        {
          title: 'users',
          data: searchResults?.users,
        },
      ];
      setResults(sanitizedResult);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (query.length === 0) {
      getDefaultSuggested();
    }

    if (!searching) {
      return;
    }

    if (query.length < 3) {
      return;
    }
    getQuerySuggested();
  }, [query]);

  const _modalContent = () => (
    <View style={styles.modalShadowContainer}>
      <View style={styles.titleContainerStyles}>
        <Text style={styles.titleTextStyles}>New Message</Text>
      </View>
      <ChatSearchBar
        onCancel={handleCancel}
        onChangeText={setQuery}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={query}
        searching={searching}
        placeholder={''}
        label={'To:'}
      />
      {results.length > 0 && (
        <View style={styles.headerContainerStyles}>
          <Text style={styles.headerTextStyles}>Suggested</Text>
        </View>
      )}
      <ChatResultsList
        {...{ results, setChatModalVisible }}
        previewType={'Search'}
        screenType={ScreenType.Search}
      />
    </View>
  );

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <BottomDrawer
        initialSnapPosition={'90%'}
        isOpen={modalVisible}
        setIsOpen={open => {
          if (!open) {
            setQuery('');
          }
          setChatModalVisible(open);
        }}
        showHeader={false}>
        {_modalContent()}
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  modalShadowContainer: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: 'white',
  },
  titleContainerStyles: { marginVertical: 24 },
  titleTextStyles: {
    fontWeight: 'bold',
    fontSize: normalize(18),
    lineHeight: normalize(21),
    textAlign: 'center',
  },
  headerContainerStyles: {
    marginTop: 26,
    marginBottom: 10,
    marginHorizontal: 28,
  },
  headerTextStyles: {
    fontWeight: 'bold',
    fontSize: normalize(17),
    lineHeight: normalize(20),
  },
});

export default NewChatModal;
