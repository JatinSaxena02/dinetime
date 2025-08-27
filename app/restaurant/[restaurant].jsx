import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Share } from "react-native";
import moment from "moment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import DatePickerComponent from "../../components/restaurant/DatePickerComponent";
import GuestPicker from "../../components/restaurant/GuestPicker";
import SelectSlot from "../../components/restaurant/SelectSlot";

const RestaurantDetail = () => {
  const { restaurant } = useLocalSearchParams();
  // State for setting Restaurant Data. //
  const [restaurantData, setRestaurantData] = useState({});
  // State for setting Carousel Data. //
  const [carouselData, setCarouselData] = useState({});
  // State for setting Slots Data. //
  const [slotsData, setSlotsData] = useState({});
  // // State for managing previous and next index. // //
  const [currentIndex, setCurrentIndex] = useState(0);
  //  // State for managing Selected Date data selected by user and number of guest.
  const [date, setDate] = useState(new Date());
  const [guestNo, setGuestNo] = useState(1);
  // // State for Storing User's selected slot // //
  const [selectedSlots, setSelectedSlots] = useState(null);
  //
  const flatListRef = useRef(null);

  // // Handling nextImage button of carousel section // //
  const nextImage = () => {
    if (currentIndex < carouselData[0]?.images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  //  // This will reset the currentIndex to zero when the last image is clicked and it loop back to first image. // //
  // if (currentIndex == carouselData[0]?.images.length - 1) {
  //   const nextIndex = 0;
  //   setCurrentIndex(nextIndex);
  //   flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  // }
  // };

  // // Handling prevImage button of carousel section. // //
  const prevImage = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const { width, height } = Dimensions.get("window");

  // // Getting Restaurant Data from Firebase. // //
  const getRestaurantData = async () => {
    try {
      // // Fetching restaurantDetail data // //
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant)
      );
      const restaurantResponse = await getDocs(restaurantQuery);

      if (restaurantResponse.empty) {
        console.log("No restaurant data found...");
        return;
      }
      for (const doc of restaurantResponse.docs) {
        const restaurantData = doc.data();
        // /* This will print restaurant data clicked by User*/
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // console.log("Restaurant Data", restaurantData);
        setRestaurantData(restaurantData); /* setting restaurant_Data */

        // // Fetching carousel data // //
        const carouselQuery = query(
          collection(db, "carouselImages"),
          where("res_id", "==", doc.ref)
        );
        const carouselResponse = await getDocs(carouselQuery);

        if (carouselResponse.empty) {
          console.log("No carousel data found...");
          return;
        }
        const carouselImages = carouselResponse.docs.map((doc) => doc.data());

        // /* This will log all the images associated with that particular Restaurant*/
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // console.log(carouselImages);

        setCarouselData(carouselImages); /* setting carousel_Data */

        // // Fetching slots data // //
        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.ref)
        );
        const slotsResponse = await getDocs(slotsQuery);

        if (slotsResponse.empty) {
          console.log("No data found...");
          return;
        }
        const slots = slotsResponse.docs.map((doc) => doc.data());
        // /* This will log all the available slots associated with that particular Restaurant*/
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // console.log(slots);
        return setSlotsData(slots[0]?.slot); /* setting slots_Data */
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  // // Creating Basic Structure of Carousel Item. // //
  const CarouselItem = ({ item }) => {
    return (
      <View
        className="relative overflow-hidden"
        style={{ width: width * 0.91, height: height * 0.3 }}
      >
        <Image
          resizeMode="cover"
          style={{ opacity: 0.8 }}
          className="h-full w-full rounded-[25px]"
          source={{ uri: item }}
        />
      </View>
    );
  };

  // // Create Functionality, which directly navigate you to restaurant address through google Maps. // //
  const handleLocation = async () => {
    const url = "https://maps.app.goo.gl/TEo1dFJgskq1XE5U6";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Error loading Location", url);
    }
  };

  // // Created Functionality, Through which you can share basic restaurant details to others through various social media platform. // //
  const handleShare = async () => {
    {
      try {
        const result = await Share.share({
          message: `🍽️ Name: ${restaurantData?.name}\n
📍 Address: ${restaurantData?.address}\n
⏰ Opening Time: ${restaurantData?.opening}\n
🕘 Closing Time: ${restaurantData?.closing}\n
👉 Check out this place to know more!`,
        });
        if (result.action === Share.sharedAction) {
          console.log("Restaurant Details Shared Successfully!!");
        }
      } catch (error) {
        console.error("Oops Something went wrong! Try Again", error);
      }
    }
  };

  // // Getting Local time and comparing it with Restaurant opening and closing time to toggle between open and closed.
  const getLocalTime = () => {
    const currentTime = moment();
    const openingTime = moment(restaurantData?.opening, "HH:mm");
    const closingTime = moment(restaurantData?.closing, "HH:mm");
    const isOpen = currentTime.isBetween(openingTime, closingTime);
    const isClosed = !isOpen;
    return { isOpen, isClosed };
  };
  const { isOpen, isClosed } = getLocalTime();

  useEffect(() => {
    getRestaurantData();
  }, []);
  // console.log(restaurantData, carouselData, slotsData);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F5EEF8",
      }}
    >
      <ScrollView className="h-full z-10" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["rgba(43, 43, 43, 0)", "#ffe6c2"]}
          style={{
            position: "absolute",
            top: 0,
            height: height * 0.52,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            width: "100%",
            zIndex: 0,
          }}
        />
        <View className="mt-3 mx-4 flex-row justify-between items-center max-w-[90%] gap-10">
          <Ionicons
            name="arrow-back"
            color="#8E44AD"
            size={25}
            onPress={() => router.push("/home")}
          />
          <Text className="text-[#000] text-xl flex-1 text-center font-semibold">
            {restaurant}
          </Text>
          <Ionicons
            onPress={handleShare}
            name="share-social"
            color="#8E44AD"
            size={25}
          />
        </View>
        <View
          className="overflow-hidden"
          style={{ borderRadius: 25, marginHorizontal: 16, marginTop: 10 }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 5,
              right: 5,
              padding: 5,
              backgroundColor: "#8E44AD",
              borderRadius: 50,
              zIndex: 10,
            }}
          >
            <Ionicons
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={
                currentIndex > 0 &&
                currentIndex === carouselData[0]?.images.length - 1
                  ? null
                  : nextImage
              }
              name="arrow-forward"
              size={25}
              color={
                currentIndex > 0 &&
                currentIndex === carouselData[0]?.images.length - 1
                  ? "gray"
                  : "white"
              }
            />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 5,
              left: 5,
              backgroundColor: "#8E44AD",
              padding: 5,
              borderRadius: 50,
              zIndex: 10,
            }}
          >
            <Ionicons
              onPress={currentIndex === 0 ? null : prevImage}
              name="arrow-back"
              size={25}
              color={currentIndex === 0 ? "grey" : "white"}
            />
          </View>
          <View
            style={{
              transform: [{ translateX: 50 }],
              position: "absolute",
            }}
            className="flex flex-row justify-center gap-1 items-center z-10 bottom-4 right-2/4"
          >
            {carouselData[0]?.images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 p-1 rounded-full ${index == currentIndex ? "bg-[#8E44AD] h-3 w-3" : "bg-white"}`}
              />
            ))}
          </View>
          <FlatList
            data={carouselData[0]?.images}
            ref={flatListRef}
            contentContainerStyle={{
              gap: 10,
            }}
            renderItem={CarouselItem}
            horizontal
            scrollEnabled={false}
          />
        </View>

        <View className="mt-4 px-5 w-full">
          <View className="flex-row justify-between items-center">
            <Octicons name="location" size={25} color="#8E44AD" />
            <Text className="text-gray-600 font-medium text-md flex-shrink pr-2 ml-2">
              {restaurantData?.address}
            </Text>

            <TouchableOpacity
              onPress={handleLocation}
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                boxShadow: "#fff",
                shadowRadius: 4,
                elevation: 4, // Android shadow
              }}
              className="flex-row items-center bg-[#2b2b2b] px-3 py-1 rounded-xl"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text className="text-white text-base ml-1">Open Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* This section is to show the opening and closing time of restaurant */}

        <View
          className="mt-2 rounded-[10px] rounded-b-[20px] py-3 mx-3 flex-row bg-[#fff]"
          style={{ width: width * 0.94 }}
        >
          <View className="px-2 justify-evenly items-center flex-row">
            <FontAwesome6 name="clock" size={25} color="#8E44AD" />
            <Text className="items-center text-gray-600 text-md font-medium ml-2">
              {restaurantData?.opening} - {restaurantData?.closing}
            </Text>
          </View>
          <View className="px-1 items-center flex-row ml-auto  border-2 rounded-[10px] border-[#8E44AD] gap-3 mr-2">
            <Text
              style={{
                color: isOpen ? "white" : null,
                backgroundColor: isOpen ? "green" : null,
                borderRadius: isOpen ? 7 : null,
              }}
              className="text-lg font-medium text-gray-600 my-1 px-2"
            >
              Open
            </Text>
            <Text
              style={{
                color: !isOpen ? "white" : null,
                backgroundColor: !isOpen ? "red" : null,
                borderRadius: !isOpen ? 7 : null,
              }}
              className="text-lg font-medium text-gray-600 my-1 px-2"
            >
              Closed
            </Text>
          </View>
        </View>

        {/* This section is to show the available Booking Date and no. of Guest */}
        <View className="mx-3 mt-6">
          <Text className="text-black font-bold text-[1.4rem] px-1">
            Select Booking Date and Total Guest
          </Text>
          <View
            className="mt-2 p-1 flex-col border-2 border-[#8E44AD] rounded-[10px]"
            style={{ width: width * 0.94 }}
          >
            <View className="flex-row flex-1 items-center gap-2 p-1">
              <MaterialIcons name="date-range" size={25} color="#8E44AD" />
              <Text className="text-black text-md font-medium">
                Select Booking Date
              </Text>
              <DatePickerComponent date={date} setDate={setDate} />
            </View>
            <View className="flex-row flex-1 items-center gap-2 p-1">
              <MaterialIcons name="people" size={25} color="#8E44AD" />
              <Text className="text-black text-md font-medium">
                Total Guest
              </Text>
              <GuestPicker guestNo={guestNo} setGuestNo={setGuestNo} />
            </View>
          </View>
        </View>

        {/* This section shows the available slotsfor that restaurant. */}
        <View className="flex-1">
          <SelectSlot
            date={date}
            guestNo={guestNo}
            slots={slotsData}
            selectedSlots={selectedSlots}
            setSelectedSlots={setSelectedSlots}
            restaurant={restaurant}
            address={restaurantData?.address}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantDetail;
