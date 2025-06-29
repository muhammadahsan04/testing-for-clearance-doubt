// import React, { useState, useEffect } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import { RiEditLine } from "react-icons/ri";
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { LuEye } from "react-icons/lu";
// import axios from "axios";
// import { toast } from "react-toastify";

// import Input from "./Input";
// import Dropdown from "./Dropdown";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";
// import { DropImage } from "./UploadPicture";

// type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

// interface Column {
//   header: string;
//   accessor: string;
//   type?: ColumnType;
// }

// export interface User {
//   id: string;
//   name: string;
//   role: string;
//   status: string;
//   userImage?: string;
//   [key: string]: any;
// }

// interface SupplierTableProps {
//   columns: Column[];
//   data: any[];
//   tableTitle?: string;
//   rowsPerPageOptions?: number[];
//   defaultRowsPerPage?: number;
//   searchable?: boolean;
//   filterByStatus?: boolean;
//   onEdit?: (row: any) => void;
//   onDelete?: (row: any) => void;
//   tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
//   className?: string;
//   onRowClick?: (row: any) => void;
//   dealBy?: boolean;
//   enableRowModal?: boolean;
//   eye?: boolean;
// }

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// const SupplierTable: React.FC<SupplierTableProps> = ({
//   eye,
//   enableRowModal = true,
//   onRowClick,
//   className,
//   columns,
//   data,
//   tableTitle,
//   rowsPerPageOptions = [5, 10, 15],
//   defaultRowsPerPage = 5,
//   searchable = true,
//   filterByStatus = true,
//   onEdit,
//   onDelete,
//   tableDataAlignment = "start", // default
//   dealBy,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
//   const [deleteSupplier, setDeleteSupplier] = useState<any>(null); // for modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [search, setSearch] = useState(""); // ✅ Local search state
//   const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
//   // To these two state variables edit user
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingRow, setEditingRow] = useState<any>(null);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingSupplierDetails, setLoadingSupplierDetails] = useState(false);
//   const [paymentTerms, setPaymentTerms] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [productCategories, setProductCategories] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [supplierImagePreview, setSupplierImagePreview] = useState<
//     string | null
//   >(null);
//   const [selectedImagePreview, setSelectedImagePreview] = useState<
//     string | null
//   >(null);
//   const [selectedPaymentTermName, setSelectedPaymentTermName] =
//     useState<string>("");

//   // Form state
//   const [formData, setFormData] = useState({
//     companyName: "",
//     representativeName: "",
//     phone: "",
//     email: "",
//     businessAddress: "",
//     bankAccount: "",
//     paymentTerms: "",
//     status: "active",
//     supplierPriority: "primary",
//     productsSupplied: [] as string[],
//     profilePicture: "",
//   });

//   const navigate = useNavigate();

//   // Fetch payment terms and product categories on component mount
//   useEffect(() => {
//     fetchPaymentTerms();
//     fetchProductCategories();
//   }, []);

//   // Preview uploaded file
//   useEffect(() => {
//     if (uploadedFile) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(uploadedFile);
//     } else {
//       setSelectedImagePreview(null);
//     }
//   }, [uploadedFile]);

//   // Fetch payment terms
//   const fetchPaymentTerms = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/allTemplates`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setPaymentTerms(response.data.data);
//       } else {
//         toast.error(response.data.message || "Failed to fetch payment terms");
//       }
//     } catch (error) {
//       console.error("Error fetching payment terms:", error);
//       toast.error("An error occurred while fetching payment terms");
//     }
//   };

//   // Fetch product categories
//   const fetchProductCategories = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getAllCategory`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setProductCategories(response.data.data);
//       } else {
//         toast.error(
//           response.data.message || "Failed to fetch product categories"
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching product categories:", error);
//       toast.error("An error occurred while fetching product categories");
//     }
//   };

//   // Fetch supplier details when edit button is clicked
//   const fetchSupplierDetails = async (supplierId: string) => {
//     setLoadingSupplierDetails(true);
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getOneSupplier/${supplierId}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const supplierDetails = response.data.data;
//         console.log("Supplier details fetched:", supplierDetails);

//         // Update form data with supplier details
//         setFormData({
//           companyName: supplierDetails.companyName || "",
//           representativeName: supplierDetails.representativeName || "",
//           phone: supplierDetails.phone || "",
//           email: supplierDetails.email || "",
//           businessAddress: supplierDetails.businessAddress || "",
//           bankAccount: supplierDetails.bankAccount || "",
//           status: supplierDetails.status || "active",
//           supplierPriority: supplierDetails.supplierPriority || "primary",
//           productsSupplied:
//             supplierDetails.productsSupplied.map((p: any) => p._id) || [],
//           paymentTerms: supplierDetails.paymentTerms?._id || "",
//           profilePicture: supplierDetails.profilePicture || "",
//         });

//         // Set selected payment term name for dropdown
//         if (supplierDetails.paymentTerms) {
//           setSelectedPaymentTermName(supplierDetails.paymentTerms.name || "");
//         }

//         // Set selected products for display
//         setSelectedProducts(
//           supplierDetails.productsSupplied.map((p: any) => p.name) || []
//         );

//         // Set image preview if available
//         if (supplierDetails.profilePicture) {
//           setSupplierImagePreview(
//             `${API_URL}${supplierDetails.profilePicture}`
//           );
//         } else {
//           setSupplierImagePreview(null);
//         }
//       } else {
//         toast.error(
//           response.data.message || "Failed to fetch supplier details"
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching supplier details:", error);
//       if (axios.isAxiosError(error)) {
//         if (!error.response) {
//           toast.error("Network error. Please check your internet connection.");
//         } else {
//           toast.error(
//             error.response.data.message || "Failed to fetch supplier details"
//           );
//         }
//       } else {
//         toast.error(
//           "An unexpected error occurred while fetching supplier details"
//         );
//       }
//     } finally {
//       setLoadingSupplierDetails(false);
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle radio button change
//   const handleRadioChange = (name: string, value: string) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle payment term selection
//   const handlePaymentTermSelect = (value: string) => {
//     // Find the payment term ID by name
//     const term = paymentTerms.find((t) => t.name === value);
//     if (term) {
//       setFormData({
//         ...formData,
//         paymentTerms: term._id,
//       });
//       setSelectedPaymentTermName(value);
//     }
//   };

