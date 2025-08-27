import * as Yup from "yup";

const ProfileEditButtonvalidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be atleast 4 character long"),
  fullname: Yup.string().required("Full name is required"),
  age: Yup.string().required("Age is required"),
  phone: Yup.string()
    .required("Phone no. is required")
    .matches(/^[0-9]+$/, "Phone no. must be digit")
    .min(10, "Phone no. must be atleast 10 digits long."),
});

export default ProfileEditButtonvalidationSchema;
