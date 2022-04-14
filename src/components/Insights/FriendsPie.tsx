import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { VictoryPie } from 'victory-native';

interface FriendsPie {
  friend: any;
}

const MALE_COLOR = '#6EE7E7';
const FEMALE_COLOR = '#8F00FF';

const FriendsPie: React.FC<FriendsPie> = ({ friend }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Gender Percentage</Text>
    <View style={styles.graphContainer}>
      <VictoryPie
        width={300}
        height={300}
        startAngle={360}
        endAngle={-360}
        labels={() => null}
        padAngle={5}
        innerRadius={90}
        data={friend.gender}
        colorScale={[FEMALE_COLOR, MALE_COLOR]}
        y={data => data.percent}
      />
    </View>
    {friend.gender.map((item: any) => (
      <View style={styles.genderContainer}>
        <View
          style={[
            styles.percentColor,
            { backgroundColor: item.gender === 'Male' ? MALE_COLOR : FEMALE_COLOR },
          ]}
        />
        <View style={styles.genderTextContainer}>
          <Text>{item.gender}</Text>
        </View>
        <Text style={styles.percentText}>{item.percent}%</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 21,
    paddingVertical: 24,
  },
  graphContainer: {
    flex: 1,
    alignItems: 'center',
  },
  genderContainer: {
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  genderTextContainer: {
    flex: 1,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#828282',
  },
  percentColor: {
    width: 26,
    height: 26,
    borderRadius: 3,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  totalSubText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#828282',
    marginTop: 8,
  },
});

export default FriendsPie;
