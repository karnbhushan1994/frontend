import React, { useState } from 'react';

import moment from 'moment';
import DatePicker from 'react-native-date-picker';

interface TaggDatePickerProps {
  handleDateUpdate: (_: Date) => void;
  maxDate: Date;
  textColor: string;
  date: Date | undefined;
}

const TaggDatePicker: React.FC<TaggDatePickerProps> = ({
  date: propsDate,
  maxDate,
  textColor,
  handleDateUpdate,
}) => {
  const [date, setDate] = useState(
    propsDate ? new Date(moment(propsDate).add(1, 'day').format('MM-DD-YYYY')) : undefined,
  );
  return (
    <DatePicker
      date={date ? date : maxDate}
      textColor={textColor}
      mode={'date'}
      maximumDate={maxDate}
      onDateChange={newDate => {
        setDate(newDate);
        handleDateUpdate(newDate);
      }}
    />
  );
};

export default TaggDatePicker;
