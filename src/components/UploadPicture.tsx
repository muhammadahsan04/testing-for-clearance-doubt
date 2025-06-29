// import React, { useState } from "react";
// import Button from "./Button";
// import galleryIcon from "../assets/galleryIcon.svg";
// import { toast } from "react-toastify";
// import axios from "axios";

// interface UploadPictureProps {
//   showModal: boolean;
//   setShowModal: (show: boolean) => void;
//   isEditing: boolean;
//   setIsEditing: (edit: boolean) => void;
//   roleName: string;
//   setRoleName: (val: string) => void;
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
//   children?: React.ReactNode;
//   selectedRoleId?: string;
//   // Add these new props
//   setSelectedRoleId?: (id: string) => void;
//   onRoleSaved?: (newRoleId?: string) => void; // Modified to accept a role ID
//   roleImageUrl?: string;
// }

// const UploadPicture: React.FC<UploadPictureProps> = ({
//   showModal,
//   setShowModal,
//   isEditing,
//   setIsEditing,
//   roleName,
//   setRoleName,
//   uploadedFile,
//   setUploadedFile,
//   children,
//   selectedRoleId = "",
//   // Add these new props with default values
//   setSelectedRoleId = () => {}, // Default to empty function if not provided
//   onRoleSaved = () => {}, // Default to empty function if not provided
//   roleImageUrl = "", // Default to empty string
// }) => {
//   const [roleDescription, setRoleDescription] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   let token = localStorage.getItem("token");
//   console.log(token);
//   // Helper function to get auth token from localStorage or sessionStorage
//   const getAuthToken = () => {
//     // Try to get token from localStorage first
//     let token = localStorage.getItem("token");
//     // console.log(token);

//     // If not found in localStorage, try sessionStorage
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }

//     return token;
//   };

//   // const handleSaveRole = async () => {
//   //   // Validate input - only role name is required
//   //   if (!roleName.trim()) {
//   //     toast.error("Role name is required");
//   //     return;
//   //   }

//   //   setIsLoading(true);
//   //   try {
//   //     const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   //     // Get token using the helper function
//   //     const token = getAuthToken();

//   //     if (!token) {
//   //       toast.error("Authentication token not found. Please login again.");
//   //       setIsLoading(false);
//   //       return;
//   //     }

//   //     // Create form data for file upload
//   //     const formData = new FormData();
//   //     formData.append("name", roleName);

//   //     // Description is optional
//   //     if (roleDescription) {
//   //       formData.append("description", roleDescription);
//   //     }

//   //     // Image is optional
//   //     if (uploadedFile) {
//   //       formData.append("roleImage", uploadedFile);
//   //     }

//   //     // Determine if we're creating or updating
//   //     const method = isEditing ? "PUT" : "POST";
//   //     const endpoint = isEditing
//   //       ? `${API_URL}/api/abid-jewelry-ms/role/${selectedRoleId}`
//   //       : `${API_URL}/api/abid-jewelry-ms/role`;

//   //     // Using axios with token in headers
//   //     const response = await axios({
//   //       method,
//   //       url: endpoint,
//   //       data: formData,
//   //       headers: {
//   //         "x-access-token": token,
//   //         "Content-Type": "multipart/form-data",
//   //       },
//   //     });
//   //     console.log("data", response.data);

//   //     const data = response.data;

//   //     if (data.success) {
//   //       toast.success(
//   //         data.message ||
//   //           `Role ${isEditing ? "updated" : "created"} successfully`
//   //       );

//   //       // Reset form fields
//   //       setRoleName("");
//   //       setRoleDescription("");
//   //       setUploadedFile(null);
//   //       setShowModal(false);

//   //       // Reset editing state if applicable
//   //       if (isEditing) {
//   //         setIsEditing(false);
//   //         setSelectedRoleId("");
//   //       }

//   //       // Call the callback to refresh roles
//   //       onRoleSaved(); // This will call fetchRoles() in the parent component
//   //     } else {
//   //       toast.error(
//   //         data.message || `Failed to ${isEditing ? "update" : "create"} role`
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.error("Error saving role:", error);

