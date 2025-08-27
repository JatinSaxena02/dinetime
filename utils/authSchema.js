import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  // username: Yup.string()
  //   .required("Username is required")
  //   .min(4, "Username must be atleast 4 character long"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 character long"),
});

export default validationSchema;
