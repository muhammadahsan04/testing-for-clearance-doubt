// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Navigate, useNavigate } from "react-router-dom";
// import { FiEyeOff } from "react-icons/fi";
// import { AiTwotoneEye } from "react-icons/ai";
// import loginImage from "../../../assets/Group 1000002138.png";
// import loginBG from "../../../assets/loginPageBG.png";
// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const LoginComponent: React.FC = () => {
//   const [redirectToDashboard, setRedirectToDashboard] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Professional form state tracking
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [keepLoggedIn, setKeepLoggedIn] = useState(false);

//   const initialValues = {
//     email: "",
//     password: "",
//     keepLoggedIn: false,
//   };

//   const handleSubmit = (values: typeof initialValues) => {
//     console.log("Form Data:", values);
//     console.log(email, password, keepLoggedIn);

//     setRedirectToDashboard(true);
//   };

//   if (redirectToDashboard) {
//     return <Navigate to="/dashboard" />;
//   }
//   const navigate = useNavigate();
//   const fogotPassword = () => {
//     navigate("/forgot-password");
//   };
//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
//       style={{
//         backgroundImage: `url(${loginBG})`, // Use the imported image here
//       }}
//     >
//       <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl py-6">
//         {/* Left Image Section */}
//         <div className="hidden md:flex md:w-xs flex-col items-center justify-center bg-white p-6">
//           <h2 className="text-center mb-6 text-[#056BB7] font-normal text-[54px] leading-[30px] tracking-normal Jomhuria-font">
//             Jewelry Stock
//           </h2>
//           <img
//             src={loginImage}
//             alt="Login Visual"
//             className="w-full max-w-sm object-contain"
//           />
//         </div>

//         {/* Right Form Section */}
//         <div className="w-full md:w-lg p-8">
//           <h2 className="text-center font-[600] text-[32px] leading-[100%] tracking-[0%] font-poppins mb-6 text-[#333333] Poppins-font">
//             Welcome Back
//           </h2>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, handleChange }) => (
//               <Form className="space-y-4">
//                 <div>
//                   <Field
//                     type="email"
//                     name="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setEmail(e.target.value);
//                       handleChange(e);
//                     }}
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>

