import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const History = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // const db = getFirestore();
  const [loadBooking, setLoadBooking] = useState(true);
  const { width, height } = Dimensions.get("window");
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUser(email);
      console.log("Getting email from History Page : ", email);
    };
    fetchUser();
  }, []);

  const fetchBookedOrder = async () => {
    try {
      const bookingQuery = query(
        collection(db, "bookings"),
        where("email", "==", user)
      );

      const snapShots = await getDocs(bookingQuery);
      // console.log(snapShots);

      if (snapShots.empty) {
        console.log("No Booking data found...");
        setBookingData([]);
        return;
      }
      const data = snapShots.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // We can do this or we can use forEach to transform the firestore documents into Javascript objects.
      setBookingData(data);
    } catch (error) {
      console.error("Error Fetching data", error);
    } finally {
      setLoadBooking(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookedOrder();
  }, [user]);

  const BookingCard = ({ address, date, email, guest, name, slot }) => {
    const d = new Date(date);
    const newdate = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const newtime = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <View
        className="rounded-[10px] bg-white mx-5 mt-5 p-2"
        style={{ shadowColor: "#000", elevation: 5, width: width * 0.9 }}
      >
        <View className="flex-row gap-1 items-center">
          <MaterialIcons name="location-city" size={20} color="#8E44AD" />
          <Text className="text-gray-600 font-medium text-xl">{name}</Text>
        </View>
        <View className="flex-row gap-1 my-1 items-center">
          <MaterialIcons name="email" size={16} color="#8E44AD" />
          <Text className="text-gray-600 font-medium text-sm">{email}</Text>
        </View>
        <View className="flex-col  border-2 border-[#8E44AD] rounded-[10px]">
          <View className="flex-row">
            <View className="flex-col items-center flex-[40%]">
              <View className="flex-row gap-1 my-1 items-center">
                <Ionicons name="people" size={18} color="#8E44AD" />
                <Text className="text-gray-600 font-medium text-sm">
                  Total Guest
                </Text>
              </View>
              <Text className="text-sm -mt-2 font-semibold text-gray-600">
                {" "}
                {guest}
              </Text>
            </View>
            <View className="flex-col items-center flex-[40%]">
              <View className="flex-row gap-1 my-1 items-center">
                <Ionicons name="time-sharp" size={18} color="#8E44AD" />
                <Text className="text-gray-600 font-medium text-sm">
                  Slot Time
                </Text>
              </View>
              <Text className="text-sm -mt-2 font-semibold text-gray-600">
                {" "}
                {slot}
              </Text>
            </View>
          </View>
          <View className="flex-col flex-[80%] items-center">
            <View className="flex-row gap-1 my-1 items-center">
              <MaterialIcons name="date-range" size={18} color="#8E44AD" />
              <Text className="text-gray-600 font-medium text-sm">
                Date/Time of booking
              </Text>
            </View>
            <Text className="text-sm -mt-2 font-semibold text-gray-600">
              {newdate}, {newtime}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-1 my-1 items-center">
          <Ionicons name="location-sharp" size={18} color="#8E44AD" />
          <Text className="text-gray-600 font-medium text-md flex-wrap flex-1">
            Address - {address}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F5EEF8",
        height: "100%",
      }}
    >
      <View className="mt-5 flex-row mx-5">
        <Ionicons
          name="arrow-back"
          color="#8E44AD"
          size={25}
          onPress={() => router.push("/home")}
        />
        <View className="flex-1 items-center">
          <Text className="font-semibold text-3xl text-[#000] -ml-5">
            Booking History
          </Text>
        </View>
      </View>
      {loadBooking ? (
        <ActivityIndicator animating color="#8E44AD" size={40} />
      ) : user && bookingData.length > 0 ? (
        <FlatList
          data={bookingData}
          onRefresh={fetchBookedOrder}
          refreshing={loadBooking}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingCard
              name={item.name}
              address={item.address}
              slot={item.slot}
              guest={item.guest}
              email={item.email}
              date={item.date}
            />
          )}
        />
      ) : (
        <View className="justify-center items-center flex-1">
          <Text className="text-4xl text-black font-bold">
            No Booking found!!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;
