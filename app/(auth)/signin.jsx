import {
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
import validationSchema from "../../utils/authSchema";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
} from "firebase/auth";
import { doc, getDoc, getFirestore, where } from "firebase/firestore";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signin = () => {
  const router = useRouter();
  // const auth = getAuth();
  const [signinLoading, setSignInLoading] = useState(false);
  // const db = getFirestore();
  const handlesignin = async (values, { resetForm }) => {
    try {
      setSignInLoading(true);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        // console.log(userDoc.data());
        await AsyncStorage.setItem("userEmail", values.email);
        Alert.alert("Welcome Back!", "You logged in successfully.", [
          {
            text: "OK",
            onPress: () => {
              router.push("/home");
            },
          },
        ]);
      } else {
        console.log("No such data found");
      }
      resetForm(); // As we are using formik so we don't have to use our own states to clear the email and password after clicking signIn button instaed we can use resetForm() to reset form details.
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Login Failed!", "No account associated with this email.", [
          { text: "OK" },
        ]);
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Login failed!", "Please enter correct password", [
          { text: "OK" },
        ]);
      } else {
        Alert.alert(
          "Login Error",
          "SomeThing went wrong, Please try again later",
          [{ text: "OK" }]
        );
      }
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <SafeAreaView className={`bg-[#F5EEF8]`}>
      <StatusBar barStyle={"dark-content"} backgroundColor={`#F5EEF8`} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={logo} style={{ width: 200, height: 100 }} />
          <Text className="font-medium text-[#00] text-2xl mb-10 w-5/6">
            Welcome! Please enter your credentials to continue
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handlesignin}
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
                  <Text className="text-[#000]">Email</Text>
                  <TextInput
                    className="border border-slate-300 rounded px-2 text-[#000] mt-1"
                    onChangeText={handleChange("email")}
                    keyboardType="email-address"
                    value={values.email}
                    editable={!signinLoading}
                    onBlur={handleBlur("email")}
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
                    editable={!signinLoading}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-500 mt-1 text-sm">
                      {errors.password}
                    </Text>
                  )}
                  <TouchableOpacity
                    disabled={signinLoading}
                    onPress={handleSubmit}
                    className="p-2 my-2 bg-[#8E44AD] rounded-lg mt-6"
                  >
                    <Text className="text-xl font-semibold text-center text-white">
                      {signinLoading ? "Signing in" : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View>
              <TouchableOpacity
                disabled={signinLoading}
                onPress={() => router.push("/signup")}
              >
                <View className="flex flex-row items-center">
                  <Text className="text-center text-base font-medium my-4 text-black">
                    Don't have an Account?
                  </Text>
                  <Text className="text-[#8E44AD] underline m-2">SignUp</Text>
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

export default Signin;