//   // Handle product selection
//   const handleProductSelect = (value: string) => {
//     // Find the product ID by name
//     const product = productCategories.find((p) => p.name === value);
//     if (product) {
//       // Check if product is already selected
//       if (!formData.productsSupplied.includes(product._id)) {
//         setFormData({
//           ...formData,
//           productsSupplied: [...formData.productsSupplied, product._id],
//         });
//         setSelectedProducts([...selectedProducts, product.name]);
//       } else {
//         toast.info("This product is already selected");
//       }
//     }
//   };

//   // Remove a selected product
//   const removeProduct = (index: number) => {
//     const updatedProducts = [...formData.productsSupplied];
//     updatedProducts.splice(index, 1);

//     const updatedProductNames = [...selectedProducts];
//     updatedProductNames.splice(index, 1);

//     setFormData({
//       ...formData,
//       productsSupplied: updatedProducts,
//     });
//     setSelectedProducts(updatedProductNames);
//   };

//   // Handle form submission for updating supplier
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation checks
//     if (!formData.companyName) {
//       toast.error("Company name is required");
//       return;
//     }

//     if (!formData.representativeName) {
//       toast.error("Representative name is required");
//       return;
//     }

//     if (!formData.phone) {
//       toast.error("Phone number is required");
//       return;
//     }

//     if (!formData.email) {
//       toast.error("Email is required");
//       return;
//     }

//     if (!formData.businessAddress) {
//       toast.error("Business address is required");
//       return;
//     }

//     if (formData.productsSupplied.length === 0) {
//       toast.error("At least one product must be selected");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData();

//       // Add all form fields to FormData
//       formDataToSend.append("companyName", formData.companyName);
//       formDataToSend.append("representativeName", formData.representativeName);
//       formDataToSend.append("phone", formData.phone);
//       formDataToSend.append("email", formData.email);
//       formDataToSend.append("businessAddress", formData.businessAddress);
//       formDataToSend.append("bankAccount", formData.bankAccount || "");
//       formDataToSend.append("status", formData.status);
//       formDataToSend.append("supplierPriority", formData.supplierPriority);

//       // Handle payment terms
//       if (formData.paymentTerms) {
//         formDataToSend.append("paymentTerms", formData.paymentTerms);
//       }

//       // Handle products supplied array properly
//       if (formData.productsSupplied && formData.productsSupplied.length > 0) {
//         // Use a different approach for arrays
//         formData.productsSupplied.forEach((productId, index) => {
//           formDataToSend.append(`productsSupplied[${index}]`, productId);
//         });
//       }

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profilePicture", uploadedFile);
//       }

//       // For debugging purposes
//       for (const pair of formDataToSend.entries()) {
//         console.log(pair[0] + ": " + pair[1]);
//       }

//       const response = await axios.put(
//         `${API_URL}/api/abid-jewelry-ms/updateSupplier/${editingRow.id}`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Supplier updated successfully!");

//         // Close the edit modal
//         setIsEditing(false);

//         // Reset form
//         setFormData({
//           companyName: "",
//           representativeName: "",
//           phone: "",
//           email: "",
//           businessAddress: "",
//           bankAccount: "",
//           paymentTerms: "",
//           status: "active",
//           supplierPriority: "primary",
//           productsSupplied: [],
//           profilePicture: "",
//         });
//         setSelectedProducts([]);
//         setUploadedFile(null);
//         setSupplierImagePreview(null);
//         setSelectedImagePreview(null);
//         setSelectedPaymentTermName("");

//         // Notify parent component about the update to refresh the data
//         if (onEdit) {
//           onEdit(null);
//         }
//       } else {
//         toast.error(response.data.message || "Failed to update supplier");
//       }
//     } catch (error) {
//       console.error("Error updating supplier:", error);
//       if (axios.isAxiosError(error)) {
//         console.log("Response data:", error.response?.data);
//         if (!error.response) {
//           toast.error("Network error. Please check your internet connection.");
//         } else {
//           toast.error(
//             error.response.data.message || "Failed to update supplier"
//           );
//         }
//       } else {
//         toast.error("An unexpected error occurred while updating supplier");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle supplier deletion
//   const handleDeleteSupplier = async () => {
//     try {
//       const API_URL =
//         import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.delete(
//         `${API_URL}/api/abid-jewelry-ms/deleteSupplier/${deleteSupplier.id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Supplier deleted successfully!");

//         // Notify parent component about the deletion to refresh the data
//         if (onDelete) {
//           onDelete(null);
//         }

//         setShowDeleteModal(false);
//         setDeleteModal(true); // Show success modal
//       } else {
//         toast.error(response.data.message || "Failed to delete supplier");
//       }
//     } catch (error) {
//       console.error("Error deleting supplier:", error);
//       if (axios.isAxiosError(error)) {
//         if (!error.response) {
//           toast.error("Network error. Please check your internet connection.");
//         } else {
//           toast.error(
//             error.response.data.message || "Failed to delete supplier"
//           );
//         }
//       } else {
//         toast.error("An unexpected error occurred while deleting supplier");
//       }
//     }
//   };

//   const filteredData = data.filter((item) => {
//     // Only search in name and id fields
//     const nameMatch =
//       item.name?.toLowerCase().includes(search.toLowerCase()) || false;
//     const idMatch =
//       item.id?.toLowerCase().includes(search.toLowerCase()) || false;
//     const supplierIdMatch =
//       item.supplierId?.toLowerCase().includes(search.toLowerCase()) || false;

//     const matchesSearch = nameMatch || idMatch || supplierIdMatch;
//     const matchesStatus =
//       statusFilter === "All" || item.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const currentData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleChangePage = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//   return (
//     <>
//       <div
//         className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
//       >
//         {/* Search + Filter */}
//         <div
//           className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
//             data.some((item) => item.hasOwnProperty("status"))
//               ? ""
//               : "grid-cols-2"
//           }`}
//         >
//           <div className="flex gap-3">
//             {searchable && (
//               <Input
//                 placeholder="Search Store name, ID"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="max-w-full sm:max-w-sm !rounded-3xl outline-none "
//               />
//             )}

