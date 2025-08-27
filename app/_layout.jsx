import { Stack } from "expo-router";
import "../global.css";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Text, StatusBar } from "react-native";

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenStarterPage, setHasSeenStarterPage] = useState(false);
  useEffect(() => {
    SystemNavigationBar.setNavigationColor("#ffffff", "dark");
  }, []);

  // useEffect(() => {
  //   const checkstarterpage = async () => {
  //     const seen = await AsyncStorage.getItem("hasSeenStarterPage");
  //     if (seen === "true") setHasSeenStarterPage(true);
  //   };
  //   checkstarterpage();
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const seen = await AsyncStorage.getItem("hasSeenStarterPage");
      if (seen === "true") setHasSeenStarterPage(true);
      const email = await AsyncStorage.getItem("userEmail");
      if (email) {
        setUser(email);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={`#F5EEF8`} />
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          // logged in user //
          <Stack.Screen name="(tabs)" />
        ) : hasSeenStarterPage ? (
          // not loggedin but seen satrter page //
          <Stack.Screen name="index" />
        ) : (
          // first time user -> shoe starter page //
          <Stack.Screen name="starterPage" />
        )}
      </Stack>
    </>
  );
}