//                 <div>
//                   <div className="relative">
//                     <Field
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         setPassword(e.target.value);
//                         handleChange(e);
//                       }}
//                       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                     >
//                       {showPassword ? (
//                         <FiEyeOff size={18} />
//                       ) : (
//                         <AiTwotoneEye size={18} />
//                       )}
//                     </button>
//                   </div>
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center cursor-pointer text-sm text-[#333333]">
//                     <Field
//                       type="checkbox"
//                       name="keepLoggedIn"
//                       checked={keepLoggedIn}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         setKeepLoggedIn(e.target.checked);
//                         handleChange(e);
//                       }}
//                       className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm accent-blue-600 !select-none"
//                     />
//                     Keep me logged in
//                   </label>
//                   <span
//                     onClick={fogotPassword}
//                     className="underline Poppins-font cursor-pointer text-sm text-[#333333]"
//                   >
//                     Forgot Password?
//                   </span>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-[#056bb7] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//                 >
//                   Log In
//                 </button>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;

// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Navigate, useNavigate } from "react-router-dom";
// import { FiEyeOff } from "react-icons/fi";
// import { AiTwotoneEye } from "react-icons/ai";
// import loginImage from "../../../assets/Group 1000002138.png";
// import loginBG from "../../../assets/loginPageBG.png";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const LoginComponent: React.FC = () => {
//   const [redirectToDashboard, setRedirectToDashboard] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   // Professional form state tracking
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [keepLoggedIn, setKeepLoggedIn] = useState(false);

//   const navigate = useNavigate();
//   console.log("env", VITE_BASE_URL);
//   const loginUser = async (email: string, password: string) => {
//     const response = await axios.post(`${API_URL}/login`, {
//       email,
//       password,
//     });
//     return response.data; // usually includes user data + token
//   };
//   const initialValues = {
//     email: "",
//     password: "",
//     keepLoggedIn: false,
//   };

//   // Use useEffect to handle the redirection
//   useEffect(() => {
//     if (redirectToDashboard) {
//       navigate("/dashboard");
//     }
//   }, [redirectToDashboard, navigate]);

//   const handleSubmit = (values: typeof initialValues) => {
//     console.log("Form Data:", values);
//     console.log(email, password, keepLoggedIn);

//     // Instead of using Navigate component, use the navigate function directly
//     navigate("/dashboard");

//     // Or if you want to keep the redirectToDashboard state:
//     // setRedirectToDashboard(true);
//   };

//   const fogotPassword = () => {
//     navigate("/forgot-password");
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
//       style={{
//         backgroundImage: `url(${loginBG})`, // Use the imported image here
//       }}
//     >
//       <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col justify-center md:flex-row w-full max-w-4xl py-3 md:py-6">
//         {/* Left Image Section */}
//         <div className="hidden md:flex md:w-xs flex-col items-center justify-center bg-white p-6">
//           <h2 className="text-center mb-6 text-[#056BB7] font-normal text-[54px] leading-[30px] tracking-normal Jomhuria-font">
//             Jewelry Stock
//           </h2>
//           <img
//             src={loginImage}
//             alt="Login Visual"
//             className="w-full max-w-sm object-contain"
//           />
//         </div>
//         {/* Right Form Section */}
//         <div className="w-full md:w-lg md:p-8 p-4">
//           <h2 className="text-center font-[600] text-[19px] sm:text-[21px] md:text-[32px] leading-[100%] tracking-[0%] font-poppins mb-6 text-[#333333] Poppins-font">
//             Welcome Back
//           </h2>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, handleChange }) => (
//               <Form className="space-y-4">
//                 <div>
//                   <Field
//                     type="email"
//                     name="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setEmail(e.target.value);
//                       handleChange(e);
//                     }}
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//                 <div>
//                   <div className="relative">
//                     <Field
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         setPassword(e.target.value);
//                         handleChange(e);
//                       }}
//                       className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                     >
//                       {showPassword ? (
//                         <FiEyeOff size={18} />
//                       ) : (
//                         <AiTwotoneEye size={18} />
//                       )}
//                     </button>
//                   </div>
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="text-red-500 text-sm mt-1"
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center cursor-pointer text-sm text-[#333333]">
//                     <Field
//                       type="checkbox"
//                       name="keepLoggedIn"
//                       checked={keepLoggedIn}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         setKeepLoggedIn(e.target.checked);
//                         handleChange(e);
//                       }}
//                       className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm accent-blue-600 !select-none"
//                     />
//                     Keep me logged in
//                   </label>
//                   <span
//                     onClick={fogotPassword}
//                     className="underline Poppins-font cursor-pointer text-sm text-[#333333]"
//                   >
//                     Forgot Password?
//                   </span>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-[#056bb7] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//                 >
//                   Log In
//                 </button>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FiEyeOff } from "react-icons/fi";
import { AiTwotoneEye } from "react-icons/ai";
import axios from "axios"; // Add this import
import loginImage from "../../../assets/Group 1000002138.png";
import loginBG from "../../../assets/loginPageBG.png";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginComponent: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL; // Correct way to access env variables in Vite

  const initialValues = {
    email: "",
    password: "",
    keepLoggedIn: false,
  };

  // const loginUser = async (email: string, password: string) => {
  //   try {
  //     console.log("login", email, password);
  //     setLoading(true);
  //     setError("");

  //     const response = await fetch(`${API_URL}/api/abid-jewelry-ms/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(
  //         errorData.message || `Login failed with status: ${response.status}`
  //       );
  //     }

  //     const data = await response.json();
  //     console.log("response", data.data);

  //     // Store token in localStorage or sessionStorage based on keepLoggedIn
  //     const storage = keepLoggedIn ? localStorage : sessionStorage;
  //     storage.setItem("token", data.data.token);
  //     storage.setItem("user", JSON.stringify(data.data.user));
  //     storage.setItem("userId", JSON.stringify(data.data.user._id));

  //     return data;
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error("Network error. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Modify the login function to store permissions
  const loginUser = async (email: string, password: string) => {
    try {
      console.log("login", email, password);
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/abid-jewelry-ms/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Login failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("response", data.data);

      // Store token in localStorage or sessionStorage based on keepLoggedIn
      const storage = keepLoggedIn ? localStorage : sessionStorage;
      storage.setItem("token", data.data.token);
      storage.setItem("user", JSON.stringify(data.data.user));
      storage.setItem("userId", JSON.stringify(data.data.user._id));

      // Store user role
      if (data.data.user.role) {
        storage.setItem("role", data.data.user.role.name);

        // Fetch permissions for this role
        if (data.data.user.role._id) {
          try {
            console.log("zxcv", data.data.user.role._id);
            const permissionsResponse = await fetch(
              `${API_URL}/api/abid-jewelry-ms/permission?roleId=${data.data.user.role._id}`,
              {
                headers: {
                  "x-access-token": data.data.token,
                  "Content-Type": "application/json",
                },
              }
            );

            if (permissionsResponse.ok) {
              const permissionsData = await permissionsResponse.json();
              if (
                permissionsData.success &&
                permissionsData.data &&
                Array.isArray(permissionsData.data)
              ) {
                // Find the permission object for this role
                const rolePermission = permissionsData.data.find(
                  (perm: any) =>
                    perm.roleId &&
                    (typeof perm.roleId === "string"
                      ? perm.roleId === data.data.user.role._id
                      : perm.roleId._id === data.data.user.role._id)
                );

                if (rolePermission) {
                  storage.setItem(
                    "permissions",
                    JSON.stringify(rolePermission)
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error fetching permissions:", error);
          }
        }
      }

      // Navigate to dashboard after successful login
      navigate("/dashboard");
      return data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await loginUser(values.email, values.password);
      // navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const fogotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${loginBG})`,
      }}
    >
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col justify-center md:flex-row w-full max-w-4xl py-3 md:py-6">
        {/* Left Image Section */}
        <div className="hidden md:flex md:w-xs flex-col items-center justify-center bg-white p-6">
          <h2 className="text-center mb-6 text-[#056BB7] font-normal text-[54px] leading-[30px] tracking-normal Jomhuria-font">
            Jewelry Stock
          </h2>
          <img
            src={loginImage}
            alt="Login Visual"
            className="w-full max-w-sm object-contain"
          />

          {/* <img
            src={loginImage}
            alt="Login Visual"
            className="w-full max-w-sm object-contain select-none"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          /> */}
        </div>
        {/* Right Form Section */}
        <div className="w-full md:w-lg md:p-8 p-4">
          <h2 className="text-center font-[600] text-[19px] sm:text-[21px] md:text-[32px] leading-[100%] tracking-[0%] font-poppins mb-6 text-[#333333] Poppins-font">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      handleChange(e);
                    }}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                        handleChange(e);
                      }}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <AiTwotoneEye size={18} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer text-sm text-[#333333]">
                    <Field
                      type="checkbox"
                      name="keepLoggedIn"
                      checked={keepLoggedIn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setKeepLoggedIn(e.target.checked);
                        handleChange(e);
                      }}
                      className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm accent-blue-600 !select-none"
                    />
                    Keep me logged in
                  </label>
                  <span
                    onClick={fogotPassword}
                    className="underline Poppins-font cursor-pointer text-sm text-[#333333]"
                  >
                    Forgot Password?
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#056bb7] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
