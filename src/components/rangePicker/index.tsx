import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { icons } from 'assets/icons';
import { ProfileInsightsEnum } from 'types';

const rangeArray = [
  { range: ProfileInsightsEnum.Week, title: 'Last 7 days' },
  { range: ProfileInsightsEnum.DoubleWeek, title: 'Last 14 days' },
  { range: ProfileInsightsEnum.Month, title: 'Last 30 days' },
];

const getButtonText = (insights: ProfileInsightsEnum) => {
  let text = 'Last 7 days';
  if (insights === ProfileInsightsEnum.Month) {
    text = 'Last 30 days';
  } else if (insights === ProfileInsightsEnum.DoubleWeek) {
    text = 'Last 14 days';
  }
  return text;
};

const getActiveMenu = (insights: ProfileInsightsEnum, current: ProfileInsightsEnum) => {
  let style = {};
  if (insights === current) {
    style = styles.active;
  }
  return style;
};
const getActiveText = (insights: ProfileInsightsEnum, current: ProfileInsightsEnum) => {
  let style = {};
  if (insights === current) {
    style = styles.textWhite;
  }
  return style;
};

export const RangePicker = ({
  insights,
  changeInsights,
}: {
  insights: ProfileInsightsEnum;
  changeInsights: Function;
}) => {
  const [pickerOpened, setPickerOpened] = useState(false);
  const [range, setRange] = useState('');
  const updateInsights = (item: ProfileInsightsEnum) => {
    setPickerOpened(false);
    changeInsights(item);
  };

  const getRangeInDate = () => {
    const d = new Date();
    const currentDate = moment(d).format('MMM DD');
    const prev = d.setDate(d.getDate() - Number(insights));
    const prevDate = moment(prev).format('MMM DD');
    // console.log(currentDate, '-', prevDate);
    setRange(prevDate + ' - ' + currentDate);
  };

  useEffect(() => {
    getRangeInDate();
  }, [insights]);

  return (
    <View style={styles.container}>
      <View style={styles.toolBar}>
        <TouchableOpacity
          style={[styles.picker, pickerOpened ? styles.blueButton : {}]}
          onPress={() => setPickerOpened(!pickerOpened)}>
          <Text style={[pickerOpened ? styles.textWhite : {}]}>{getButtonText(insights)}</Text>
          <SvgXml xml={pickerOpened ? icons.ChevronUp : icons.ChevronDown} width={15} height={15} />
        </TouchableOpacity>
        <Text style={styles.rangeLabel}>{range}</Text>
      </View>
      {pickerOpened && (
        <View style={styles.menu}>
          {rangeArray.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => updateInsights(_.range)}
              style={[styles.menuItem, getActiveMenu(insights, _.range)]}>
              <Text style={getActiveText(insights, _.range)}>{_.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 5,
    marginBottom: 10,
    zIndex: 1,
  },
  toolBar: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  picker: {
    height: 35,
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#828282',
  },
  rangeLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  blueButton: {
    backgroundColor: '#698DD3',
    borderWidth: 0,
  },
  textWhite: {
    color: 'white',
  },
  menu: {
    height: 150,
    width: 142,
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 2,
    top: 40,
    left: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
  },
  menuItemText: {
    fontWeight: '500',
    fontSize: 13,
    fontFamily: 'SF Pro Text',
    letterSpacing: 0,
  },
  active: {
    backgroundColor: '#698DD3',
    color: 'white',
  },
});
