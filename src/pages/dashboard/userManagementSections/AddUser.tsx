// import React, { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import { DropImage } from "../../../components/UploadPicture";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to check permissions
// const hasPermission = (module: string, action: string) => {
//   try {
//     let permissionsStr = localStorage.getItem("permissions")
//     if (!permissionsStr) {
//       permissionsStr = sessionStorage.getItem("permissions")
//     }

//     if (!permissionsStr) return false

//     const permissions = JSON.parse(permissionsStr)

//     // Check if user has all permissions
//     if (permissions.allPermissions || permissions.allPagesAccess) return true

//     const page = permissions.pages?.find((p: any) => p.name === module)
//     if (!page) return false

//     switch (action.toLowerCase()) {
//       case 'create':
//         return page.create
//       case 'read':
//         return page.read
//       case 'update':
//         return page.update
//       case 'delete':
//         return page.delete
//       default:
//         return false
//     }
//   } catch (error) {
//     console.error("Error checking permissions:", error)
//     return false
//   }
// }

// // Helper function to get user role
// const getUserRole = () => {
//   let role = localStorage.getItem("role")
//   if (!role) {
//     role = sessionStorage.getItem("role")
//   }
//   return role
// }

// interface Role {
//   _id: string;
//   name: string;
//   description: string;
//   roleImage: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   nameNormalized?: string;
// }

// interface AddUserProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
// }

// const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [password, setPassword] = useState<string>("");
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRoleName, setSelectedRoleName] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     status: "active",
//   });

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Check permissions
//   const userRole = getUserRole()
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

//   // Fetch roles when component mounts
//   useEffect(() => {
//     // Check permissions on component mount
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users")
//       // navigate("/dashboard/user-management/overall", { replace: true })
//       return
//     }

//     fetchRoles();
//   }, [navigate, isAdmin]);

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.success) {
//         setRoles(response.data.roles);
//         console.log("Roles fetched successfully:", response.data.roles);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       toast.error("Failed to fetch roles");
//     }
//   };

//   // Function to handle role selection
//   const handleRoleSelect = async (name: string) => {
//     // Find the role object by name
//     const selectedRole = roles.find((role) => role.name === name);

//     if (selectedRole) {
//       const roleId = selectedRole._id;
//       setSelectedRoleName(name);

//       try {
//         const token = getAuthToken();

//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }

//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.data.success) {
//           console.log("Role details fetched:", response.data.role);

//           // Update form data with the role ID
//           setFormData((prev) => ({
//             ...prev,
//             role: roleId,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching role details:", error);
//         toast.error("Failed to fetch role details");
//       }
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }

//     setPassword(generatedPassword);
//     setFormData((prev) => ({
//       ...prev,
//       password: generatedPassword,
//       confirmPassword: generatedPassword,
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       status: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.firstName.trim()) {
//       toast.error("First name is required");
//       return false;
//     }
//     if (!formData.lastName.trim()) {
//       toast.error("Last name is required");
//       return false;
//     }
//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       toast.error("Phone number is required");
//       return false;
//     }
//     if (!formData.password.trim()) {
//       toast.error("Password is required");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }
//     if (!formData.role) {
//       toast.error("Please select a role");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check permissions before submitting
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData();

//       // Add all form fields to FormData
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profileImage", uploadedFile);
//       }

//       console.log("Sending form data:", Object.fromEntries(formDataToSend));

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/addUser`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("User added successfully:", response.data);
//         toast.success("User added successfully!");

//         // Reset form and uploaded file
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//           role: "",
//           status: "active",
//         });
//         setPassword("");
//         setUploadedFile(null);

//         // Navigate back to user management
//         navigate("/dashboard/user-management/overall", { replace: true });
//       } else {
//         toast.error(response.data.message || "Failed to add user");
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "An error occurred while adding the user";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/user-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           User Management
//         </span>{" "}
//         / <span className="text-black">Add Users</span>
//       </h2>
//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//           Add Users
//         </p>

//         <form
//           className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
//           onSubmit={handleSubmit}
//         >
//           {/* Left Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="firstName" className="mb-1">
//                 First Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="firstName"
//                 placeholder="First Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//               // required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="lastName" className="mb-1">
//                 Last Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="email" className="mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="phone" className="mb-1">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="+1 234 567 8900"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="role" className="mb-1">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <Dropdown
//                 options={roles.map((role) => role.name)}
//                 defaultValue={selectedRoleName || "Select Role"}
//                 onSelect={handleRoleSelect}
//               />
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="password" className="mb-1">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="flex gap-2">
//                 <Input
//                   name="password"
//                   type="password"
//                   placeholder="Password"
//                   className="outline-none focus:outline-none flex-1"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                 />
//                 <Button
//                   text="Generate"
//                   type="button"
//                   onClick={generatePassword}
//                   className="px-4 !bg-[#056BB7] border-none text-white whitespace-nowrap"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="confirmPassword" className="mb-1">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1">Status</label>
//               <div className="flex gap-4 mt-1">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={formData.status === "active"}
//                     onChange={handleStatusChange}
//                     className="form-radio h-4 w-4 text-blue-600"
//                   />
//                   <span>Active</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={formData.status === "inactive"}
//                     onChange={handleStatusChange}
//                     className="form-radio h-4 w-4 text-blue-600"
//                   />
//                   <span>Inactive</span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1">Upload Profile Image</label>
//               <DropImage
//                 uploadedFile={uploadedFile}
//                 setUploadedFile={setUploadedFile}
//                 className="w-full"
//               />
//             </div>

//             <div className="flex justify-end gap-4 Poppins-font font-medium mt-8">
//               <Button
//                 text="Cancel"
//                 type="button"
//                 onClick={() =>
//                   navigate("/dashboard/user-management/overall", {
//                     replace: true,
//                   })
//                 }
//                 className="px-6 !bg-[#F4F4F5] !border-none"
//               />
//               {(isAdmin || hasPermission("User Management", "create")) && (
//                 <Button
//                   text={loading ? "Adding..." : "Add User"}
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 !bg-[#056BB7] border-none text-white"
//                 />
//               )}

//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;

// import React, { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import { DropImage } from "../../../components/UploadPicture";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to check permissions
// const hasPermission = (module: string, action: string) => {
//   try {
//     let permissionsStr = localStorage.getItem("permissions")
//     if (!permissionsStr) {
//       permissionsStr = sessionStorage.getItem("permissions")
//     }

//     if (!permissionsStr) return false

//     const permissions = JSON.parse(permissionsStr)

//     // Check if user has all permissions
//     if (permissions.allPermissions || permissions.allPagesAccess) return true

//     const page = permissions.pages?.find((p: any) => p.name === module)
//     if (!page) return false

//     switch (action.toLowerCase()) {
//       case 'create':
//         return page.create
//       case 'read':
//         return page.read
//       case 'update':
//         return page.update
//       case 'delete':
//         return page.delete
//       default:
//         return false
//     }
//   } catch (error) {
//     console.error("Error checking permissions:", error)
//     return false
//   }
// }

// // Helper function to get user role
// const getUserRole = () => {
//   let role = localStorage.getItem("role")
//   if (!role) {
//     role = sessionStorage.getItem("role")
//   }
//   return role
// }

// interface Role {
//   _id: string;
//   name: string;
//   description: string;
//   roleImage: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   nameNormalized?: string;
// }

// interface AddUserProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
// }

// const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [password, setPassword] = useState<string>("");
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRoleName, setSelectedRoleName] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     status: "active",
//   });

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Check permissions
//   const userRole = getUserRole()
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

//   // Fetch roles when component mounts
//   useEffect(() => {
//     // Check permissions on component mount
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users")
//       // navigate("/dashboard/user-management/overall", { replace: true })
//       return
//     }

//     fetchRoles();
//   }, [navigate, isAdmin]);

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }
//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.data.success) {
//         setRoles(response.data.roles);
//         console.log("Roles fetched successfully:", response.data.roles);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       toast.error("Failed to fetch roles");
//     }
//   };

//   // Function to handle role selection
//   const handleRoleSelect = async (name: string) => {
//     // Find the role object by name
//     const selectedRole = roles.find((role) => role.name === name);
//     if (selectedRole) {
//       const roleId = selectedRole._id;
//       setSelectedRoleName(name);
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.data.success) {
//           console.log("Role details fetched:", response.data.role);
//           // Update form data with the role ID
//           setFormData((prev) => ({
//             ...prev,
//             role: roleId,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching role details:", error);
//         toast.error("Failed to fetch role details");
//       }
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }
//     setPassword(generatedPassword);
//     setFormData((prev) => ({
//       ...prev,
//       password: generatedPassword,
//       confirmPassword: generatedPassword,
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       status: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.firstName.trim()) {
//       toast.error("First name is required");
//       return false;
//     }
//     if (!formData.lastName.trim()) {
//       toast.error("Last name is required");
//       return false;
//     }
//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       toast.error("Phone number is required");
//       return false;
//     }
//     if (!formData.password.trim()) {
//       toast.error("Password is required");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }
//     if (!formData.role) {
//       toast.error("Please select a role");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check permissions before submitting
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData();

//       // Add all form fields to FormData except confirmPassword
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key !== "confirmPassword") {
//           formDataToSend.append(key, value);
//         }
//       });

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profileImage", uploadedFile);
//       }

//       console.log("Sending form data:", Object.fromEntries(formDataToSend));

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/addUser`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("User added successfully:", response.data);
//         toast.success("User added successfully!");
//         // Reset form and uploaded file
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//           role: "",
//           status: "active",
//         });
//         setPassword("");
//         setUploadedFile(null);
//         // Navigate back to user management
//         navigate("/dashboard/user-management/overall", { replace: true });
//       } else {
//         toast.error(response.data.message || "Failed to add user");
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "An error occurred while adding the user";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/user-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           User Management
//         </span>{" "}
//         / <span className="text-black">Add Users</span>
//       </h2>
//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//           Add Users
//         </p>

//         <form
//           className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
//           onSubmit={handleSubmit}
//         >
//           {/* Left Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="firstName" className="mb-1">
//                 First Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="firstName"
//                 placeholder="First Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="lastName" className="mb-1">
//                 Last Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col w-full">
//               <label htmlFor="password" className="mb-1 font-semibold text-sm">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
//                 <input
//                   type="text"
//                   id="password"
//                   name="password"
//                   placeholder="Enter Password"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     setFormData((prev) => ({
//                       ...prev,
//                       password: e.target.value,
//                     }));
//                   }}
//                   className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
//                   required
//                 />
//                 <Button
//                   onClick={generatePassword}
//                   className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
//                   text="Generate"
//                   type="button"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="confirmPassword" className="mb-1">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="role" className="mb-1">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <Dropdown
//                 options={roles.map((role) => role.name)}
//                 className="w-full"
//                 onSelect={handleRoleSelect}
//                 defaultValue={selectedRoleName || "Select Role"}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="email" className="mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="phone" className="mb-1">
//                 Phone No <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="+65 362783233"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex gap-2 flex-col">
//               <div>
//                 <span className="text-sm font-medium">Status</span>
//               </div>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
//                                 <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={formData.status === "active"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Active
//                 </label>
//                 <label className="flex items-center gap-2 text-sm border px-2 py-2 border-gray-200 rounded-md">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={formData.status === "inactive"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Inactive
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="" className="mb-1">
//                 Upload Image
//               </label>
//               <DropImage
//                 uploadedFile={uploadedFile}
//                 setUploadedFile={setUploadedFile}
//                 className="w-2/3 xl:w-2/3"
//               />
//               {uploadedFile && (
//                 <p className="text-sm text-green-600 mt-2">
//                   Image selected: {uploadedFile.name}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-end gap-4 Poppins-font font-medium mt-8">
//               <Button
//                 text="Back"
//                 type="button"
//                 onClick={() =>
//                   navigate("/dashboard/user-management/overall", {
//                     replace: true,
//                   })
//                 }
//                 className="px-6 !bg-[#F4F4F5] !border-none"
//               />
//               {/* Conditionally render Save button based on permissions */}
//               {(isAdmin || hasPermission("User Management", "create")) && (
//                 <Button
//                   text={loading ? "Saving..." : "Save"}
//                   type="submit"
//                   disabled={loading}
//                   className={`px-6 !bg-[#056BB7] border-none text-white ${
//                     loading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 />
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;

// import React, { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import { DropImage } from "../../../components/UploadPicture";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to check permissions
// const hasPermission = (module: string, action: string) => {
//   try {
//     let permissionsStr = localStorage.getItem("permissions");
//     if (!permissionsStr) {
//       permissionsStr = sessionStorage.getItem("permissions");
//     }

//     if (!permissionsStr) return false;

//     const permissions = JSON.parse(permissionsStr);

//     // Check if user has all permissions
//     if (permissions.allPermissions || permissions.allPagesAccess) return true;

//     const page = permissions.pages?.find((p: any) => p.name === module);
//     if (!page) return false;

//     switch (action.toLowerCase()) {
//       case "create":
//         return page.create;
//       case "read":
//         return page.read;
//       case "update":
//         return page.update;
//       case "delete":
//         return page.delete;
//       default:
//         return false;
//     }
//   } catch (error) {
//     console.error("Error checking permissions:", error);
//     return false;
//   }
// };

// // Helper function to get user role
// const getUserRole = () => {
//   let role = localStorage.getItem("role");
//   if (!role) {
//     role = sessionStorage.getItem("role");
//   }
//   return role;
// };

// interface Role {
//   _id: string;
//   name: string;
//   description: string;
//   roleImage: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   nameNormalized?: string;
// }

// interface AddUserProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
// }

// const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [password, setPassword] = useState<string>("");
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRoleName, setSelectedRoleName] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     status: "active",
//   });

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Check permissions
//   const userRole = getUserRole();
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