//   //     if (axios.isAxiosError(error)) {
//   //       // If it's an Axios error, we can access the response data
//   //       if (error.response && error.response.data) {
//   //         toast.error(
//   //           error.response.data.message ||
//   //             `Failed to ${isEditing ? "update" : "create"} role`
//   //         );
//   //       } else {
//   //         toast.error(`Network error. Please check your internet connection.`);
//   //       }
//   //     } else {
//   //       // For non-Axios errors
//   //       toast.error(
//   //         `An unexpected error occurred while ${
//   //           isEditing ? "updating" : "creating"
//   //         } the role`
//   //       );
//   //     }
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSaveRole = async () => {
//     // Validate input - only role name is required
//     if (!roleName.trim()) {
//       toast.error("Role name is required");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//       // Get token using the helper function
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         setIsLoading(false);
//         return;
//       }

//       // Create form data for file upload
//       const formData = new FormData();
//       formData.append("name", roleName);

//       // Description is optional
//       if (roleDescription) {
//         formData.append("description", roleDescription);
//       }

//       // Image is optional
//       if (uploadedFile) {
//         formData.append("roleImage", uploadedFile);
//       }

//       // Determine if we're creating or updating
//       const method = isEditing ? "PUT" : "POST";
//       const endpoint = isEditing
//         ? `${API_URL}/api/abid-jewelry-ms/role/${selectedRoleId}`
//         : `${API_URL}/api/abid-jewelry-ms/role`;

//       // Using axios with token in headers
//       const response = await axios({
//         method,
//         url: endpoint,
//         data: formData,
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       console.log("data", response.data);

//       const data = response.data;

//       if (data.success) {
//         toast.success(
//           data.message ||
//             `Role ${isEditing ? "updated" : "created"} successfully`
//         );

//         // Reset form fields
//         setRoleName("");
//         setRoleDescription("");
//         setUploadedFile(null);
//         setShowModal(false);

//         // Reset editing state if applicable
//         if (isEditing) {
//           setIsEditing(false);
//           setSelectedRoleId("");
//         }

//         // Call the callback to refresh roles with the new role ID
//         // This allows the parent component to select the new role
//         const newRoleId = isEditing ? selectedRoleId : data.role?._id || "";
//         onRoleSaved(newRoleId); // Pass the new role ID to the callback
//       } else {
//         toast.error(
//           data.message || `Failed to ${isEditing ? "update" : "create"} role`
//         );
//       }
//     } catch (error) {
//       console.error("Error saving role:", error);

//       if (axios.isAxiosError(error)) {
//         // If it's an Axios error, we can access the response data
//         if (error.response && error.response.data) {
//           toast.error(
//             error.response.data.message ||
//               `Failed to ${isEditing ? "update" : "create"} role`
//           );
//         } else {
//           toast.error(`Network error. Please check your internet connection.`);
//         }
//       } else {
//         // For non-Axios errors
//         toast.error(
//           `An unexpected error occurred while ${
//             isEditing ? "updating" : "creating"
//           } the role`
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!showModal) return null;

//   return (
//     <div
//       // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-40 transition-opacity duration-300"
//       className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//       onClick={() => {
//         setShowModal(false);
//         if (isEditing) setIsEditing(false);
//       }}
//     >
//       <div
//         className="animate-scaleIn bg-white w-[340px] h-auto rounded-[7px] p-6 shadow-xl relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-semibold text-center text-[#384AAB] mb-6">
//           {isEditing ? "Edit Role" : "Add Role"}
//         </h2>

//         {/* Role Input */}
//         <label className="block text-sm font-medium mb-1">
//           Role Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           placeholder="Role name"
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Upload Section */}
//         <p className="text-sm font-medium mb-2">Upload Image</p>
//         <DropImage
//           uploadedFile={uploadedFile}
//           setUploadedFile={setUploadedFile}
//           existingImageUrl={roleImageUrl} // Pass the image URL to DropImage
//         />

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <Button
//             text="Back"
//             className="bg-gray-200 text-black px-6 py-2 rounded border-none"
//             onClick={() => {
//               setShowModal(false);
//               if (isEditing) setIsEditing(false);
//               setRoleName("");
//               setRoleDescription("");
//             }}
//           />
//           <Button
//             text={isEditing ? "Update" : "Save"}
//             className={`!bg-[#1A8CE0] text-white px-6 py-2 rounded border-none ${
//               isLoading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             onClick={handleSaveRole}
//             disabled={isLoading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPicture;

