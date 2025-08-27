import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Testing = () => {
  const router = useRouter();
  return (
    <View>
      <Text
        style={{
          shadowColor: "#ec4899",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 5,
        }}
        className="bg-pink-200 p-5 rounded-md shadow-sm"
      >
        Testing
      </Text>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text className="m-3 p-2 text-center text-white font-light text-xl rounded-md bg-slate-600 w-[30%]">
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Testing;
