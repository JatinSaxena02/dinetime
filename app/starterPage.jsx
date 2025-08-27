import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import logo from "../assets/images/dinetimelogo.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Button } from "react-native";
// import { upload } from "../config/bulkUpload";

const starterPage = () => {
  const router = useRouter();
  const handlegetStarted = async () => {
    await AsyncStorage.setItem("hasSeenStarterPage", "true");
    router.replace("/");
  };
  return (
    <SafeAreaView className={`bg-[#F5EEF8]`}>
      <StatusBar barStyle={"dark-content"} backgroundColor={`#F5EEF8`} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-3/4">
          <View className="flex items-center">
            <Image source={logo} className="w-5/6" resizeMode="contain" />
          </View>
        </View>

        <View className="items-center w-full">
          <Text className="mb-10 font-medium text-xl text-black">
            Your Table, On Time – Every Time.
          </Text>
          <TouchableOpacity
            onPress={handlegetStarted}
            className="w-5/6 bg-[#8E44AD] rounded"
          >
            <View className="p-2 items-center">
              <Text className="text-white  m-2 font-medium text-xl">
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
          {/* <Button title="upload" onPress={upload} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default starterPage;