// interface DropImageProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
//   className?: string;
//   existingImageUrl?: string; // Add this new prop
// }

// export const DropImage: React.FC<DropImageProps> = ({
//   uploadedFile,
//   setUploadedFile,
//   className,
//   existingImageUrl = "", // Default to empty string
// }) => {
//   const handleFileChange = (file: File | null) => {
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
//       return;
//     }

//     // Validate file size (max 2MB) - Changed from 5MB to 2MB
//     const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//     if (file.size > maxSize) {
//       toast.error("File size exceeds 2MB limit");
//       return;
//     }

//     setUploadedFile(file);
//   };

//   // Create a reference to the file input
//   const fileInputRef = React.useRef<HTMLInputElement>(null);

//   // Function to trigger file input click
//   const openFileExplorer = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Determine if we're in edit mode with an existing image
//   const isEditingWithImage = existingImageUrl && existingImageUrl.length > 0;

//   return (
//     <div
//       onDrop={(e) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//         if (file) handleFileChange(file);
//       }}
//       onDragOver={(e) => e.preventDefault()}
//       className={`border-4 border-dashed border-[#1A8CE0] rounded-lg p-6 text-center mb-4 select-none ${className}`}
//     >
//       {/* Show existing image if available */}
//       {!uploadedFile && existingImageUrl && (
//         <div className="">
//           <p className="text-sm text-gray-600 mb-2">Current Image:</p>
//           <img
//             src={existingImageUrl}
//             alt="Current role image"
//             className="max-h-32 mx-auto rounded"
//           />

//           {/* For editing mode with existing image, show only the update button */}
//           <button
//             type="button"
//             onClick={openFileExplorer}
//             className="text-blue-500 cursor-pointer underline bg-transparent border-none mt-3"
//           >
//             browse for update image
//           </button>
//         </div>
//       )}

//       {/* Show preview of uploaded file */}
//       {uploadedFile && (
//         <div className="">
//           <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
//           <img
//             src={URL.createObjectURL(uploadedFile)}
//             alt="New image preview"
//             className="max-h-32 mx-auto rounded"
//           />
//           <p className="text-xs text-green-600 mt-2">
//             Selected: {uploadedFile.name}
//           </p>
//           <p className="text-xs text-gray-500">
//             Size: {(uploadedFile.size / 1024).toFixed(2)} KB
//           </p>
//         </div>
//       )}

//       {/* Only show full upload controls if we're not editing with an existing image */}
//       {!isEditingWithImage && !uploadedFile && (
//         <div className="flex flex-col items-center justify-center gap-2">
//           <img src={galleryIcon} alt="Upload Icon" className="w-12 h-12" />
//           <p className="text-gray-700 text-sm">
//             Drag & drop an image here <br />
//             <button
//               type="button"
//               onClick={openFileExplorer}
//               className="text-blue-500 cursor-pointer underline bg-transparent border-none"
//             >
//               or browse
//             </button>
//             <br />
//             <span className="text-xs text-gray-500">(Max file size: 2MB)</span>
//           </p>
//         </div>
//       )}

//       {/* Always have the hidden input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => {
//           if (e.target.files?.[0]) {
//             handleFileChange(e.target.files[0]);
//           }
//         }}
//       />
//     </div>
//   );
// };

// import React, { useState } from "react";
// import Button from "./Button";
// import galleryIcon from "../assets/galleryIcon.svg";
// import { toast } from "react-toastify";
// // import axios from "axios";
// import { useAppDispatch } from "../redux/hooks";
// import { saveRole } from "../redux/slices/roleSlice";

// interface UploadPictureProps {
//   showModal: boolean;
//   setShowModal: (show: boolean) => void;
//   isEditing: boolean;
//   setIsEditing: (edit: boolean) => void;
//   roleName: string;
//   setRoleName: (val: string) => void;
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
//   children?: React.ReactNode;
//   selectedRoleId?: string;
//   roleImageUrl?: string;
//   onRoleSaved?: () => void; // Callback to refresh roles
// }

