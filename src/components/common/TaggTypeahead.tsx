import React, { Fragment, useEffect, useRef, useState } from 'react';

import { LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import { Suggestion } from 'react-native-controlled-mentions';

import { getAllTaggUsers, loadSearchResults } from 'services';
import { ProfilePreviewType } from 'types';
import { isIPhoneX, SCREEN_HEIGHT, SCREEN_WIDTH } from 'utils';

import { SEARCH_ENDPOINT } from '../../constants';

import TaggUserRowCell from './TaggUserRowCell';

type TaggTypeaheadProps = {
  keyword: string | undefined;
  component: string | undefined;
  onSuggestionPress: (suggestion: Suggestion) => void;
  isShowBelowStyle?: boolean;
};

const TaggTypeahead: React.FC<TaggTypeaheadProps> = ({
  keyword,
  component,
  onSuggestionPress,
  isShowBelowStyle = false,
}) => {
  // const { friends } = useSelector((state: RootState) => state.friends);
  const [results, setResults] = useState<ProfilePreviewType[]>([]);
  const [viewPxy, setViewPxy] = useState<{ px: number; py: number }>({
    px: 0,
    py: 0,
  });
  const viewRef = useRef<View>(null);
  const [height, setHeight] = useState(0);
  const margin = component === 'comment' ? -10 : 0;

  useEffect(() => {
    if (keyword === '') {
      // setResults(shuffle(friends));
      loadUsers();
    } else {
      getQuerySuggested();
    }
  }, [keyword]);

  const loadUsers = async () => {
    const data = await getAllTaggUsers();
    setResults(data);
  };

  const onLayout = (_e: LayoutChangeEvent) => {
    viewRef.current?.measure(
      (_fx: number, _fy: number, _width: number, _height: number, px: number, py: number) => {
        setViewPxy({ px, py });
      },
    );
  };

  const getQuerySuggested = async () => {
    if (keyword === undefined || keyword === '@') {
      return;
    }
    const searchResults = await loadSearchResults(`${SEARCH_ENDPOINT}?query=${keyword}`);
    if (searchResults && searchResults.users) {
      setResults(searchResults.users);
    }
  };

  if (results.length === 0) {
    return <Fragment />;
  }

  return (
    <View ref={viewRef} onLayout={onLayout}>
      {!isShowBelowStyle && <View style={styles.overlay} />}
      <ScrollView
        style={[
          styles.container,
          isShowBelowStyle
            ? [styles.topPadding, { left: -viewPxy.px }]
            : { top: -height, margin: margin },
        ]}
        showsVerticalScrollIndicator={false}
        onLayout={event => {
          setHeight(event.nativeEvent.layout.height);
        }}
        keyboardShouldPersistTaps={'always'}>
        {results.map(user => (
          <TaggUserRowCell
            onPress={() => {
              setResults([]);
              onSuggestionPress({
                id: user.id,
                name: user.username,
              });
            }}
            user={user}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    maxHeight: 264,
    backgroundColor: 'white',
    alignSelf: 'center',
    zIndex: 1,
  },
  overlay: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'gray',
    opacity: 0.4,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    zIndex: -1,
  },
  topPadding: {
    top: isIPhoneX() ? 180 : 150,
  },
});

export default TaggTypeahead;