//             {filterByStatus &&
//               data.some((item) => item.hasOwnProperty("status")) && (
//                 <Dropdown
//                   options={["All", "Active", "Inactive"]}
//                   DropDownName="Status"
//                   defaultValue="All"
//                   onSelect={(val) => {
//                     setStatusFilter(val);
//                     setCurrentPage(1);
//                   }}
//                 />
//               )}
//           </div>
//           <div
//             className={`flex md:justify-end gap-4 ${
//               data.some((item) => item.hasOwnProperty("status"))
//                 ? "justify-start"
//                 : "justify-end"
//             }`}
//           >
//             <Button
//               text="Export"
//               variant="border"
//               className="bg-[#5D6679] text-white w-24"
//             />
//             <Button
//               text="Add Suppliers"
//               variant="border"
//               onClick={() => navigate("/dashboard/suppliers/add-suppliers")}
//               className="!bg-[#4E4FEB] text-white w-32 border-none"
//             />
//           </div>
//         </div>

//         <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

//         {/* Table */}
//         <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-700 ">
//             <thead className="bg-[#F9FAFB] text-black">
//               <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
//                 {columns.map((col, index) => {
//                   const isFirst = index === 0;
//                   const isLast = index === columns.length - 1;

//                   return (
//                     <th
//                       key={col.accessor}
//                       className="px-4 py-3 whitespace-nowrap text-left"
//                       style={{
//                         ...(isFirst && { width: "20%", whiteSpace: "nowrap" }),
//                         ...(isLast && { width: "8%", whiteSpace: "nowrap" }),
//                       }}
//                     >
//                       {col.header}
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>
//             <tbody className="border-b border-gray-400">
//               {currentData.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className="hover:bg-gray-50 whitespace-nowrap cursor-pointer "
//                   onClick={() => {
//                     if (onRowClick) {
//                       onRowClick(row);
//                     } else if (enableRowModal) {
//                       setSelectedUser(row);
//                     }
//                   }}
//                 >
//                   {columns.map((col, index) => {
//                     const isFirst = index === 0;
//                     const isLast = index === columns.length - 1;

//                     return (
//                       <td
//                         key={col.accessor}
//                         className="px-4 py-2"
//                         style={{ width: "max-content" }}
//                       >
//                         <div
//                           className={`flex flex-row items-center ${
//                             isFirst
//                               ? "justify-start"
//                               : isLast
//                               ? "justify-end"
//                               : tableDataAlignment === "zone"
//                               ? "justify-center"
//                               : "justify-start"
//                           }`}
//                         >
//                           {(() => {
//                             switch (col.type) {
//                               case "image":
//                                 return (
//                                   <div className="flex gap-2 items-center pr-5 md:pr-0">
//                                     {row.userImage ? (
//                                       <>
//                                         <img
//                                           src={
//                                             `${API_URL || "/placeholder.svg"}${
//                                               row.userImage
//                                             }` || "/placeholder.svg"
//                                           }
//                                           alt="User"
//                                           className="w-8 h-8 rounded-full"
//                                         />
//                                         {row.name}
//                                       </>
//                                     ) : (
//                                       <>{row.name}</>
//                                     )}
//                                   </div>
//                                 );
//                               case "status":
//                                 return (
//                                   <span
//                                     className={`inline-block px-2 py-1 text-xs rounded-full ${
//                                       row.status === "Active"
//                                         ? "bg-green-100 text-green-600"
//                                         : "bg-red-100 text-red-600"
//                                     }`}
//                                   >
//                                     {row.status}
//                                   </span>
//                                 );
//                               case "actions":
//                                 return (
//                                   <div className="flex justify-start gap-2 w-full">
//                                     {eye && (
//                                       <LuEye
//                                         className="cursor-pointer"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           navigate("purchase-order-detail");
//                                         }}
//                                       />
//                                     )}
//                                     <RiEditLine
//                                       className="cursor-pointer"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setIsEditing(true);
//                                         setEditingRow(row);
//                                         fetchSupplierDetails(row.id);
//                                       }}
//                                     />
//                                     <AiOutlineDelete
//                                       className="cursor-pointer hover:text-red-500"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setShowDeleteModal(true);
//                                         setDeleteSupplier(row);
//                                       }}
//                                     />
//                                   </div>
//                                 );
//                               default:
//                                 return <>{row[col.accessor]}</>;
//                             }
//                           })()}
//                         </div>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//               {currentData.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={columns.length}
//                     className="text-center py-6 text-gray-500"
//                   >
//                     No data found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div
//             className={`flex flex-col ${
//               dealBy ? "md:flex-col gap-3" : "md:flex-row"
//             } items-center justify-between px-4 py-4`}
//           >
//             <div className="flex items-center justify-center gap-2">
//               <button
//                 onClick={() => handleChangePage(currentPage - 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//               >
//                 <GoChevronLeft size={18} />
//               </button>

//               {[1, 2, 3, 10].map((num, idx) => (
//                 <React.Fragment key={num}>
//                   {idx === 3 && (
//                     <div>
//                       <span className="text-gray-500 px-0.5">•</span>
//                       <span className="text-gray-500 px-0.5">•</span>
//                       <span className="text-gray-500 px-0.5">•</span>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => handleChangePage(num)}
//                     className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
//                       currentPage === num
//                         ? "bg-[#407BFF] text-white"
//                         : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 </React.Fragment>
//               ))}