// const UploadPicture: React.FC<UploadPictureProps> = ({
//   showModal,
//   setShowModal,
//   isEditing,
//   setIsEditing,
//   roleName,
//   setRoleName,
//   uploadedFile,
//   setUploadedFile,
//   children,
//   selectedRoleId = "",
//   roleImageUrl = "",
//   onRoleSaved = () => {},
// }) => {
//   const dispatch = useAppDispatch();
//   const [roleDescription, setRoleDescription] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Helper function to get auth token from localStorage or sessionStorage
//   const getAuthToken = () => {
//     // Try to get token from localStorage first
//     let token = localStorage.getItem("token");

//     // If not found in localStorage, try sessionStorage
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }

//     return token;
//   };

//   const handleSaveRole = async () => {
//     // Validate input - only role name is required
//     if (!roleName.trim()) {
//       toast.error("Role name is required");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Create form data for file upload
//       const formData = new FormData();
//       formData.append("name", roleName);

//       // Description is optional
//       if (roleDescription) {
//         formData.append("description", roleDescription);
//       }

//       // Image is optional
//       if (uploadedFile) {
//         formData.append("roleImage", uploadedFile);
//       }

//       // Dispatch the saveRole action
//       await dispatch(
//         saveRole({
//           formData,
//           isEditing,
//           roleId: selectedRoleId,
//         })
//       ).unwrap();

//       // Reset form fields
//       setRoleName("");
//       setRoleDescription("");
//       setUploadedFile(null);
//       setShowModal(false);

//       // Reset editing state if applicable
//       if (isEditing) {
//         setIsEditing(false);
//       }

//       // Call the callback to refresh roles
//       onRoleSaved();
//     } catch (error) {
//       console.error("Error saving role:", error);
//       // Error handling is done in the saveRole thunk
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!showModal) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//       onClick={() => {
//         setShowModal(false);
//         if (isEditing) setIsEditing(false);
//       }}
//     >
//       <div
//         className="animate-scaleIn bg-white w-[340px] h-auto rounded-[7px] p-6 shadow-xl relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-semibold text-center text-[#384AAB] mb-6">
//           {isEditing ? "Edit Role" : "Add Role"}
//         </h2>

//         {/* Role Input */}
//         <label className="block text-sm font-medium mb-1">
//           Role Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           placeholder="Role name"
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Role Description */}
//         {/* <label className="block text-sm font-medium mb-1">Description</label>
//         <textarea
//           value={roleDescription}
//           onChange={(e) => setRoleDescription(e.target.value)}
//           placeholder="Role description (optional)"
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//           rows={3}
//         /> */}

//         {/* Upload Section */}
//         <p className="text-sm font-medium mb-2">Upload Image</p>
//         <DropImage
//           uploadedFile={uploadedFile}
//           setUploadedFile={setUploadedFile}
//           existingImageUrl={roleImageUrl}
//         />

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <Button
//             text="Back"
//             className="bg-gray-200 text-black px-6 py-2 rounded border-none"
//             onClick={() => {
//               setShowModal(false);
//               if (isEditing) setIsEditing(false);
//               setRoleName("");
//               setRoleDescription("");
//             }}
//           />
//           <Button
//             text={isEditing ? "Update" : "Save"}
//             className={`!bg-[#1A8CE0] text-white px-6 py-2 rounded border-none ${
//               isLoading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             onClick={handleSaveRole}
//             disabled={isLoading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadPicture;

// interface DropImageProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
//   className?: string;
//   existingImageUrl?: string;
// }

// export const DropImage: React.FC<DropImageProps> = ({
//   uploadedFile,
//   setUploadedFile,
//   className,
//   existingImageUrl = "",
// }) => {
//   const handleFileChange = (file: File | null) => {
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
//       return;
//     }

//     // Validate file size (max 2MB)
//     const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//     if (file.size > maxSize) {
//       toast.error("File size exceeds 2MB limit");
//       return;
//     }

//     setUploadedFile(file);
//   };

//   // Create a reference to the file input
//   const fileInputRef = React.useRef<HTMLInputElement>(null);

//   // Function to trigger file input click
//   const openFileExplorer = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Determine if we're in edit mode with an existing image
//   const isEditingWithImage = existingImageUrl && existingImageUrl.length > 0;

