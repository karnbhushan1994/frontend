import React, { useRef, useState } from 'react';

import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import { Circle, Defs, G, Line, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';

import { ProfileViewsCountType } from 'types';

interface FriendTotal {
  profile: ProfileViewsCountType;
}

const ProfileViewChart: React.FC<FriendTotal> = ({ profile }) => {
  const axesSvg = { fontSize: 10, fill: 'grey' };
  // const verticalContentInset = { top: 10, bottom: 10 };
  const xAxisHeight = 30;

  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  );
  // const Decorator = ({ x, y, data }) =>
  //   data.map((value, index) => (
  //     <Circle
  //       key={index}
  //       cx={x(index)}
  //       cy={y(value)}
  //       r={4}
  //       stroke={'rgb(134, 65, 244)'}
  //       fill={'white'}
  //     />
  //   ));

  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const size = useRef(profile.distribution.values.length);

  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = useRef(
    PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,

      onPanResponderGrant: evt => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: evt => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    }),
  );

  const updatePosition = x => {
    const YAxisWidth = apx(130);
    const x0 = apx(0); // x0 position
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth; //xN position
    const xDistance = chartWidth / size.current; // The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    // console.log((x - x0) )

    // The selected coordinate x :
    // (x - x0)/ xDistance = value
    let value = ((x - x0) / xDistance).toFixed(0);

    if (value >= size.current - 1) {
      value = size.current - 1; // Out of chart range, automatic correction
    }

    setPositionX(Number(value));
  };

  const Tooltip = ({ x, y, ticks }) => {
    if (positionX < 0) {
      return null;
    }

    const date = profile.distribution.values[positionX];

    return (
      <G x={x(positionX)} key="tooltip">
        <G x={apx(10)} y={y(profile.distribution.values[positionX]) - apx(10)}>
          <SvgText x={apx(0)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={Math.max.apply(Math, ticks)}
            y2={0}
            stroke="#000"
            strokeWidth={apx(1)}
            strokeDasharray={[12, 3]}
          />
          <Circle
            cy={y(profile.distribution.values[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#000"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = { top: apx(65), bottom: apx(95) };

  return (
    <View style={styles.mainContainer}>
      <YAxis
        data={profile.distribution.values}
        style={styles.yAxis}
        contentInset={verticalContentInset}
        svg={axesSvg}
        numberOfTicks={4}
      />
      <View style={styles.container} {...panResponder.current.panHandlers}>
        <LineChart
          style={styles.lineChart}
          data={profile.distribution.values}
          contentInset={{ top: 20, bottom: 20, right: 30, left: 20 }}
          numberOfTicks={4}
          svg={{
            strokeWidth: 2,
            stroke: 'url(#gradient)',
          }}>
          <Grid />
          <Gradient />
          {/* <Decorator /> */}
          <Tooltip />
        </LineChart>
        <XAxis
          style={{ ...styles.xAxis, height: xAxisHeight }}
          data={profile.distribution.labels}
          formatLabel={(_, index) => profile.distribution.labels[index]}
          contentInset={{ left: 50, right: 50 }}
          svg={axesSvg}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 250,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    overflow: 'visible',
  },
  lineChart: {
    flex: 1,
    margin: 15,
    overflow: 'visible',
  },
  yAxis: { marginBottom: 10 },
  xAxis: {
    marginHorizontal: -10,
  },
});

export default ProfileViewChart;
