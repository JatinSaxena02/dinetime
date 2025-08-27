import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const Search = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchRestaurants = async (text) => {
    if (!text.trim()) {
      setRestaurants([]);
      return;
    }
    try {
      setSearch(text);
      // Exact match search
      const q = query(
        collection(db, "restaurants"),
        where("name", ">=", text),
        where("name", "<=", text + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRestaurants(searchResults);
      setSearched(true);
    } catch (error) {
      console.log("Error searching:", error);
    }
  };

  const handleCancel = () => {
    setSearch("");
    setRestaurants([]);
    setSearched(false);
  };

  const Item = ({ name, image, address }) => (
    <TouchableOpacity onPress={() => router.push(`/restaurant/${name}`)}>
      <View className="bg-white p-3 m-2 rounded-lg shadow">
        <Image
          source={{ uri: image }}
          style={{ height: 120, borderRadius: 8 }}
        />
        <Text className="text-lg font-bold mt-2">{name}</Text>
        <Text className="text-gray-600">{address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-[#F5EEF8] h-full">
      {/* Header */}
      <View className="mt-5 flex-row mx-5 items-center">
        <Ionicons
          name="arrow-back"
          color="#8E44AD"
          size={25}
          onPress={() => router.push("/home")}
        />
        <View className="flex-1 items-center">
          <Text className="font-semibold text-3xl text-[#000] -ml-5">
            Search
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View
        className="mx-5 mt-8 flex-row items-center bg-white rounded-[10px] py-1 px-3"
        style={{
          elevation: 5,
          shadowColor: "#000",
        }}
      >
        <Ionicons name="search-sharp" size={24} color="#8E44AD" />
        <TextInput
          placeholder="Search restaurants..."
          className="flex-1 px-2 text-black text-lg"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={handleCancel} className="rounded-full">
          <MaterialIcons name="cancel" size={24} color="#8E44AD" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => searchRestaurants(search)}
          className="ml-2 rounded-full border-[#8E44AD] border-2"
        >
          <MaterialIcons name="arrow-right-alt" size={24} color="#8E44AD" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {restaurants.length > 0 ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item name={item.name} image={item.image} address={item.address} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : searched ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-2xl text-center text-gray-600">
            No restaurant Found! Search For another one.
          </Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-2xl text-center text-gray-600">
            Search Your Favourite Restaurant Here...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;