//   return (
//     <div
//       onDrop={(e) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//         if (file) handleFileChange(file);
//       }}
//       onDragOver={(e) => e.preventDefault()}
//       className={`border-4 border-dashed border-[#1A8CE0] rounded-lg p-6 text-center mb-4 select-none ${className}`}
//     >
//       {/* Show existing image if available */}
//       {!uploadedFile && existingImageUrl && (
//         <div className="">
//           <p className="text-sm text-gray-600 mb-2">Current Image:</p>
//           <img
//             src={existingImageUrl}
//             alt="Current role image"
//             className="max-h-32 mx-auto rounded"
//           />

//           {/* For editing mode with existing image, show only the update button */}
//           <button
//             type="button"
//             onClick={openFileExplorer}
//             className="text-blue-500 cursor-pointer underline bg-transparent border-none mt-3"
//           >
//             browse for update image
//           </button>
//         </div>
//       )}

//       {/* Show preview of uploaded file */}
//       {uploadedFile && (
//         <div className="">
//           <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
//           <img
//             src={URL.createObjectURL(uploadedFile)}
//             alt="New image preview"
//             className="max-h-32 mx-auto rounded"
//           />
//           <p className="text-xs text-green-600 mt-2">
//             Selected: {uploadedFile.name}
//           </p>
//           <p className="text-xs text-gray-500">
//             Size: {(uploadedFile.size / 1024).toFixed(2)} KB
//           </p>
//         </div>
//       )}

//       {/* Only show full upload controls if we're not editing with an existing image */}
//       {!isEditingWithImage && !uploadedFile && (
//         <div className="flex flex-col items-center justify-center gap-2">
//           <img src={galleryIcon} alt="Upload Icon" className="w-12 h-12" />
//           <p className="text-gray-700 text-sm">
//             Drag & drop an image here <br />
//             <button
//               type="button"
//               onClick={openFileExplorer}
//               className="text-blue-500 cursor-pointer underline bg-transparent border-none"
//             >
//               or browse
//             </button>
//             <br />
//             <span className="text-xs text-gray-500">(Max file size: 2MB)</span>
//           </p>
//         </div>
//       )}

//       {/* Always have the hidden input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => {
//           if (e.target.files?.[0]) {
//             handleFileChange(e.target.files[0]);
//           }
//         }}
//       />
//     </div>
//   );
// };


import React, { useState } from "react";
import Button from "./Button";
import galleryIcon from "../assets/galleryIcon.svg";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks";
import { saveRole } from "../redux/slices/roleSlice";

interface UploadPictureProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  roleName: string;
  setRoleName: (val: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  children?: React.ReactNode;
  selectedRoleId?: string;
  roleImageUrl?: string;
  onRoleSaved?: () => void; // Callback to refresh roles
}