//               <button
//                 onClick={() => handleChangePage(currentPage + 1)}
//                 className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
//               >
//                 <GoChevronRight size={18} />
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mt-2 md:mt-0">
//               <span className="text-sm">Show:</span>
//               <Dropdown
//                 options={["5 Row", "10 Row", "15 Row", "20 Row"]}
//                 onSelect={(val) => {
//                   const selected = Number.parseInt(val.split(" ")[0]);
//                   setRowsPerPage(selected);
//                   setCurrentPage(1);
//                 }}
//                 className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedUser && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setSelectedUser(null)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Supplier Details</h2>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="text-center">
//               <div className="mt-3 w-full flex">
//                 <span
//                   className={`text-sm px-3 py-1 rounded-md ml-auto ${
//                     selectedUser.status === "Active"
//                       ? "text-[#10A760] bg-[#34C75933]"
//                       : "text-red-600 bg-red-100"
//                   }`}
//                 >
//                   {selectedUser.status}
//                 </span>
//               </div>
//               <img
//                 src={
//                   selectedUser.userImage
//                     ? `${API_URL}${selectedUser.userImage}`
//                     : "/placeholder.svg"
//                 }
//                 alt={selectedUser.name}
//                 className="w-36 h-36 mx-auto rounded-full object-cover"
//               />
//               <div className="my-5"></div>
//               <h3 className="text-xl font-bold mt-1">
//                 {selectedUser.name} ({selectedUser.supplierId})
//               </h3>
//               <div className="mt-2 text-black text-sm font-bold">
//                 {selectedUser.companyName || "Company Name Not Available"}
//               </div>
//               <div className="flex justify-center gap-6 text-[#71717A] mt-2">
//                 <p>{selectedUser.email || "Email Not Available"}</p>
//                 <p>{selectedUser.phone || "Phone Not Available"}</p>
//               </div>
//               <p className="text-[#71717A] italic">
//                 {selectedUser.businessAddress || "Address Not Available"}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Supplier Modal */}
//       {isEditing && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => setIsEditing(false)}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl p-6 w-[90vw] sm:w-lg md:w-2xl lg:w-3xl xl:w-4xl mx-auto relative shadow-md overflow-y-auto max-h-[90vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-[#056BB7]">
//                 Edit Supplier
//               </h2>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>

//             {loadingSupplierDetails ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 Poppins-font font-medium">
//                   {/* Left Column */}
//                   <div className="space-y-4">
//                     <div className="flex flex-col">
//                       <label htmlFor="companyName" className="mb-1">
//                         Company Name
//                       </label>
//                       <Input
//                         name="companyName"
//                         placeholder="Company Name"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.companyName}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="representativeName" className="mb-1">
//                         Representative Name
//                       </label>
//                       <Input
//                         name="representativeName"
//                         placeholder="Individual Name"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.representativeName}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div className="flex flex-col">
//                       <label htmlFor="phone" className="mb-1">
//                         Phone no
//                       </label>
//                       <Input
//                         name="phone"
//                         placeholder="+56 362738233"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="email" className="mb-1">
//                         Email
//                       </label>
//                       <Input
//                         name="email"
//                         placeholder="john@example.com"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                       />
//                     </div>

//                     <div className="flex flex-col">
//                       <label htmlFor="businessAddress" className="mb-1">
//                         Business Address
//                       </label>
//                       <Input
//                         name="businessAddress"
//                         placeholder="Street, City, State, Zip Code, Country"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.businessAddress}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="bankAccount" className="mb-1">
//                         Bank Account Details
//                       </label>
//                       <Input
//                         name="bankAccount"
//                         placeholder="Enter IBAN (e.g, GB29 NWBK 6016 1331 9268 19)"
//                         className="outline-none focus:outline-none w-full"
//                         value={formData.bankAccount}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-4">
//                     <div className="flex flex-col">
//                       <label htmlFor="productsSupplied" className="mb-1">
//                         Product Supplied
//                       </label>

//                       <Dropdown
//                         options={productCategories.map((cat) => cat.name)}
//                         defaultValue="Select Product"
//                         onSelect={handleProductSelect}
//                       />

