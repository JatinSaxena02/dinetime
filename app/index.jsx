import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import frame from "../assets/images/Frame.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "react-native";
import { useEffect, useState } from "react";

export default function Index() {
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUser(email);
      console.log("Getting Email from Index Page : ", email);
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className={`bg-[#F5EEF8]`}>
      <StatusBar barStyle={"dark-content"} backgroundColor={`#F5EEF8`} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 300, height: 300 }} />
          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="p-2 my-2 bg-[#C39BD3] text-black rounded-lg"
            >
              <Text className="text-xl font-medium text-center">Signup</Text>
            </TouchableOpacity>
            {/* It will check, if user has running session then it will show like "Already LoggedIn, Seems like you have already loggedIn or running session, Please Logout to continue as guest." otherwise it will redirect it to home screen. */}
            <TouchableOpacity
              onPress={() => {
                if (user) {
                  Alert.alert(
                    "Already LoggedIn",
                    "Seems like you have already loggedIn or running session, Please Logout to continue as guest.",
                    [{ text: "OK" }]
                  );
                } else {
                  router.push("/home");
                }
              }}
              className="p-2 my-2 border-[#C39BD3] border text-black rounded-lg"
            >
              <Text className="text-xl font-semibold text-center text-[#000]">
                Guest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/signin")}>
              <View className="flex flex-row items-center">
                <Text className="text-center text-base font-medium my-4 text-black">
                  Already a User?
                </Text>
                <Text className="text-[#8E44AD] underline m-2">SignIn</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1">
          <Image
            source={frame}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
