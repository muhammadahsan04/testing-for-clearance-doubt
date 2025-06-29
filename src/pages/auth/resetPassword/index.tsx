// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { GoChevronLeft } from "react-icons/go";
// import loginImage from "../../../assets/Group 1000002138.png";
// import forgotPassword from "../../../assets/forgotImage.png";
// import forgotPageBG from "../../../assets/forgotPageBG.png";
// import { FiEyeOff } from "react-icons/fi";
// import { AiTwotoneEye } from "react-icons/ai";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
// });

// const ResetPassword: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL; // Get API URL from env variables

//   const initialValues = {
//     email: "",
//   };

//   const handleSubmit = async (values: typeof initialValues) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       // Send request to backend
//       const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: values.email,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to process your request");
//       }

//       // Show success message
//       setSuccess(
//         data.message || "Password reset instructions sent to your email"
//       );

//     } catch (error) {
//       console.error("Forgot password error:", error);
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const backToLoginPage = () => {
//     navigate("/");
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
//       style={{
//         backgroundImage: `url(${forgotPageBG})`,
//       }}
//     >
//       <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl md:px-8 md:py-6 px-3 py-3">

//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Left Image Section */}
//           <div className="hidden md:flex md:w-xs flex-col items-center justify-center bg-white px-3 pt-8 pb-4">
//             <h2 className="text-center mb-4 text-[#056BB7] font-normal text-[54px] leading-[30px] tracking-normal Jomhuria-font">
//               Jewelry Stock
//             </h2>
//             <img
//               src={forgotPassword}
//               alt="Forgot Password Visual"
//               className="w-[200px] object-contain"
//             />
//           </div>

//           {/* Right Form Section */}
//           <div className="w-full md:w-lg md:px-0 px-3 Poppins-font flex justify-center flex-col">
//             <h2 className="text-center font-[600] text-[19px] sm:text-[21px] md:text-[32px] leading-[100%] tracking-[0%] mb-5 text-[#333333] ">
//               Create New password
//             </h2>
//             <p className="text-[13px] md:text-[15px] text-center mb-4 text-[#5C5C5C]">
//               Your previous password has been reseted. Please set a new password
//               of your account.
//             </p>

//             {/* Show error message if any */}
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
//                 {error}
//               </div>
//             )}

//             {/* Show success message if any */}
//             {success && (
//               <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center">
//                 {success}
//               </div>
//             )}

//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ values, handleChange }) => (
//                 <Form className="space-y-4 w-full">
//                   <div className="md:px-8 px-0">
//                     <label
//                       htmlFor="password"
//                       className="font-medium md:text-[14px] text-[13px]"
//                     >
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Field
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         placeholder="Enter password"
//                         value={password}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                           setPassword(e.target.value);
//                           handleChange(e);
//                         }}
//                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                       >
//                         {showPassword ? (
//                           <FiEyeOff size={18} />
//                         ) : (
//                           <AiTwotoneEye size={18} />
//                         )}
//                       </button>
//                     </div>
//                     <ErrorMessage
//                       name="password"
//                       component="div"
//                       className="text-red-500 text-sm mt-1"
//                     />
//                   </div>
//                   <div className="md:px-8 px-0">
//                     <label
//                       htmlFor="password"
//                       className="font-medium md:text-[14px] text-[13px]"
//                     >
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <Field
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="password"
//                         placeholder="Enter password"
//                         value={confirmPassword}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                           setConfirmPassword(e.target.value);
//                           handleChange(e);
//                         }}
//                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                       >
//                         {showConfirmPassword ? (
//                           <FiEyeOff size={18} />
//                         ) : (
//                           <AiTwotoneEye size={18} />
//                         )}
//                       </button>
//                     </div>
//                     <ErrorMessage
//                       name="confirm password"
//                       component="div"
//                       className="text-red-500 text-sm mt-1"
//                     />
//                   </div>
//                   <div className="md:px-8 px-0">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className={`w-full bg-[#056bb7] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 px-10 ${
//                         loading ? "opacity-70 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {loading ? "Processing..." : "Create Password"}
//                     </button>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import forgotPassword from "../../../assets/forgotImage.png";
import forgotPageBG from "../../../assets/forgotPageBG.png";
import { FiEyeOff } from "react-icons/fi";
import { AiTwotoneEye } from "react-icons/ai";

// Define validation schema
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  // Extract token from URL path
  const token = location.pathname.split("/reset-password/")[1];

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        throw new Error("Reset token is missing");
      }

      // Send request to backend
      const response = await fetch(
        `${API_URL}/api/abid-jewelry-ms/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Show success message
      setSuccess(data.message || "Password has been reset successfully");

      // Redirect to login page after a delay
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      if (error instanceof Error) {
        setError(error.message);
        console.log("gdfgdsfg");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const backToLoginPage = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${forgotPageBG})`,
      }}
    >
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl md:px-8 md:py-6 px-3 py-3">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Image Section */}
          <div className="hidden md:flex md:w-xs flex-col items-center justify-center bg-white px-3 pt-8 pb-4">
            <h2 className="text-center mb-4 text-[#056BB7] font-normal text-[54px] leading-[30px] tracking-normal Jomhuria-font">
              Jewelry Stock
            </h2>
            <img
              src={forgotPassword}
              alt="Reset Password Visual"
              className="w-[200px] object-contain"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-lg md:px-0 px-3 Poppins-font flex justify-center flex-col">
            <h2 className="text-center font-[600] text-[19px] sm:text-[21px] md:text-[32px] leading-[100%] tracking-[0%] mb-5 text-[#333333] ">
              Create New Password
            </h2>
            <p className="text-[13px] md:text-[15px] text-center mb-4 text-[#5C5C5C]">
              Your previous password has been reset. Please set a new password
              for your account.
            </p>

            {/* Show error message if any */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            {/* Show success message if any */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center">
                {success}
              </div>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange }) => (
                <Form className="space-y-4 w-full">
                  <div className="md:px-8 px-0">
                    <label
                      htmlFor="password"
                      className="font-medium md:text-[14px] text-[13px]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter password"
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
                  <div className="md:px-8 px-0">
                    <label
                      htmlFor="confirmPassword"
                      className="font-medium md:text-[14px] text-[13px]"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-[#333333] placeholder-[#757575]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <AiTwotoneEye size={18} />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="md:px-8 px-0">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-[#056bb7] text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 px-10 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Processing..." : "Create Password"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
