import { View, Text, TouchableOpacity, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const SelectSlot = ({
  date,
  guestNo,
  slots,
  selectedSlots,
  restaurant,
  address,
  setSelectedSlots,
}) => {
  const [slotVisible, setSlotVisible] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const handleVisibility = () => {
    setSlotVisible(true);
  };
  const handleSelectedSlot = (slot) => {
    let prevSlot = selectedSlots;

    if (prevSlot == slot) {
      setSelectedSlots(null);
    } else {
      setSelectedSlots(slot);
    }
    console.log(slot);
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    const userEmail = await AsyncStorage.getItem("userEmail");
    if (!userEmail) {
      Alert.alert(
        "Not Signed In",
        "Please Signin/Register first for Booking!!",
        [{ text: "OK" }]
      );
      setBookingLoading(false);
      return;
    }
    if (!date || !slots || !guestNo) {
      Alert.alert("Mandatory Fields are required");
      setBookingLoading(false);
      return;
    }
    if (userEmail) {
      try {
        const bookingData = await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlots,
          date: date.toISOString(),
          guest: guestNo,
          address: address,
          name: restaurant,
        });
        // // Just checking the actual data. // //
        const actualData = await getDoc(bookingData);
        // if (actualData.exists()) {
        //   console.log("###############");
        //   console.log("Booking Data:", actualData.data());
        //   console.log("###############");
        // } else {
        //   console.log("No data found!");
        // }
        alert("Booking done");
      } catch (error) {
        Alert.alert("Error Occured", "Something went wrong. Try Again later!!");
      } finally {
        setBookingLoading(false);
      }
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-1 mx-3 mt-5">
        <TouchableOpacity
          className="justify-center items-center bg-[#C39BD3] p-2 rounded-[5px]"
          onPress={handleVisibility}
        >
          <Text className="text-black font-medium text-xl">Find Slots</Text>
        </TouchableOpacity>
      </View>
      {slotVisible && (
        <View className="flex-row flex-wrap mt-4 justify-evenly mx-2 gap-2">
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              disabled={
                selectedSlots == slot || selectedSlots == null ? false : true
              }
              style={{ shadowColor: "#000", elevation: 5 }}
              onPress={() => handleSelectedSlot(slot)}
              className={`rounded-[5px] w-[30%] items-center py-2 ${slot == selectedSlots && selectedSlots != null ? "bg-[#8E44AD]" : "bg-[#F5EEF8]"} ${selectedSlots != null && slot != selectedSlots && "opacity-50"}`}
            >
              <Text
                className={`${slot == selectedSlots && "text-black"} font-medium text-[#474747] text-xl px-1`}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedSlots != null && (
        <View className="flex-1 mx-3 mt-4">
          <TouchableOpacity
            style={{ marginBottom: 50 }}
            disabled={bookingLoading}
            onPress={handleBooking}
            className="justify-center items-center bg-[#99df82] p-2 rounded-[5px]"
          >
            <Text className="text-black font-medium text-xl">
              {bookingLoading ? "Hold On!" : "Book Slot"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SelectSlot;
