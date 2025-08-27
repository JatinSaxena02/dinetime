import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

const GuestPicker = ({ guestNo, setGuestNo }) => {
  const { width, height } = Dimensions.get("window");

  const guestIncrement = () => {
    if (guestNo < 15) {
      const newValue = guestNo + 1;
      setGuestNo(newValue);
    }
  };

  const guestDecrement = () => {
    if (guestNo > 1) {
      const newValue = guestNo - 1;
      setGuestNo(newValue);
    }
  };

  return (
    <View className="flex-row items-center ml-auto">
      <View className="flex-row rounded-[10px] gap-3">
        <TouchableOpacity
          onPress={guestDecrement}
          className="bg-[#C39BD3] rounded-l-[5px]"
        >
          <Text className="text-black px-3.5 text-3xl font-medium">-</Text>
        </TouchableOpacity>
        <Text className="text-black px-1 text-xl font-medium py-1">
          {guestNo}
        </Text>

        <TouchableOpacity
          onPress={guestIncrement}
          className="bg-[#C39BD3] rounded-r-[5px]"
        >
          <Text className="text-black px-3.5 text-3xl font-medium">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuestPicker;