//   // Fetch roles when component mounts
//   useEffect(() => {
//     // Check permissions on component mount
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       // navigate("/dashboard/user-management/overall", { replace: true })
//       return;
//     }

//     fetchRoles();
//   }, [navigate, isAdmin]);

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }
//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.data.success) {
//         setRoles(response.data.roles);
//         console.log("Roles fetched successfully:", response.data.roles);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       toast.error("Failed to fetch roles");
//     }
//   };

//   // Function to handle role selection
//   const handleRoleSelect = async (name: string) => {
//     // Find the role object by name
//     const selectedRole = roles.find((role) => role.name === name);
//     if (selectedRole) {
//       const roleId = selectedRole._id;
//       setSelectedRoleName(name);
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.data.success) {
//           console.log("Role details fetched:", response.data.role);
//           // Update form data with the role ID
//           setFormData((prev) => ({
//             ...prev,
//             role: roleId,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching role details:", error);
//         toast.error("Failed to fetch role details");
//       }
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }
//     setPassword(generatedPassword);
//     setFormData((prev) => ({
//       ...prev,
//       password: generatedPassword,
//       confirmPassword: generatedPassword,
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       status: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.firstName.trim()) {
//       toast.error("First name is required");
//       return false;
//     }
//     if (!formData.lastName.trim()) {
//       toast.error("Last name is required");
//       return false;
//     }
//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       toast.error("Phone number is required");
//       return false;
//     }
//     if (!formData.password.trim()) {
//       toast.error("Password is required");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }
//     if (!formData.role) {
//       toast.error("Please select a role");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check permissions before submitting
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData();

//       // Add all form fields to FormData INCLUDING confirmPassword
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profileImage", uploadedFile);
//       }

//       console.log("Sending form data:", Object.fromEntries(formDataToSend));

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/addUser`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("User added successfully:", response.data);
//         toast.success("User added successfully!");
//         // Reset form and uploaded file
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//           role: "",
//           status: "active",
//         });
//         setPassword("");
//         setSelectedRoleName("");
//         setUploadedFile(null);
//         // Navigate back to user management
//         navigate("/dashboard/user-management/overall", { replace: true });
//       } else {
//         toast.error(response.data.message || "Failed to add user");
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "An error occurred while adding the user";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/user-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           User Management
//         </span>{" "}
//         / <span className="text-black">Add Users</span>
//       </h2>
//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//           Add Users
//         </p>

//         <form
//           className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
//           onSubmit={handleSubmit}
//         >
//           {/* Left Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="firstName" className="mb-1">
//                 First Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="firstName"
//                 placeholder="First Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="lastName" className="mb-1">
//                 Last Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col w-full">
//               <label htmlFor="password" className="mb-1 font-semibold text-sm">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
//                 <input
//                   type="text"
//                   id="password"
//                   name="password"
//                   placeholder="Enter Password"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     setFormData((prev) => ({
//                       ...prev,
//                       password: e.target.value,
//                     }));
//                   }}
//                   className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
//                   required
//                 />
//                 <Button
//                   onClick={generatePassword}
//                   className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
//                   text="Generate"
//                   type="button"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="confirmPassword" className="mb-1">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="role" className="mb-1">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <Dropdown
//                 options={roles.map((role) => role.name)}
//                 className="w-full"
//                 onSelect={handleRoleSelect}
//                 noResultsMessage="No roles found"
//                 defaultValue={selectedRoleName || "Select Role"}
//                 searchable={true} // Add this prop
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="email" className="mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="phone" className="mb-1">
//                 Phone No <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="+65 362783233"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex gap-2 flex-col">
//               <div>
//                 <span className="text-sm font-medium">Status</span>
//               </div>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={formData.status === "active"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Active
//                 </label>
//                 <label className="flex items-center gap-2 text-sm border px-2 py-2 border-gray-200 rounded-md">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={formData.status === "inactive"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Inactive
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="space-y-4 relative">
//             <div className="flex flex-col !mb-12 sm:mb-0">
//               <label htmlFor="" className="mb-1">
//                 Upload Image <span className="text-[11px]">(optional)</span>
//               </label>
//               <DropImage
//                 uploadedFile={uploadedFile}
//                 setUploadedFile={setUploadedFile}
//                 className="w-2/3 xl:w-2/3"
//               />
//               {uploadedFile && (
//                 <p className="text-sm text-green-600 mt-2">
//                   Image selected: {uploadedFile.name}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-end gap-4 Poppins-font font-medium mt-8 absolute bottom-0 w-full">
//               <Button
//                 text="Back"
//                 type="button"
//                 onClick={() =>
//                   navigate("/dashboard/user-management/overall", {
//                     replace: true,
//                   })
//                 }
//                 className="px-6 !bg-[#F4F4F5] !border-none"
//               />
//               {/* Conditionally render Save button based on permissions */}
//               {(isAdmin || hasPermission("User Management", "create")) && (
//                 <Button
//                   text={loading ? "Saving..." : "Save"}
//                   type="submit"
//                   disabled={loading}
//                   className={`px-6 !bg-[#056BB7] border-none text-white ${
//                     loading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 />
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;

// without number constraint
// import React, { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import { DropImage } from "../../../components/UploadPicture";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

// // Helper function to check permissions
// const hasPermission = (module: string, action: string) => {
//   try {
//     let permissionsStr = localStorage.getItem("permissions");
//     if (!permissionsStr) {
//       permissionsStr = sessionStorage.getItem("permissions");
//     }

//     if (!permissionsStr) return false;

//     const permissions = JSON.parse(permissionsStr);

//     // Check if user has all permissions
//     if (permissions.allPermissions || permissions.allPagesAccess) return true;

//     const page = permissions.pages?.find((p: any) => p.name === module);
//     if (!page) return false;

//     switch (action.toLowerCase()) {
//       case "create":
//         return page.create;
//       case "read":
//         return page.read;
//       case "update":
//         return page.update;
//       case "delete":
//         return page.delete;
//       default:
//         return false;
//     }
//   } catch (error) {
//     console.error("Error checking permissions:", error);
//     return false;
//   }
// };

// // Helper function to get user role
// const getUserRole = () => {
//   let role = localStorage.getItem("role");
//   if (!role) {
//     role = sessionStorage.getItem("role");
//   }
//   return role;
// };

// interface Role {
//   _id: string;
//   name: string;
//   description: string;
//   roleImage: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   nameNormalized?: string;
// }

// interface AddUserProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
// }

// const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [password, setPassword] = useState<string>("");
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRoleName, setSelectedRoleName] = useState<string>("");
//   // Add this state for phone validation
//   const [phoneError, setPhoneError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     status: "active",
//   });

//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   // Check permissions
//   const userRole = getUserRole();
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

//   // Fetch roles when component mounts
//   useEffect(() => {
//     // Check permissions on component mount
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       // navigate("/dashboard/user-management/overall", { replace: true })
//       return;
//     }

//     fetchRoles();
//   }, [navigate, isAdmin]);

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }
//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.data.success) {
//         setRoles(response.data.roles);
//         console.log("Roles fetched successfully:", response.data.roles);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       toast.error("Failed to fetch roles");
//     }
//   };

