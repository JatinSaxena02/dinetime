import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import frame from "../../assets/images/Frame.png";
import { StatusBar } from "react-native";
import { Formik } from "formik";
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import validationSchema from "../../utils/authSchema";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signup = () => {
  const router = useRouter();
  // const auth = getAuth();
  const [signupLoading, setSignUpLoading] = useState(false);
  // const db = getFirestore();
  const handlesignup = async (values, { resetForm }) => {
    try {
      setSignUpLoading(true);
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;
      console.log("User Email from signup Page : ", user.email);

      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        createdAt: new Date(),
      });
      await AsyncStorage.setItem("userEmail", values.email);

      Alert.alert("Bang On!", "Account Created successfully!!", [
        {
          text: "OK",
          onPress: () => {
            router.push("/home");
          },
        },
      ]);
      resetForm(); // As we are using formik so we don't have to use our own states to clear the email and password after clicking signup button instaed we can use resetForm() to reset form details.
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "SignUp Failed!",
          "This emailId is already in use, Please use a different email.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "SignUp Error",
          "SomeThing went wrong, Please try again later",
          [{ text: "OK" }]
        );
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <SafeAreaView className={`bg-[#F5EEF8]`}>
      <StatusBar barStyle={"dark-content"} backgroundColor={`#F5EEF8`} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 200, height: 100 }} />
          <Text className="text-[#8E44AD] font-medium text-3xl mb-10">
            Let's get started
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handlesignup}
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
                  {/* <Text className="text-[#000]">Username</Text>
                  <TextInput
                    className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                    onChangeText={handleChange("username")}
                    keyboardType="username"
                    value={values.username}
                    onBlur={handleBlur("username")}
                    editable={!signupLoading}
                  />
                  {touched.username && errors.username && (
                    <Text className="text-red-500 mt-1 text-sm">
                      {errors.username}
                    </Text>
                  )} */}
                  <Text className="text-[#000]">Email</Text>
                  <TextInput
                    className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                    onChangeText={handleChange("email")}
                    keyboardType="email-address"
                    value={values.email}
                    onBlur={handleBlur("email")}
                    editable={!signupLoading}
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-500 mt-1 text-sm">
                      {errors.email}
                    </Text>
                  )}
                  <Text className="mt-4 text-[#000]">Password</Text>
                  <TextInput
                    className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                    onChangeText={handleChange("password")}
                    value={values.password}
                    onBlur={handleBlur("password")}
                    secureTextEntry
                    editable={!signupLoading}
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 mt-1 text-sm">
                      {errors.password}
                    </Text>
                  )}
                  {signupLoading ? (
                    <ActivityIndicator
                      animating
                      color="#000"
                      size={40}
                      style={{ marginTop: 8 }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="p-2 my-2 bg-[#8E44AD] rounded-lg mt-6"
                    >
                      <Text className="text-xl font-semibold text-center text-white">
                        Signup
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Formik>
            <View>
              <TouchableOpacity
                disabled={signupLoading}
                onPress={() => router.push("/signin")}
              >
                <View className="flex flex-row items-center">
                  <Text className="text-center text-base font-medium my-4 text-black">
                    Already a User?
                  </Text>
                  <Text className="text-[#8E44AD] underline m-2">SignIn</Text>
                </View>
              </TouchableOpacity>
            </View>
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
};

export default Signup;
