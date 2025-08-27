import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";

import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Formik } from "formik";
import ProfileEditButtonvalidationSchema from "../../utils/profileEditButtonSchema";

const Profile = () => {
  const router = useRouter();
  // const auth = getAuth();
  const [user, setUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  // const [newEmail, setNewEmail] = useState(second);
  const [userEmail, setUserEmail] = useState("");
  // const [userName, setUserName] = useState("");
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // console.log(currentUser.email);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
      console.log("Getting Email from Profile Page ----> : ", email);
    };
    fetchUserEmail();
  }, []);

  const handleEditChanges = async (values, { resetForm }) => {
    setEditLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user found");
      }
      await updateDoc(doc(db, "users", currentUser.uid), {
        username: values.username,
        fullname: values.fullname,
        age: values.age,
        phone: values.phone,
      });

      // await AsyncStorage.multiSet(["username", "fullname", "age", "phone"]);
      // const data = await getDoc(doc(db, "users", currentUser.uid));
      // console.log(data.data());
      // console.log(updatedData.data());

      Alert.alert("Success", "Your Data updated Succesfully", [{ text: "OK" }]);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Oops!", "Failed to save changes. Please try again", [
        { text: "OK" },
      ]);
      setModalVisible(false);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndListen = async () => {
      // Fetch email from AsyncStorage
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);

      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Set up real-time listener for user data
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          const liveData = docSnap.data();
          setEditedUserData(liveData);
        }
      });

      return () => unsub(); // Cleanup listener on unmount
    };

    fetchAndListen();
  }, []);

  const handlelogOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(["userEmail", "userName"]);
      setUserEmail(null);
      router.push("/");
    } catch (error) {
      Alert.alert("Error Occured", "Error while loggin Out");
    }
  };

  const handlelogin = () => {
    router.push("/signin");
  };

  const handleUserAccountDelete = async () => {
    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
      return;
    } else {
      Alert.alert(
        "Confirm Account deletion",
        "Are you sure that you want to delete this account? This step is irreversible and can not be undone Are you sure?",
        [
          { text: "Cencel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // // Deleting Bookings related to sepecific user. // //
                const q = query(
                  collection(db, "bookings"),
                  where("email", "==", user.email)
                );

                const data = await getDocs(q);
                const deleteData = data.docs.map((item) =>
                  deleteDoc(doc(db, "bookings", item.id))
                );
                await Promise.all(deleteData);
                // // Deleting currentlylogged in User data/Profile data. // //
                await deleteDoc(doc(db, "users", user.uid));
                // // Deleting User form firebase auth. // //
                await deleteUser(user);
                // // Deleting currentlylogged in User email from AsyncStorage. // //
                await AsyncStorage.removeItem("userEmail");
                // // Navigating to Signup/Signin page. // //
                Alert.alert("Success", "Your Account has been deleted", [
                  { text: "OK" },
                ]);
                router.push("/");
              } catch (error) {
                Alert.alert("Error", "Error Deleteing Account");
                console.log(error);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F5EEF8",
        height: "100%",
      }}
    >
      <ScrollView className="h-full z-10" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["rgba(43, 43, 43, 0)", "#8E44AD"]}
          style={{
            position: "absolute",
            top: 0,
            height: height * 0.3,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            width: "100%",
            zIndex: 0,
          }}
        />
        <View className="mt-5 flex-row mx-5">
          <Ionicons
            name="arrow-back"
            color="#8E44AD"
            size={25}
            onPress={() => router.push("/home")}
          />
          <View className="flex-1 items-center">
            <Text className="font-semibold text-3xl text-black -ml-7">
              Account
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mx-5 mt-5">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            className="rounded-full border-[#8E44AD] border-2"
            style={{ width: 80, height: 80 }}
          />
          <View className="px-2">
            <Text className="text-xl font-bold text-white">
              Welcome!{" "}
              {editedUserData?.username ? editedUserData?.username : "..."}
            </Text>
            <Text className="text-lg font-semibold">
              {userEmail ? userEmail : "Guest"}
            </Text>
          </View>
        </View>
        <View
          style={{ shadowColor: "#000", elevation: 5 }}
          className="mx-4 mt-8 px-5 py-3 bg-[#fff] min-h-[400px] rounded-[10px] bottom-2"
        >
          {userEmail || user ? (
            <View className="mt-3">
              <Text className="text-black text-xl font-semibold">
                My Account Details
              </Text>
              <View className="flex-row gap-2 mt-4 items-center">
                <MaterialIcons name="people" size={24} color="#8E44AD" />
                <Text className="font-medium text-[#000] flex-[0.35]">
                  User name
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-[0.90] bg-[#8d8d8d] rounded-[5px]"
                >
                  <Text className="font-medium text-[#000] p-2">
                    {editedUserData?.username}
                  </Text>
                </ScrollView>
              </View>
              <View className="flex-row gap-2 mt-4 items-center">
                <Fontisto name="email" size={24} color="#8E44AD" />
                <Text className="font-medium text-[#000] flex-[0.35]">
                  Email
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-[0.90] bg-[#8d8d8d] rounded-[5px]"
                >
                  <Text className="font-medium text-[#000] p-2">
                    {userEmail}
                  </Text>
                </ScrollView>
              </View>

              <View className="mt-5">
                <Text className="text-black text-xl font-semibold">More</Text>
                <View className="flex-col mt-4">
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="flex-row gap-2 mb-4 items-center"
                  >
                    <Feather name="edit" size={24} color="#8E44AD" />
                    <Text className="font-medium text-black">Edit</Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                  >
                    <View className="flex-1 justify-center items-center rounded-[10px]">
                      <View className="bg-[#C39BD3] w-5/6 p-5 rounded-2xl">
                        <Text className="text-2xl font-bold">
                          Update Profile info..
                        </Text>
                        <Formik
                          enableReinitialize
                          initialValues={{
                            username: editedUserData?.username || "",
                            fullname: editedUserData?.fullname || "",
                            age: editedUserData?.age || "",
                            phone: editedUserData?.phone || "",
                          }}
                          validationSchema={ProfileEditButtonvalidationSchema}
                          onSubmit={handleEditChanges}
                        >
                          {({
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            handleSubmit,
                            errors,
                          }) => (
                            <View>
                              <Text className="text-[#000]">Username</Text>
                              <TextInput
                                className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                                onChangeText={handleChange("username")}
                                value={values.username}
                                onBlur={handleBlur("username")}
                                // editable={!signupLoading}
                              />
                              {touched.username && errors.username && (
                                <Text className="text-red-500 mt-1 text-sm">
                                  {errors.username}
                                </Text>
                              )}
                              <Text className="text-[#000]">Full name</Text>
                              <TextInput
                                className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                                onChangeText={handleChange("fullname")}
                                value={values.fullname}
                                onBlur={handleBlur("fullname")}
                                // editable={!signupLoading}
                              />
                              {touched.fullname && errors.fullname && (
                                <Text className="text-red-500 mt-1 text-sm">
                                  {errors.fullname}
                                </Text>
                              )}
                              <Text className="text-[#000]">Age</Text>
                              <TextInput
                                className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                                onChangeText={handleChange("age")}
                                value={values.age}
                                onBlur={handleBlur("age")}
                                // editable={!signupLoading}
                              />
                              {touched.age && errors.age && (
                                <Text className="text-red-500 mt-1 text-sm">
                                  {errors.age}
                                </Text>
                              )}
                              <Text className="text-[#000]">Phone number</Text>
                              <TextInput
                                className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                                onChangeText={handleChange("phone")}
                                value={values.phone}
                                onBlur={handleBlur("phone")}
                                // editable={!signupLoading}
                              />
                              {touched.phone && errors.phone && (
                                <Text className="text-red-500 mt-1 text-sm">
                                  {errors.phone}
                                </Text>
                              )}
                              {editLoading ? (
                                <ActivityIndicator
                                  animating
                                  color="#f49b33"
                                  size={40}
                                  style={{ marginTop: 8 }}
                                />
                              ) : (
                                <View>
                                  <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="my-2 rounded-lg mt-4"
                                  >
                                    <View className="bg-[#8E44AD] px-3 py-2 rounded-[7px]">
                                      <Text className="text-lg font-semibold text-center">
                                        Save Changes
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                  >
                                    <View className="bg-[#8E44AD] px-3 py-2 rounded-[7px]">
                                      <Text className="text-lg font-semibold text-center">
                                        Close
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          )}
                        </Formik>
                      </View>
                    </View>
                  </Modal>
                  <TouchableOpacity className="flex-row gap-2  mb-4 items-center">
                    <Ionicons
                      name="alert-circle-outline"
                      size={24}
                      color="#8E44AD"
                    />
                    <Text className="font-medium text-[#black]">
                      Help Center
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row gap-2 items-center"
                    onPress={handlelogOut}
                  >
                    <MaterialIcons name="logout" size={24} color="#8E44AD" />
                    <Text className="font-medium text-[#black]">Log Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mt-5">
                <Text className="text-white text-xl font-semibold">
                  Actions
                </Text>
                <View className="flex-col mt-4 border-2 border-red-700 rounded-[10px] bg-white">
                  <TouchableOpacity
                    onPress={handleUserAccountDelete}
                    className="flex-row items-center py-1 justify-center gap-2"
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={24}
                      color="red"
                    />
                    <Text className="font-medium text-[#cc0707]">
                      DELETE ACCOUNT
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <TouchableOpacity
                onPress={handlelogin}
                className="gap-2 flex-row bg-[#474747] rounded-[10px] px-5 py-3"
                style={{ shadowColor: "#000", elevation: 5 }}
              >
                <MaterialIcons name="login" size={24} color="#8E44AD" />
                <Text className="text-2xl font-bold text-white">Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