//   // Function to handle role selection
//   const handleRoleSelect = async (name: string) => {
//     // Find the role object by name
//     const selectedRole = roles.find((role) => role.name === name);
//     if (selectedRole) {
//       const roleId = selectedRole._id;
//       setSelectedRoleName(name);
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.data.success) {
//           console.log("Role details fetched:", response.data.role);
//           // Update form data with the role ID
//           setFormData((prev) => ({
//             ...prev,
//             role: roleId,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching role details:", error);
//         toast.error("Failed to fetch role details");
//       }
//     }
//   };

//   // Function to generate a random password
//   const generatePassword = () => {
//     const length = 12; // Define password length
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//     let generatedPassword = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }
//     setPassword(generatedPassword);
//     setFormData((prev) => ({
//       ...prev,
//       password: generatedPassword,
//       confirmPassword: generatedPassword,
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // Special handling for phone number
//     if (name === "phone") {
//       setPhoneError("");

//       // Allow only numbers, +, spaces, hyphens, and parentheses
//       const phoneRegex = /^[+\d\s\-()]*$/;
//       if (!phoneRegex.test(value)) {
//         setPhoneError(
//           "Phone number can only contain numbers, +, spaces, hyphens, and parentheses"
//         );
//         return;
//       }

//       // Validate phone number if it has enough digits
//       if (value.length > 3) {
//         try {
//           const phoneNumber = parsePhoneNumber(value);
//           if (phoneNumber && !phoneNumber.isValid()) {
//             setPhoneError(
//               "Please enter a valid phone number with country code"
//             );
//           }
//         } catch (error) {
//           if (value.length > 7) {
//             // Only show error for longer inputs
//             setPhoneError(
//               "Please enter a valid phone number with country code (e.g., +1234567890)"
//             );
//           }
//         }
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       status: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.firstName.trim()) {
//       toast.error("First name is required");
//       return false;
//     }
//     if (!formData.lastName.trim()) {
//       toast.error("Last name is required");
//       return false;
//     }
//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       toast.error("Phone number is required");
//       return false;
//     }
//     if (!formData.password.trim()) {
//       toast.error("Password is required");
//       return false;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }
//     if (!formData.role) {
//       toast.error("Please select a role");
//       return false;
//     }
//     // Validate phone number format
//     try {
//       if (!isValidPhoneNumber(formData.phone)) {
//         toast.error("Please enter a valid phone number with country code");
//         return false;
//       }
//     } catch (error) {
//       toast.error(
//         "Please enter a valid phone number with country code (e.g., +1234567890)"
//       );
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check permissions before submitting
//     if (!isAdmin && !hasPermission("User Management", "create")) {
//       toast.error("You don't have permission to add users");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData();

//       // Add all form fields to FormData INCLUDING confirmPassword
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profileImage", uploadedFile);
//       }

//       console.log("Sending form data:", Object.fromEntries(formDataToSend));

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/addUser`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         console.log("User added successfully:", response.data);
//         toast.success("User added successfully!");
//         // Reset form and uploaded file
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//           role: "",
//           status: "active",
//         });
//         setPassword("");
//         setSelectedRoleName("");
//         setUploadedFile(null);
//         // Navigate back to user management
//         navigate("/dashboard/user-management/overall", { replace: true });
//       } else {
//         toast.error(response.data.message || "Failed to add user");
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "An error occurred while adding the user";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <span
//           onClick={() =>
//             navigate("/dashboard/user-management/overall", { replace: true })
//           }
//           className="cursor-pointer"
//         >
//           User Management
//         </span>{" "}
//         / <span className="text-black">Add Users</span>
//       </h2>
//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//           Add Users
//         </p>

//         <form
//           className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
//           onSubmit={handleSubmit}
//         >
//           {/* Left Side */}
//           <div className="space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="firstName" className="mb-1">
//                 First Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="firstName"
//                 placeholder="First Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="lastName" className="mb-1">
//                 Last Name <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col w-full">
//               <label htmlFor="password" className="mb-1 font-semibold text-sm">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
//                 <input
//                   type="text"
//                   id="password"
//                   name="password"
//                   placeholder="Enter Password"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     setFormData((prev) => ({
//                       ...prev,
//                       password: e.target.value,
//                     }));
//                   }}
//                   className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
//                   required
//                 />
//                 <Button
//                   onClick={generatePassword}
//                   className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
//                   text="Generate"
//                   type="button"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="confirmPassword" className="mb-1">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="role" className="mb-1">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <Dropdown
//                 options={roles.map((role) => role.name)}
//                 className="w-full"
//                 onSelect={handleRoleSelect}
//                 noResultsMessage="No roles found"
//                 defaultValue={selectedRoleName || "Select Role"}
//                 searchable={true} // Add this prop
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="email" className="mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>
//             {/* <div className="flex flex-col">
//               <label htmlFor="phone" className="mb-1">
//                 Phone No <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="+65 362783233"
//                 className="outline-none focus:outline-none w-full"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//             </div> */}

//             <div className="flex flex-col">
//               <label htmlFor="phone" className="mb-1">
//                 Phone No <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 name="phone"
//                 placeholder="+1 234 567 8900 (with country code)"
//                 className={`outline-none focus:outline-none w-full ${
//                   phoneError ? "border-red-500" : ""
//                 }`}
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//               {phoneError && (
//                 <span className="text-red-500 text-xs mt-1">{phoneError}</span>
//               )}
//               <span className="text-gray-500 text-xs mt-1">
//                 Include country code (e.g., +1 for US, +44 for UK, +92 for
//                 Pakistan)
//               </span>
//             </div>

//             <div className="flex gap-2 flex-col">
//               <div>
//                 <span className="text-sm font-medium">Status</span>
//               </div>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="active"
//                     checked={formData.status === "active"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Active
//                 </label>
//                 <label className="flex items-center gap-2 text-sm border px-2 py-2 border-gray-200 rounded-md">
//                   <input
//                     type="radio"
//                     name="status"
//                     value="inactive"
//                     checked={formData.status === "inactive"}
//                     onChange={handleStatusChange}
//                     className="accent-blue-600"
//                   />
//                   Inactive
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="space-y-4 relative">
//             <div className="flex flex-col !mb-12 sm:mb-0">
//               <label htmlFor="" className="mb-1">
//                 Upload Image <span className="text-[11px]">(optional)</span>
//               </label>
//               <DropImage
//                 uploadedFile={uploadedFile}
//                 setUploadedFile={setUploadedFile}
//                 className="w-2/3 xl:w-2/3"
//               />
//               {uploadedFile && (
//                 <p className="text-sm text-green-600 mt-2">
//                   Image selected: {uploadedFile.name}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-end gap-4 Poppins-font font-medium mt-8 absolute bottom-0 w-full">
//               <Button
//                 text="Back"
//                 type="button"
//                 onClick={() =>
//                   navigate("/dashboard/user-management/overall", {
//                     replace: true,
//                   })
//                 }
//                 className="px-6 !bg-[#F4F4F5] !border-none"
//               />
//               {/* Conditionally render Save button based on permissions */}
//               {(isAdmin || hasPermission("User Management", "create")) && (
//                 <Button
//                   text={loading ? "Saving..." : "Save"}
//                   type="submit"
//                   disabled={loading}
//                   className={`px-6 !bg-[#056BB7] border-none text-white ${
//                     loading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 />
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUser;



import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import { DropImage } from "../../../components/UploadPicture";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

interface Role {
  _id: string;
  name: string;
  description: string;
  roleImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  nameNormalized?: string;
}

interface AddUserProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const AddUser: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
  const [password, setPassword] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "active",
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  // Fetch roles when component mounts
  useEffect(() => {
    // Check permissions on component mount
    if (!isAdmin && !hasPermission("User Management", "create")) {
      toast.error("You don't have permission to add users");
      // navigate("/dashboard/user-management/overall", { replace: true })
      return;
    }

    fetchRoles();
  }, [navigate, isAdmin]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const fetchRoles = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/roles`, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setRoles(response.data.roles);
        // console.log("Roles fetched successfully:", response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    }
  };

  // Function to handle role selection
  const handleRoleSelect = async (name: string) => {
    // Find the role object by name
    const selectedRole = roles.find((role) => role.name === name);
    if (selectedRole) {
      const roleId = selectedRole._id;
      setSelectedRoleName(name);
      try {
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }
        const response = await axios.get(
          `${API_URL}/api/abid-jewelry-ms/role/${roleId}`,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          console.log("Role details fetched:", response.data.role);
          // Update form data with the role ID
          setFormData((prev) => ({
            ...prev,
            role: roleId,
          }));
        }
      } catch (error) {
        console.error("Error fetching role details:", error);
        toast.error("Failed to fetch role details");
      }
    }
  };

  // Function to generate a random password
  const generatePassword = () => {
    const length = 12; // Define password length
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
    setFormData((prev) => ({
      ...prev,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone number change
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value);
    setPhoneError("");

    if (value) {
      // Validate phone number
      if (!isValidPhoneNumber(value)) {
        setPhoneError("Please enter a valid phone number");
      }

      // Update form data
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }
    // Validate phone number format
    if (phoneValue && !isValidPhoneNumber(phoneValue)) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check permissions before submitting
    if (!isAdmin && !hasPermission("User Management", "create")) {
      toast.error("You don't have permission to add users");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData INCLUDING confirmPassword
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profileImage", uploadedFile);
      }

      console.log("Sending form data:", Object.fromEntries(formDataToSend));

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addUser`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("User added successfully:", response.data);
        toast.success("User added successfully!");
        // Reset form and uploaded file
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "",
          status: "active",
        });
        setPassword("");
        setSelectedRoleName("");
        setPhoneValue(undefined);
        setUploadedFile(null);
        // Navigate back to user management
        navigate("/dashboard/user-management/overall", { replace: true });
      } else {
        toast.error(response.data.message || "Failed to add user");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while adding the user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/user-management/overall", { replace: true })
          }
          className="cursor-pointer"
        >
          User Management
        </span>{" "}
        / <span className="text-black">Add Users</span>
      </h2>
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
          Add Users
        </p>

        <form
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium"
          onSubmit={handleSubmit}
        >
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                placeholder="First Name"
                className="outline-none focus:outline-none w-full"
                value={formData.firstName}
                onChange={handleInputChange}
                // required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                placeholder="Last Name"
                className="outline-none focus:outline-none w-full"
                value={formData.lastName}
                onChange={handleInputChange}
                // required
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="password" className="mb-1 font-semibold text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex w-full items-center border border-gray-300 rounded-md overflow-hidden p-1">
                <input
                  type="text"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border-none outline-none"
                  // required
                />
                <Button
                  onClick={generatePassword}
                  className="bg-[#28A745] text-white text-sm font-semibold px-4 py-2 hover:bg-green-600 transition-colors !border-none"
                  text="Generate"
                  type="button"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="outline-none focus:outline-none w-full"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                // required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={roles.map((role) => role.name)}
                className="w-full"
                onSelect={handleRoleSelect}
                noResultsMessage="No roles found"
                defaultValue={selectedRoleName || "Select Role"}
                searchable={true}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                className="outline-none focus:outline-none w-full"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone Number Input with react-phone-number-input */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1">
                Phone No <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneValue}
                onChange={handlePhoneChange}
                defaultCountry="GB"
                international
                countryCallingCodeEditable={false}
                className={`phone-input-container ${
                  phoneError ? "border-red-500" : ""
                }`}
                style={{
                  "--PhoneInputCountryFlag-height": "1em",
                  "--PhoneInputCountrySelectArrow-color": "#6b7280",
                }}
              />
              {phoneError && (
                <span className="text-red-500 text-xs mt-1">{phoneError}</span>
              )}
              <span className="text-gray-500 text-xs mt-1">
                Phone number with country code (UK selected by default)
              </span>
            </div>

            <div className="flex gap-2 flex-col">
              <div>
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleStatusChange}
                    className="accent-blue-600"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm border px-2 py-2 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleStatusChange}
                    className="accent-blue-600"
                  />
                  Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4 relative">
            <div className="flex flex-col !mb-12 sm:mb-0">
              <label htmlFor="" className="mb-1">
                Upload Image <span className="text-[11px]">(optional)</span>
              </label>
              <DropImage
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                className="w-2/3 xl:w-2/3"
              />
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Image selected: {uploadedFile.name}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4 Poppins-font font-medium mt-8 absolute bottom-0 w-full">
              <Button
                text="Back"
                type="button"
                onClick={() =>
                  navigate("/dashboard/user-management/overall", {
                    replace: true,
                  })
                }
                className="px-6 !bg-[#F4F4F5] !border-none"
              />
              {/* Conditionally render Save button based on permissions */}
              {(isAdmin || hasPermission("User Management", "create")) && (
                <Button
                  text={loading ? "Saving..." : "Save"}
                  type="submit"
                  disabled={loading}
                  className={`px-6 !bg-[#056BB7] border-none text-white ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Custom CSS for phone input styling */}
      {/* Custom CSS for phone input styling */}
      {/* <style>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          background-color: white;
          font-size: 0.875rem;
        }
        
        .PhoneInput:focus-within {
          // outline: 2px solid #3b82f6;
          // outline-offset: 2px;
          // border-color: #3b82f6;
        }
        
        .PhoneInputCountrySelect {
          margin-right: 1rem;
          border: none;
          background: transparent;
          font-size: 0.875rem;
        }
        
        .PhoneInputCountrySelect:focus {
          outline: none;
        }
        
        .PhoneInputInput {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.875rem;
          background: transparent;
        }
        
        .PhoneInputInput::placeholder {
          color: #9ca3af;
        }
        
        .phone-input-container.border-red-500 .PhoneInput {
          border-color: #ef4444;
        }
      `}</style> */}

      <style>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          background-color: white;
          font-size: 0.875rem;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .PhoneInput:hover {
          border-color: #d1d5db;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .PhoneInput:focus-within {
          // border-color: #056BB7;
          // box-shadow: 0 0 0 3px rgba(5, 107, 183, 0.1);
        }
        
        .PhoneInputCountrySelect {
          margin-right: 1rem;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease-in-out;
        }
        
        .PhoneInputCountrySelect:hover {
          background-color: #f9fafb;
        }
        
        .PhoneInputCountrySelect:focus {
          outline: none;
          background-color: #f3f4f6;
        }
        
        .PhoneInputCountrySelectArrow {
          color: #6b7280;
          margin-left: 0.3rem;
          margin-right: 0.3rem;
          transition: transform 0.2s ease-in-out;
        }
        
        .PhoneInputCountrySelect:focus .PhoneInputCountrySelectArrow {
          transform: rotate(180deg);
        }
        
        .PhoneInputInput {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.875rem;
          background: transparent;
          color: #374151;
          font-weight: 400;
        }
        
        .PhoneInputInput::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
        
        .PhoneInputInput:focus {
          color: #111827;
        }
        
        .phone-input-container.border-red-500 .PhoneInput {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Custom dropdown styling */
        .PhoneInputCountryIcon {
          margin-right: 0.5rem;
          width: 1.25rem;
          height: 1rem;
          border-radius: 0.125rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .PhoneInput {
            padding: 0.625rem 0.875rem;
            font-size: 0.8125rem;
          }
          
          .PhoneInputCountrySelect {
            margin-right: 0.75rem;
            font-size: 0.8125rem;
          }
          
          .PhoneInputInput {
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AddUser;
