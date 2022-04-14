import React, { Fragment, useRef, useState } from 'react';

import { Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { SCREEN_WIDTH } from 'utils';

import { TAGG_LIGHT_BLUE_2 } from '../../constants';

interface PostCarouselProps {
  data: string[];
  imageStyles: Object;
  marginBottom: number;
}

const PostCarousel: React.FC<PostCarouselProps> = ({ data, imageStyles, marginBottom }) => {
  const carouselRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const renderItem: (item: any) => Object = ({ item }) => {
    if (item === null) {
      return <Fragment />;
    } else {
      return <Image style={imageStyles} source={{ uri: item }} />;
    }
  };

  return (
    <>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
        onSnapToItem={setCurrentPage}
      />
      <Pagination
        activeDotIndex={currentPage}
        dotsLength={data.length}
        containerStyle={{ marginBottom: marginBottom }}
        dotColor={TAGG_LIGHT_BLUE_2}
        inactiveDotColor={'#e0e0e0'}
      />
    </>
  );
};

export default PostCarousel;
