import {
  View,
  Text,
  ScrollView,
  Image,
  Platform,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import banner from "../../assets/images/homeBanner.png";
import logo from "../../assets/images/dinetimelogo.png";
import { BlurView } from "expo-blur";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Label } from "@react-navigation/elements";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width, height } = Dimensions.get("window");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      console.log("Getting email from Home page : ", email);
      if (!email) return "";
      setUser(email);
    };
    fetchUser();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const colRef = collection(db, "restaurants");
      /*
      NOTE ::==>> query selector is one of the method that firestore provide, it helps us to apply sort, filter and limit to the collection of data
      const q = query(colRef, where("seats", "==", 50));
      const items = await getDocs(q);
      */
      const items = await getDocs(colRef);
      const data = items.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // We can do this or we can use forEach to transform the firestore documents into Javascript objects.
      /*
      NOTE ::==>> We can use forEach also but on each item updation it re-renders, which is inefficient. But still if you want to use forEach you can create new arr, update or push all the value once and set state once outside the forEach loop, this will not create multiple re-renders.
      items.forEach((item) => {
        setRestaurants((prev) => [...prev, item.data()]);
      });
      */
      setRestaurants(data);
    } catch (error) {
      console.error("Error Fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const Item = ({ id, name, address, seats, opening, closing, image }) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${name}`)}
      style={{
        width: 230,
        backgroundColor: "white", // important for shadow to be visible
        borderRadius: 10,
        elevation: 5,
      }}
      className="rounded-[10px] mb-4 p-1 mt-2"
    >
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        className="p-4 rounded-[7px]"
        style={{ height: 130, width: "100%" }}
      />
      <Text className="text-black mt-1 font-bold text-xl">{name}</Text>
      <View className="flex-row flex items-center gap-3">
        <FontAwesome6 name="map-location" size={20} color="#8E44AD" />
        <Text className="text-gray-600 font-light text-sm flex-1">
          {address}
        </Text>
      </View>
      <View
        className="absolute right-2 mt-2  items-center justify-center rounded-2xl bg-white"
        style={{ height: 40, width: 60 }}
      >
        <Text className="text-black font-bold text-lg">Seats</Text>
        <Label
          style={{
            color: "#f49b33",
            fontStyle: "italic",
            marginTop: -7,
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          {seats}
        </Label>
      </View>
      <View className="flex justify-between items-center flex-row">
        <Text className="bg-[#C39BD3] p-2 rounded-2xl text-sm font-semibold">
          {`Opening-${opening}`}
        </Text>
        <Text className="bg-[#C39BD3] p-2 rounded-2xl text-sm font-semibold">
          {`Closing-${closing}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F5EEF8",
        height: "100%",
      }}
    >
      <View className="flex items-center">
        <View
          className="bg-[#fff] flex-row mt-3 rounded-lg justify-between items-center w-full mx-3 px-2"
          style={{ shadowColor: "#000", elevation: 5, width: width * 0.95 }}
        >
          <View className="flex flex-row sticky items-center gap-1">
            <Text
              style={{ paddingTop: Platform.OS === "ios" ? 10 : 9 }}
              className="text-black h-10"
            >
              Welcome To
            </Text>
            <View className="mt-2">
              <Image
                resizeMode="cover"
                source={logo}
                className="w-20 h-12 rounded-[10px]"
              />
            </View>
          </View>
          {user ? (
            <View className="flex-row items-center relative">
              <Ionicons name="person-circle" size={25} color="#8E44AD" />
              <Text className="text-black font-medium text-lg">
                Hii,
                {user
                  ? user.split("@")[0].length > 4
                    ? user.split("@")[0].slice(0, 4) + ".."
                    : user.split("@")[0]
                  : "..."}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                router.push("/signup");
              }}
              className="flex-row items-center gap-1 border-2 border-[#8E44AD] rounded-[10px] px-2 py-1"
            >
              <Ionicons name="person-circle" size={25} color="#8E44AD" />
              <Text className="text-black font-medium text-lg">Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="mt-2"
      >
        <ImageBackground
          source={banner}
          resizeMode="cover"
          className="h-52 items-center bg-[#8E44AD] mx-2 rounded-[7px]"
        >
          <View className="items-center h-full w-full justify-center">
            <BlurView
              intensity={Platform.OS == "android" ? 80 : 75}
              tint="systemChromeMaterialDark"
              className="w-5/6 overflow-hidden rounded-md items-center p-3"
            >
              <Text className="text-[#f0a550] text-xl font-semibold">
                Perfect Tables, Just a Tap Away.
              </Text>
            </BlurView>
          </View>
        </ImageBackground>

        <View className="flex mt-5 justify-center">
          <Text className="text-[#000] font-bold text-3xl ml-5">
            Special Discounts %
          </Text>

          {restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.id}
              horizontal
              contentContainerStyle={{ gap: 10, paddingHorizontal: 8 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Item
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  address={item.address}
                  seats={item.seats}
                  opening={item.opening}
                  closing={item.closing}
                />
              )}
            />
          ) : (
            <ActivityIndicator animating color="#8E44AD" size={40} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
