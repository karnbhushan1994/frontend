import React, { useRef } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

enum ContainerSizes {
  HEADER = 15,
  BODY = 60,
  FOOTER = 35,
}
type Props = {
  data: { labels: { label: string; value: string }[]; data: number[] };
  width: number;
  height: number;
  title: string;
  subTitle?: string;
};
const PADDING = 20;
const PADDING_MONITOR = 1.4;

/**
 * calculateWithPercent
 * @param size
 * @param percent
 */
const calculateWithPercent = (size: number, percent: number) => (size * percent) / 100;
const calculateChartHeight = (size: number, data: number) => {
  let counter = 0;

  switch (true) {
    case data < 100:
      counter = data;
      break;
    case data < 500:
      counter = data / (size / 60);
      break;
    case data < 1000:
      counter = data / (size / 30);
      break;
    case data < 5000:
      counter = data / (size / 6);
      break;
    case data < 10000:
      counter = data / (size / 2.5);
      break;
    case data < 100000:
      counter = data / (size * 4);
      break;
    case data > 100000:
      counter = size - 20;
      break;
    default:
      counter = data;
  }
  return counter;
};
const Bar: React.FC<{ height: number; size: number }> = ({ height, size }) => {
  const h = useRef(new Animated.Value(0)).current;
  let kValue;
  let gradientColors: string[];
  switch (true) {
    case size < 1000:
      gradientColors = ['#86c97c', '#93cb71', '#9aca6a'];
      break;
    case size < 6000:
      gradientColors = ['#84c89f', '#85c892', '#84c981'];
      break;
    case size < 10000:
      gradientColors = ['#91d8d2', '#8bd0bd', '#86c9ab'];
      break;
    case size < 100000:
      gradientColors = ['#7206e9', '#6a2cd7', '#6c74c5'];
      break;

    case size > 1000000:
      gradientColors = ['#6b61d6', '#7281cf', '#7ba5c5'];
      break;
    default:
      gradientColors = ['#86c97c', '#93cb71', '#9aca6a'];
  }

  switch (true) {
    case size < 1000:
      kValue = size;
      break;
    case size < 100000:
      kValue = size / 1000 + 'K';
      break;
    case size > 1000000:
      kValue = size / 1000000 + 'M';
      break;
    default:
      kValue = size;
  }
  Animated.timing(h, {
    toValue: calculateChartHeight(calculateWithPercent(height, ContainerSizes.BODY), size),
    duration: 500,
    easing: Easing.ease,
    useNativeDriver: false,
  }).start();

  return (
    <Animated.View
      style={[
        styles.chartBar,

        {
          height: h,
        },
      ]}>
      <Text style={styles.chartText}>{kValue}</Text>
      <View style={styles.shadowContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          locations={[0, 0.6, 1]}
          colors={gradientColors}
          style={styles.chartBarInner}
        />
      </View>
    </Animated.View>
  );
};
export const BarChart: React.FC<Props> = ({ data, width, height, title, subTitle }) => {
  const FIXED_ELEMENTS = 7;
  const _renderBars = () => (
    <View style={[styles.labels]}>
      {data.data.map(size => (
        <View
          key={`bar-${size}`}
          style={[
            styles.barChartWrapper,

            {
              paddingLeft:
                height -
                (calculateWithPercent(width, 100) - PADDING * PADDING_MONITOR) * data.labels.length,
              width:
                (calculateWithPercent(width, 100) - PADDING * PADDING_MONITOR) / FIXED_ELEMENTS,
            },
          ]}>
          <Bar height={height} size={size} />
        </View>
      ))}
    </View>
  );
  const _renderLabels = () => (
    <View style={[styles.labels, { height: calculateWithPercent(height, ContainerSizes.FOOTER) }]}>
      {data.labels.map(_ => (
        <View
          key={_.label}
          style={[
            styles.labelWrapper,

            {
              paddingLeft:
                height -
                (calculateWithPercent(width, 100) - PADDING * PADDING_MONITOR) * data.labels.length,
              width:
                (calculateWithPercent(width, 100) - PADDING * PADDING_MONITOR) / data.labels.length,
            },
          ]}>
          <Text style={styles.labelValue}>{_.value}</Text>
          <Text style={styles.labelLabel}>{_.label}</Text>
        </View>
      ))}
    </View>
  );

  const _renderChartLines = () => (
    <>
      <View
        style={[
          styles.lineHider,
          { top: calculateWithPercent(height, ContainerSizes.HEADER) + 20, left: PADDING - 5 },
        ]}
      />
      <View
        style={[
          styles.lineHider,
          {
            top: calculateWithPercent(height, ContainerSizes.HEADER + ContainerSizes.BODY) + 15,
            left: calculateWithPercent(width, 97),
          },
        ]}
      />
      <View
        style={[styles.chartLines, { height: calculateWithPercent(height, ContainerSizes.BODY) }]}>
        {_renderBars()}
      </View>
    </>
  );
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={{ height: calculateWithPercent(height, ContainerSizes.HEADER) }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>

      {_renderChartLines()}
      {_renderLabels()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    paddingLeft: PADDING,
    paddingTop: PADDING,
  },
  chartLines: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#e2e2e2',
    borderRadius: 5,
    width: '100%',
    height: '95%',
    justifyContent: 'flex-end',
  },
  labels: { flexDirection: 'row', justifyContent: 'space-around', paddingRight: 10 },
  labelWrapper: { flexDirection: 'column', alignItems: 'center', paddingTop: 2 },
  lineHider: { width: 10, height: 10, backgroundColor: '#fff', position: 'absolute', zIndex: 1 },
  labelValue: { color: '#d2d1d1', fontSize: 12, fontWeight: '600', lineHeight: 20 },
  labelLabel: { fontSize: 13, fontWeight: '400' },
  barChartWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 10,
    paddingHorizontal: 3,
  },
  chartBar: {
    position: 'relative',
    marginTop: 'auto',
    width: '80%',
    height: '100%',
    alignItems: 'center',
  },
  chartBarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  shadowContainer: {
    marginTop: 'auto',
    width: '98%',
    height: '95%',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  chartText: { position: 'absolute', top: -10, fontSize: 11, color: '#595959' },
  title: { fontSize: 18, fontWeight: '700' },
  subTitle: { fontSize: 13, color: '#828282', fontWeight: '600' },
});
