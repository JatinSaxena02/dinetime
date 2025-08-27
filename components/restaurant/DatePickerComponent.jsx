import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerComponent = ({ date, setDate }) => {
  const { width, height } = Dimensions.get("window");
  const [show, setshow] = useState(false);
  const handleDate = () => {
    setshow(true);
  };
  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setshow(false);
  };
  return (
    <View className="flex-row justify-end flex-1">
      <TouchableOpacity
        onPress={handleDate}
        className="flex-row rounded-[10px] bg-[#C39BD3] p-2"
      >
        {Platform.OS === "android" && (
          <Text className="text-black text-md font-medium">
            {date.toDateString()}
          </Text>
        )}
        {Platform.OS === "android" && show && (
          <DateTimePicker
            value={date}
            onChange={changeDate}
            mode="date"
            display="calender"
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calender"
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerComponent;
