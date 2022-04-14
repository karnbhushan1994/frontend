import React, { useState } from 'react';

import moment from 'moment';
import {
  Modal,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { TaggDatePicker } from '../common';

interface BirthDatePickerProps extends TextInputProps {
  handleBDUpdate: (_: Date) => void;
  width?: number | string;
  date: Date | undefined;
  showPresetdate: boolean;
}

const BirthDatePicker = React.forwardRef((props: BirthDatePickerProps, ref: any) => {
  const getMaxDate = () => {
    const maxDate = moment().subtract(13, 'y').subtract(1, 'd');
    return maxDate.toDate();
  };
  const [date, setDate] = useState(props.date);
  const [hidden, setHidden] = useState(true);
  const [updated, setUpdated] = useState(false);
  const textColor = updated ? 'white' : '#ddd';
  const updateDate = (newDate: Date) => {
    props.handleBDUpdate(newDate);
    setDate(newDate);
    setUpdated(true);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setHidden(false);
        }}>
        <Text
          style={[styles.input, { width: props.width }, { color: textColor }]}
          ref={ref}
          {...props}>
          {(updated || props.showPresetdate) && date
            ? moment(date).format('MM-DD-YYYY')
            : 'Birthday'}
        </Text>
      </TouchableOpacity>
      <Modal visible={!hidden} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setHidden(true);
          }}>
          <View style={styles.bottomView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.buttonView}>
                  <Button
                    title="Done"
                    titleStyle={styles.doneButtonTitle}
                    buttonStyle={styles.doneButton}
                    onPress={() => {
                      setHidden(true);
                    }}
                  />
                </View>
                <TaggDatePicker
                  handleDateUpdate={updateDate}
                  maxDate={getMaxDate()}
                  textColor={'black'}
                  date={date}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 11,
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingTop: 8,
    fontWeight: '600',
    borderColor: '#fffdfd',
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 13,
  },
  modalView: {
    backgroundColor: 'rgb(202, 206, 212)',
    height: '29%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonView: {
    backgroundColor: 'rgb(247, 247, 247)',
    width: '100%',
    paddingRight: '2.5%',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  doneButtonTitle: {
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(19, 125, 250)',
  },
  doneButton: {
    backgroundColor: 'transparent',
  },
});

export default BirthDatePicker;
