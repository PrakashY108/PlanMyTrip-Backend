import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name can't be more than 50 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .max(100, "Email can't be more than 100 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password can't be more than 20 characters"),

  phone: Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  role: Yup.string()
    .oneOf(["user", "driver", "admin"], "Invalid role")
    .optional(),

  token: Yup.string().optional(),
});

export const resetPasswordSchema = Yup.object()
  .shape({
    email: Yup.string()
      .email("Invalid email format")
      .max(100, "Email can't be more than 100 characters"),

    phone: Yup.string().matches(
      /^[0-9]{10}$/,
      "Phone number must be 10 digits"
    ),
  })
  .test(
    "at-least-one",
    "Either email or password is required",
    function (value) {
      return !!(value.email || value.phone);
    }
  );
  export const verifyOtpSchema = Yup.object().shape({
    user_id: Yup.number()
      .typeError('User ID must be a number')
      .required('User ID is required'),
  
    otp: Yup.string()
      .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
      .required('OTP is required'),
  
    type: Yup.string()
      .oneOf(['register', 'reset'], 'Type must be either register or reset')
      .required('Type is required'),
  });
  