//                       {/* Display selected products */}
//                       {selectedProducts.length > 0 && (
//                         <div className="mt-2">
//                           <p className="text-sm font-medium mb-1">
//                             Selected Products:
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {selectedProducts.map((name, index) => (
//                               <div
//                                 key={index}
//                                 className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                               >
//                                 <span>{name}</span>
//                                 <button
//                                   type="button"
//                                   className="ml-2 text-blue-600 hover:text-blue-800"
//                                   onClick={() => removeProduct(index)}
//                                 >
//                                   ×
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-col">
//                       <label htmlFor="paymentTerms" className="mb-1">
//                         Payment Terms
//                       </label>
//                       <Dropdown
//                         options={paymentTerms.map((term) => term.name)}
//                         defaultValue={
//                           selectedPaymentTermName || "Select Payment Term"
//                         }
//                         onSelect={handlePaymentTermSelect}
//                       />
//                     </div>

//                     <div className="flex flex-col">
//                       <label className="mb-1">Status</label>
//                       <div className="flex gap-4 mt-1">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="status"
//                             value="active"
//                             checked={formData.status === "active"}
//                             onChange={() =>
//                               handleRadioChange("status", "active")
//                             }
//                             className="form-radio h-4 w-4 text-blue-600"
//                           />
//                           <span>Active</span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="status"
//                             value="inactive"
//                             checked={formData.status === "inactive"}
//                             onChange={() =>
//                               handleRadioChange("status", "inactive")
//                             }
//                             className="form-radio h-4 w-4 text-blue-600"
//                           />
//                           <span>Inactive</span>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="flex flex-col">
//                       <label className="mb-1">Priority</label>
//                       <div className="flex gap-4 mt-1">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="supplierPriority"
//                             value="primary"
//                             checked={formData.supplierPriority === "primary"}
//                             onChange={() =>
//                               handleRadioChange("supplierPriority", "primary")
//                             }
//                             className="form-radio h-4 w-4 text-blue-600"
//                           />
//                           <span>Primary</span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="radio"
//                             name="supplierPriority"
//                             value="secondary"
//                             checked={formData.supplierPriority === "secondary"}
//                             onChange={() =>
//                               handleRadioChange("supplierPriority", "secondary")
//                             }
//                             className="form-radio h-4 w-4 text-blue-600"
//                           />
//                           <span>Secondary</span>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="flex flex-col">
//                       <label className="mb-1">Upload Image</label>
//                       <DropImage
//                         uploadedFile={uploadedFile}
//                         setUploadedFile={setUploadedFile}
//                         className="w-full"
//                       />

//                       {/* Show current image if available */}
//                       {supplierImagePreview && !selectedImagePreview && (
//                         <div className="mt-4">
//                           <p className="text-sm font-medium mb-2">
//                             Current Image:
//                           </p>
//                           <img
//                             src={supplierImagePreview}
//                             alt="Current profile"
//                             className="w-32 h-32 object-cover rounded-md border border-gray-300"
//                           />
//                         </div>
//                       )}

//                       {/* Show selected image preview if available */}
//                       {selectedImagePreview && (
//                         <div className="mt-4">
//                           <p className="text-sm font-medium mb-2">
//                             New Image Selected:
//                           </p>
//                           <img
//                             src={selectedImagePreview}
//                             alt="New profile"
//                             className="w-32 h-32 object-cover rounded-md border border-gray-300"
//                           />
//                           <p className="text-sm text-green-600 mt-2">
//                             {uploadedFile?.name}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-4 mt-6">
//                   <Button
//                     text="Cancel"
//                     type="button"
//                     onClick={() => setIsEditing(false)}
//                     className="px-6 !bg-[#F4F4F5] !border-none"
//                   />
//                   <Button
//                     text={isSubmitting ? "Updating..." : "Update"}
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-6 !bg-[#056BB7] border-none text-white"
//                   />
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => {
//             setShowDeleteModal(false);
//             setDeleteSupplier(null);
//           }}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">
//                 Delete {deleteSupplier?.name}
//               </h2>
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ?
//               </h3>
//               <p className="text-sm text-gray-700">
//                 Are you sure you want to delete this{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//                 ?
//               </p>
//               <p className="text-sm text-red-600 font-medium mt-1">
//                 This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               >
//                 Cancel
//               </button>
//               <Button
//                 text="Delete"
//                 icon={<AiOutlineDelete />}
//                 onClick={handleDeleteSupplier}
//                 className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Success Modal */}
//       {deleteModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
//           onClick={() => {
//             setDeleteModal(false);
//             setDeleteSupplier(null);
//           }}
//         >
//           <div
//             className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h2 className="text-xl font-medium">
//                 Delete {deleteSupplier?.name}
//               </h2>
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="text-xl font-bold text-gray-500 hover:text-gray-700"
//               >
//                 ×
//               </button>
//             </div>
//             {/* Body */}
//             <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <h3 className="text-lg font-semibold mb-1">
//                 Delete{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}
//               </h3>
//               <p className="text-sm text-gray-700">
//                 The{" "}
//                 {tableTitle?.endsWith("s")
//                   ? tableTitle?.slice(0, -1)
//                   : tableTitle}{" "}
//                 has been removed successfully.
//               </p>
//             </div>
//             <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
//               <Button
//                 text="Close"
//                 onClick={() => setDeleteModal(false)}
//                 className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SupplierTable;

import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";

import Input from "./Input";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { DropImage } from "./UploadPicture";

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

type ColumnType = "text" | "image" | "status" | "actions" | "button" | "custom";

interface Column {
  header: string;
  accessor: string;
  type?: ColumnType;
}

export interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  userImage?: string;
  [key: string]: any;
}

interface SupplierTableProps {
  columns: Column[];
  data: any[];
  tableTitle?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  searchable?: boolean;
  filterByStatus?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  tableDataAlignment?: "zone" | "user" | "center"; // Add more if needed
  className?: string;
  onRowClick?: (row: any) => void;
  dealBy?: boolean;
  enableRowModal?: boolean;
  eye?: boolean;
  canAdd?: boolean;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const SupplierTable: React.FC<SupplierTableProps> = ({
  eye,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 5,
  searchable = true,
  filterByStatus = true,
  onEdit,
  onDelete,
  tableDataAlignment = "start", // default
  dealBy,
  canAdd = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteSupplier, setDeleteSupplier] = useState<any>(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state
  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSupplierDetails, setLoadingSupplierDetails] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState<
    { _id: string; name: string }[]
  >([]);
  const [productCategories, setProductCategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [supplierImagePreview, setSupplierImagePreview] = useState<
    string | null
  >(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const [selectedPaymentTermName, setSelectedPaymentTermName] =
    useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    phone: "",
    email: "",
    businessAddress: "",
    bankAccount: "",
    paymentTerms: "",
    status: "active",
    supplierPriority: "primary",
    productsSupplied: [] as string[],
    profilePicture: "",
  });

  const navigate = useNavigate();

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  // Fetch payment terms and product categories on component mount
  useEffect(() => {
    fetchPaymentTerms();
    fetchProductCategories();
  }, []);

  // Preview uploaded file
  useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setSelectedImagePreview(null);
    }
  }, [uploadedFile]);

  // Fetch payment terms
  const fetchPaymentTerms = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/allTemplates`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPaymentTerms(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch payment terms");
      }
    } catch (error) {
      console.error("Error fetching payment terms:", error);
      toast.error("An error occurred while fetching payment terms");
    }
  };

  // Fetch product categories
  const fetchProductCategories = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setProductCategories(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch product categories"
        );
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      toast.error("An error occurred while fetching product categories");
    }
  };

  // Fetch supplier details when edit button is clicked
  const fetchSupplierDetails = async (supplierId: string) => {
    setLoadingSupplierDetails(true);
    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneSupplier/${supplierId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const supplierDetails = response.data.data;
        console.log("Supplier details fetched:", supplierDetails);

        // Update form data with supplier details
        setFormData({
          companyName: supplierDetails.companyName || "",
          representativeName: supplierDetails.representativeName || "",
          phone: supplierDetails.phone || "",
          email: supplierDetails.email || "",
          businessAddress: supplierDetails.businessAddress || "",
          bankAccount: supplierDetails.bankAccount || "",
          status: supplierDetails.status || "active",
          supplierPriority: supplierDetails.supplierPriority || "primary",
          productsSupplied:
            supplierDetails.productsSupplied.map((p: any) => p._id) || [],
          paymentTerms: supplierDetails.paymentTerms?._id || "",
          profilePicture: supplierDetails.profilePicture || "",
        });

        // Set selected payment term name for dropdown
        if (supplierDetails.paymentTerms) {
          setSelectedPaymentTermName(supplierDetails.paymentTerms.name || "");
        }

        // Set selected products for display
        setSelectedProducts(
          supplierDetails.productsSupplied.map((p: any) => p.name) || []
        );

        // Set image preview if available
        if (supplierDetails.profilePicture) {
          setSupplierImagePreview(
            `${API_URL}${supplierDetails.profilePicture}`
          );
        } else {
          setSupplierImagePreview(null);
        }
      } else {
        toast.error(
          response.data.message || "Failed to fetch supplier details"
        );
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch supplier details"
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred while fetching supplier details"
        );
      }
    } finally {
      setLoadingSupplierDetails(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle radio button change
  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle payment term selection
  const handlePaymentTermSelect = (value: string) => {
    // Find the payment term ID by name
    const term = paymentTerms.find((t) => t.name === value);
    if (term) {
      setFormData({
        ...formData,
        paymentTerms: term._id,
      });
      setSelectedPaymentTermName(value);
    }
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    // Find the product ID by name
    const product = productCategories.find((p) => p.name === value);
    if (product) {
      // Check if product is already selected
      if (!formData.productsSupplied.includes(product._id)) {
        setFormData({
          ...formData,
          productsSupplied: [...formData.productsSupplied, product._id],
        });
        setSelectedProducts([...selectedProducts, product.name]);
      } else {
        toast.info("This product is already selected");
      }
    }
  };

  // Remove a selected product
  const removeProduct = (index: number) => {
    const updatedProducts = [...formData.productsSupplied];
    updatedProducts.splice(index, 1);

    const updatedProductNames = [...selectedProducts];
    updatedProductNames.splice(index, 1);

    setFormData({
      ...formData,
      productsSupplied: updatedProducts,
    });
    setSelectedProducts(updatedProductNames);
  };

  // Handle edit click - Always show icon but check permission when clicked
  const handleEditClick = (row: any) => {
    const canEdit = isAdmin || hasPermission("Suppliers", "update");

    if (!canEdit) {
      toast.error("You don't have permission to edit supplier");
      return;
    }

    setIsEditing(true);
    setEditingRow(row);
    fetchSupplierDetails(row.id);
  };

  // Handle delete click - Always show icon but check permission when clicked
  const handleDeleteClick = (row: any) => {
    const canDelete = isAdmin || hasPermission("Suppliers", "delete");

    if (!canDelete) {
      toast.error("You don't have permission to delete supplier");
      return;
    }

    setShowDeleteModal(true);
    setDeleteSupplier(row);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces

  // Add these validation functions
  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return nameRegex.test(name);
  };

  // Handle form submission for updating supplier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const canEdit = isAdmin || hasPermission("Suppliers", "update");

    if (!canEdit) {
      toast.error("You don't have permission to edit supplier");
      return;
    }

    // Validation checks
    if (!formData.companyName) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.representativeName) {
      toast.error("Representative name is required");
      return;
    }

    if (!formData.phone) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!formData.businessAddress) {
      toast.error("Business address is required");
      return;
    }

    if (formData.productsSupplied.length === 0) {
      toast.error("At least one product must be selected");
      return;
    }

    if (!validateName(formData.companyName)) {
      toast.error("Company name should only contain letters");
      return;
    }

    if (!validateName(formData.representativeName)) {
      toast.error("Representative name should only contain letters");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);

    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("representativeName", formData.representativeName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("businessAddress", formData.businessAddress);
      formDataToSend.append("bankAccount", formData.bankAccount || "");
      formDataToSend.append("status", formData.status);
      formDataToSend.append("supplierPriority", formData.supplierPriority);

      // Handle payment terms
      if (formData.paymentTerms) {
        formDataToSend.append("paymentTerms", formData.paymentTerms);
      }

      // Handle products supplied array properly
      if (formData.productsSupplied && formData.productsSupplied.length > 0) {
        // Use a different approach for arrays
        formData.productsSupplied.forEach((productId, index) => {
          formDataToSend.append(`productsSupplied[${index}]`, productId);
        });
      }

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profilePicture", uploadedFile);
      }

      // For debugging purposes
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.put(
        `${API_URL}/api/abid-jewelry-ms/updateSupplier/${editingRow.id}`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Supplier updated successfully!");

        // Close the edit modal
        setIsEditing(false);

        // Reset form
        setFormData({
          companyName: "",
          representativeName: "",
          phone: "",
          email: "",
          businessAddress: "",
          bankAccount: "",
          paymentTerms: "",
          status: "active",
          supplierPriority: "primary",
          productsSupplied: [],
          profilePicture: "",
        });
        setSelectedProducts([]);
        setUploadedFile(null);
        setSupplierImagePreview(null);
        setSelectedImagePreview(null);
        setSelectedPaymentTermName("");

        // Notify parent component about the update to refresh the data
        if (onEdit) {
          onEdit(null);
        }
      } else {
        toast.error(response.data.message || "Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      if (axios.isAxiosError(error)) {
        console.log("Response data:", error.response?.data);
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to update supplier"
          );
        }
      } else {
        toast.error("An unexpected error occurred while updating supplier");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle supplier deletion
  const handleDeleteSupplier = async () => {
    const canDelete = isAdmin || hasPermission("Suppliers", "delete");

    if (!canDelete) {
      toast.error("You don't have permission to delete supplier");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteSupplier/${deleteSupplier.id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Supplier deleted successfully!");

        // Notify parent component about the deletion to refresh the data
        if (onDelete) {
          onDelete(null);
        }

        setShowDeleteModal(false);
        setDeleteModal(true); // Show success modal
      } else {
        toast.error(response.data.message || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to delete supplier"
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting supplier");
      }
    }
  };

  const filteredData = data.filter((item) => {
    // Only search in name and id fields
    const nameMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const idMatch =
      item.id?.toLowerCase().includes(search.toLowerCase()) || false;
    const supplierIdMatch =
      item.supplierId?.toLowerCase().includes(search.toLowerCase()) || false;

    const matchesSearch = nameMatch || idMatch || supplierIdMatch;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 flex flex-col gap-5 overflow-hidden shadow-md ${className}`}
      >
        {/* Search + Filter */}
        <div
          className={`grid gap-4 items-center justify-between md:grid-cols-2 ${
            data.some((item) => item.hasOwnProperty("status"))
              ? ""
              : "grid-cols-2"
          }`}
        >
          <div className="flex gap-3">
            {searchable && (
              <Input
                placeholder="Search Store name, ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-full sm:max-w-sm !rounded-3xl outline-none "
              />
            )}

            {filterByStatus &&
              data.some((item) => item.hasOwnProperty("status")) && (
                <Dropdown
                  options={["All", "Active", "Inactive"]}
                  DropDownName="Status"
                  defaultValue="All"
                  onSelect={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                />
              )}
          </div>
          <div
            className={`flex md:justify-end gap-4 ${
              data.some((item) => item.hasOwnProperty("status"))
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <Button
              text="Export"
              variant="border"
              className="bg-[#5D6679] text-white w-24"
            />
            {canAdd && (
              <Button
                text="Add Suppliers"
                variant="border"
                onClick={() => navigate("/dashboard/suppliers/add-suppliers")}
                className="!bg-[#4E4FEB] text-white w-32 border-none"
              />
            )}
          </div>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px]">{tableTitle}</p>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 ">
            <thead className="bg-[#F9FAFB] text-black">
              <tr className="font-semibold text-[16px] whitespace-nowrap w-full">
                {columns.map((col, index) => {
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;

                  return (
                    <th
                      key={col.accessor}
                      className="px-4 py-3 whitespace-nowrap text-left"
                      style={{
                        ...(isFirst && { width: "25%", whiteSpace: "nowrap" }),
                        ...(isLast && { width: "10%", whiteSpace: "nowrap" }),
                      }}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="border-b border-gray-400">
              {currentData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 whitespace-nowrap cursor-pointer "
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    } else if (enableRowModal) {
                      setSelectedUser(row);
                    }
                  }}
                >
                  {columns.map((col, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;

                    return (
                      <td
                        key={col.accessor}
                        className="px-4 py-2"
                        style={{ width: "max-content" }}
                      >
                        <div
                          className={`flex flex-row items-center ${
                            isFirst
                              ? "justify-start"
                              : isLast
                              ? "justify-end"
                              : tableDataAlignment === "zone"
                              ? "justify-center"
                              : "justify-start"
                          }`}
                        >
                          {(() => {
                            switch (col.type) {
                              case "image":
                                return (
                                  <div className="flex gap-2 items-center pr-5 md:pr-0">
                                    {row.userImage ? (
                                      <>
                                        <img
                                          src={
                                            `${API_URL || "/placeholder.svg"}${
                                              row.userImage
                                            }` || "/placeholder.svg"
                                          }
                                          alt="User"
                                          className="w-8 h-8 rounded-full"
                                        />
                                        {row.name}
                                      </>
                                    ) : (
                                      <>{row.name}</>
                                    )}
                                  </div>
                                );
                              case "status":
                                return (
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      row.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                );
                              case "actions":
                                return (
                                  <div className="flex justify-start gap-2 w-full">
                                    {eye && (
                                      <LuEye
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("purchase-order-detail");
                                        }}
                                      />
                                    )}
                                    {/* Always show edit icon */}
                                    <RiEditLine
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(row);
                                      }}
                                    />
                                    {/* Always show delete icon */}
                                    <AiOutlineDelete
                                      className="cursor-pointer hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(row);
                                      }}
                                    />
                                  </div>
                                );
                              default:
                                return <>{row[col.accessor]}</>;
                            }
                          })()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            className={`flex flex-col ${
              dealBy ? "md:flex-col gap-3" : "md:flex-row"
            } items-center justify-between px-4 py-4`}
          >
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleChangePage(currentPage - 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
                disabled={currentPage === 1}
              >
                <GoChevronLeft size={18} />
              </button>

              {/* Always show page 1 */}
              <button
                onClick={() => handleChangePage(1)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                  currentPage === 1
                    ? "bg-[#407BFF] text-white"
                    : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                }`}
              >
                1
              </button>

              {/* Show dots if current page is far from start */}
              {currentPage > 3 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Show current page and surrounding pages (but not 1 or last page) */}
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter((page) => page > 1 && page < totalPages && page >= 1)
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChangePage(num)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                      currentPage === num
                        ? "bg-[#407BFF] text-white"
                        : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}

              {/* Show dots if current page is far from end */}
              {currentPage < totalPages - 2 && totalPages > 1 && (
                <div>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                  <span className="text-gray-500 px-0.5">•</span>
                </div>
              )}

              {/* Always show last page (if more than 1 page) */}
              {totalPages > 1 && (
                <button
                  onClick={() => handleChangePage(totalPages)}
                  className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                    currentPage === totalPages
                      ? "bg-[#407BFF] text-white"
                      : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handleChangePage(currentPage + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
                disabled={currentPage === totalPages}
              >
                <GoChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <span className="text-sm">Show:</span>
              <Dropdown
                options={["10 Row", "15 Row", "20 Row", "25 Row", "All"]}
                defaultValue="10 Row"
                onSelect={(val) => {
                  if (val === "All") {
                    setRowsPerPage(filteredData.length || data.length);
                  } else {
                    const selected = Number.parseInt(val.split(" ")[0]);
                    setRowsPerPage(selected);
                  }
                  setCurrentPage(1);
                }}
                className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-full max-w-sm mx-auto relative shadow-md transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Supplier Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <div className="mt-3 w-full flex">
                <span
                  className={`text-sm px-3 py-1 rounded-md ml-auto ${
                    selectedUser.status === "Active"
                      ? "text-[#10A760] bg-[#34C75933]"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <img
                src={
                  selectedUser.userImage
                    ? `${API_URL}${selectedUser.userImage}`
                    : "/placeholder.svg"
                }
                alt={selectedUser.name}
                className="w-36 h-36 mx-auto rounded-full object-cover"
              />
              <div className="my-5"></div>
              <h3 className="text-xl font-bold mt-1">
                {selectedUser.name} ({selectedUser.supplierId})
              </h3>
              <div className="mt-2 text-black text-sm font-bold">
                {selectedUser.companyName || "Company Name Not Available"}
              </div>
              <div className="flex justify-center gap-6 text-[#71717A] mt-2">
                <p>{selectedUser.email || "Email Not Available"}</p>
                <p>{selectedUser.phone || "Phone Not Available"}</p>
              </div>
              <p className="text-[#71717A] italic">
                {selectedUser.businessAddress || "Address Not Available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl p-6 w-[90vw] sm:w-lg md:w-2xl lg:w-3xl xl:w-4xl mx-auto relative shadow-md overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#056BB7]">
                Edit Supplier
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {loadingSupplierDetails ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 Poppins-font font-medium">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label htmlFor="companyName" className="mb-1">
                        Company Name
                      </label>
                      <Input
                        name="companyName"
                        placeholder="Company Name"
                        className="outline-none focus:outline-none w-full"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="representativeName" className="mb-1">
                        Representative Name
                      </label>
                      <Input
                        name="representativeName"
                        placeholder="Individual Name"
                        className="outline-none focus:outline-none w-full"
                        value={formData.representativeName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="phone" className="mb-1">
                        Phone no
                      </label>
                      <Input
                        type="number"
                        name="phone"
                        placeholder="+56 362738233"
                        className="outline-none focus:outline-none w-full"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="email" className="mb-1">
                        Email
                      </label>
                      <Input
                        name="email"
                        placeholder="john@example.com"
                        className="outline-none focus:outline-none w-full"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="businessAddress" className="mb-1">
                        Business Address
                      </label>
                      <Input
                        name="businessAddress"
                        placeholder="Street, City, State, Zip Code, Country"
                        className="outline-none focus:outline-none w-full"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="bankAccount" className="mb-1">
                        Bank Account Details
                      </label>
                      <Input
                        name="bankAccount"
                        placeholder="Enter IBAN (e.g, GB29 NWBK 6016 1331 9268 19)"
                        className="outline-none focus:outline-none w-full"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="productsSupplied" className="mb-1">
                        Product Supplied
                      </label>

                      <Dropdown
                        options={productCategories.map((cat) => cat.name)}
                        defaultValue="Select Product"
                        onSelect={handleProductSelect}
                        searchable={true}
                        noResultsMessage="No Product found"
                      />

                      {/* Display selected products */}
                      {selectedProducts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">
                            Selected Products:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProducts.map((name, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                <span>{name}</span>
                                <button
                                  type="button"
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                  onClick={() => removeProduct(index)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label htmlFor="paymentTerms" className="mb-1">
                        Payment Terms
                      </label>
                      <Dropdown
                        options={paymentTerms.map((term) => term.name)}
                        defaultValue={
                          selectedPaymentTermName || "Select Payment Term"
                        }
                        onSelect={handlePaymentTermSelect}
                        searchable={true}
                        noResultsMessage="No Payment Term found"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1">Status</label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={formData.status === "active"}
                            onChange={() =>
                              handleRadioChange("status", "active")
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span>Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={formData.status === "inactive"}
                            onChange={() =>
                              handleRadioChange("status", "inactive")
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span>Inactive</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1">Priority</label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="supplierPriority"
                            value="primary"
                            checked={formData.supplierPriority === "primary"}
                            onChange={() =>
                              handleRadioChange("supplierPriority", "primary")
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span>Primary</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="supplierPriority"
                            value="secondary"
                            checked={formData.supplierPriority === "secondary"}
                            onChange={() =>
                              handleRadioChange("supplierPriority", "secondary")
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span>Secondary</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1">Upload Image</label>
                      <DropImage
                        uploadedFile={uploadedFile}
                        setUploadedFile={setUploadedFile}
                        className="w-full"
                      />

                      {/* Show current image if available */}
                      {supplierImagePreview && !selectedImagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">
                            Current Image:
                          </p>
                          <img
                            src={supplierImagePreview}
                            alt="Current profile"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}

                      {/* Show selected image preview if available */}
                      {selectedImagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">
                            New Image Selected:
                          </p>
                          <img
                            src={selectedImagePreview}
                            alt="New profile"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                          />
                          <p className="text-sm text-green-600 mt-2">
                            {uploadedFile?.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    text="Cancel"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 !bg-[#F4F4F5] !border-none"
                  />
                  <Button
                    text={isSubmitting ? "Updating..." : "Update"}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 !bg-[#056BB7] border-none text-white"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteSupplier(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">
                Delete {deleteSupplier?.name}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ?
              </h3>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
                ?
              </p>
              <p className="text-sm text-red-600 font-medium mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              >
                Cancel
              </button>
              <Button
                text="Delete"
                icon={<AiOutlineDelete />}
                onClick={handleDeleteSupplier}
                className="!border-none px-5 py-1 bg-[#DC2626] hover:bg-red-700 text-white rounded-md flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
          onClick={() => {
            setDeleteModal(false);
            setDeleteSupplier(null);
          }}
        >
          <div
            className="animate-scaleIn bg-white rounded-xl w-full max-w-md relative shadow-lg border-3 border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h2 className="text-xl font-medium">
                Delete {deleteSupplier?.name}
              </h2>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="mt-8 text-start pb-8 px-6 shadow-[0_2px_2px_0_#00000026]">
              <h3 className="text-lg font-semibold mb-1">
                Delete{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}
              </h3>
              <p className="text-sm text-gray-700">
                The{" "}
                {tableTitle?.endsWith("s")
                  ? tableTitle?.slice(0, -1)
                  : tableTitle}{" "}
                has been removed successfully.
              </p>
            </div>
            <div className="flex justify-center gap-2 pb-3 py-4 px-6 shadow-[0_2px_2px_0_#00000026]">
              <Button
                text="Close"
                onClick={() => setDeleteModal(false)}
                className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierTable;