const UploadPicture: React.FC<UploadPictureProps> = ({
  showModal,
  setShowModal,
  isEditing,
  setIsEditing,
  roleName,
  setRoleName,
  uploadedFile,
  setUploadedFile,
  children,
  selectedRoleId = "",
  roleImageUrl = "",
  onRoleSaved = () => {},
}) => {
  const dispatch = useAppDispatch();
  const [roleDescription, setRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const handleSaveRole = async () => {
  //   // Validate input - only role name is required
  //   if (!roleName.trim()) {
  //     toast.error("Role name is required");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     // Create form data for file upload
  //     const formData = new FormData();
  //     formData.append("name", roleName);

  //     // Description is optional
  //     if (roleDescription) {
  //       formData.append("description", roleDescription);
  //     }

  //     // Image is optional
  //     if (uploadedFile) {
  //       formData.append("roleImage", uploadedFile);
  //     }

  //     // Dispatch the saveRole action
  //     await dispatch(
  //       saveRole({
  //         formData,
  //         isEditing,
  //         roleId: selectedRoleId,
  //       })
  //     ).unwrap();

  //     // Reset form fields
  //     setRoleName("");
  //     setRoleDescription("");
  //     setUploadedFile(null);
  //     setShowModal(false);

  //     // Reset editing state if applicable
  //     if (isEditing) {
  //       setIsEditing(false);
  //     }

  //     // Call the callback to refresh roles
  //     onRoleSaved();
  //   } catch (error) {
  //     console.error("Error saving role:", error);
  //     // Error handling is done in the saveRole thunk
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveRole = async () => {
  // Validate input - only role name is required
  if (!roleName.trim()) {
    toast.error("Role name is required");
    return;
  }

  setIsLoading(true);
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append("name", roleName);

    // Description is optional
    if (roleDescription) {
      formData.append("description", roleDescription);
    }

    // Image is optional
    if (uploadedFile) {
      formData.append("roleImage", uploadedFile);
    }

    // Dispatch the saveRole action
    const result = await dispatch(
      saveRole({
        formData,
        isEditing,
        roleId: selectedRoleId,
      })
    ).unwrap();

    // Reset form fields
    setRoleName("");
    setRoleDescription("");
    setUploadedFile(null);
    setShowModal(false);

    // Reset editing state if applicable
    if (isEditing) {
      setIsEditing(false);
    }

    // Call the callback to refresh roles
    onRoleSaved();
  } catch (error) {
    console.error("Error saving role:", error);
    // Error handling is done in the saveRole thunk
  } finally {
    setIsLoading(false);
  }
};


  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={() => {
        setShowModal(false);
        if (isEditing) setIsEditing(false);
      }}
    >
      <div
        className="animate-scaleIn bg-white w-[340px] h-auto rounded-[7px] p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center text-[#384AAB] mb-6">
          {isEditing ? "Edit Role" : "Add Role"}
        </h2>

        {/* Role Input */}
        <label className="block text-sm font-medium mb-1">
          Role Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role name"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Upload Section */}
        <p className="text-sm font-medium mb-2">Upload Image</p>
        <DropImage
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          existingImageUrl={roleImageUrl}
        />

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            text="Back"
            className="bg-gray-200 text-black px-6 py-2 rounded border-none"
            onClick={() => {
              setShowModal(false);
              if (isEditing) setIsEditing(false);
              setRoleName("");
              setRoleDescription("");
            }}
          />
          <Button
            text={isEditing ? "Update" : "Save"}
            className={`!bg-[#1A8CE0] text-white px-6 py-2 rounded border-none ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSaveRole}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPicture;

interface DropImageProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  className?: string;
  existingImageUrl?: string;
}

export const DropImage: React.FC<DropImageProps> = ({
  uploadedFile,
  setUploadedFile,
  className,
  existingImageUrl = "",
}) => {
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB limit");
      return;
    }

    setUploadedFile(file);
  };

  // Create a reference to the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Function to trigger file input click
  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Determine if we're in edit mode with an existing image
  const isEditingWithImage = existingImageUrl && existingImageUrl.length > 0;

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`border-4 border-dashed border-[#1A8CE0] rounded-lg p-6 text-center mb-4 select-none ${className}`}
    >
      {/* Show existing image if available */}
      {!uploadedFile && existingImageUrl && (
        <div className="">
          <p className="text-sm text-gray-600 mb-2">Current Image:</p>
          <img
            src={existingImageUrl}
            alt="Current role image"
            className="max-h-32 mx-auto rounded"
          />

          {/* For editing mode with existing image, show only the update button */}
          <button
            type="button"
            onClick={openFileExplorer}
            className="text-blue-500 cursor-pointer underline bg-transparent border-none mt-3"
          >
            browse for update image
          </button>
        </div>
      )}

      {/* Show preview of uploaded file */}
      {uploadedFile && (
        <div className="">
          <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
          <img
            src={URL.createObjectURL(uploadedFile)}
            alt="New image preview"
            className="max-h-32 mx-auto rounded"
          />
          <p className="text-xs text-green-600 mt-2">
            Selected: {uploadedFile.name}
          </p>
          <p className="text-xs text-gray-500">
            Size: {(uploadedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Only show full upload controls if we're not editing with an existing image */}
      {!isEditingWithImage && !uploadedFile && (
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={galleryIcon} alt="Upload Icon" className="w-12 h-12" />
          <p className="text-gray-700 text-sm">
            Drag & drop an image here <br />
            <button
              type="button"
              onClick={openFileExplorer}
              className="text-blue-500 cursor-pointer underline bg-transparent border-none"
            >
              or browse
            </button>
            <br />
            <span className="text-xs text-gray-500">(Max file size: 2MB)</span>
          </p>
        </div>
      )}

      {/* Always have the hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
