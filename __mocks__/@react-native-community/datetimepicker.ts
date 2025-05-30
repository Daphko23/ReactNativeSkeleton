import {Platform} from 'react-native';

export type DateTimePickerEvent = {
  type: 'set' | 'dismissed';
  nativeEvent: {
    timestamp?: number;
  };
};

const DateTimePicker = Platform.select({
  ios: () => null,
  android: () => null,
  default: () => null,
});

export default DateTimePicker;
