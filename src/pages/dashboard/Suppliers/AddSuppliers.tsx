// import type React from "react"
// import { useState, useEffect } from "react"
// import Input from "../../../components/Input"
// import Button from "../../../components/Button"
// import Dropdown from "../../../components/Dropdown"
// import { DropImage } from "../../../components/UploadPicture"
// import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token")
//   if (!token) {
//     token = sessionStorage.getItem("token")
//   }
//   return token
// }

// interface AddUserProps {
//   uploadedFile: File | null
//   setUploadedFile: (file: File | null) => void
// }

// const AddSuppliers: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([])
//   const [paymentTerms, setPaymentTerms] = useState<{ _id: string; name: string }[]>([])
//   const [productCategories, setProductCategories] = useState<{ _id: string; name: string }[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   // const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
//   })

//   const navigate = useNavigate()

//   // Fetch payment terms and product categories on component mount
//   useEffect(() => {
//     fetchPaymentTerms()
//     fetchProductCategories()
//   }, [])

//   // Fetch payment terms
//   const fetchPaymentTerms = async () => {
//     try {
//       const API_URL = "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/allTemplates`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       })

//       if (response.data.success) {
//         console.log('response.data.data' , response.data.data)
//         setPaymentTerms(response.data.data)
//       } else {
//         toast.error(response.data.message || "Failed to fetch payment terms")
//       }
//     } catch (error) {
//       console.error("Error fetching payment terms:", error)
//       toast.error("An error occurred while fetching payment terms")
//     }
//   }

//   // Fetch product categories
//   const fetchProductCategories = async () => {
//     try {
//       const API_URL = "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/getAllCategory`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       })

//       if (response.data.success) {
//         setProductCategories(response.data.data)
//       } else {
//         toast.error(response.data.message || "Failed to fetch product categories")
//       }
//     } catch (error) {
//       console.error("Error fetching product categories:", error)
//       toast.error("An error occurred while fetching product categories")
//     }
//   }

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   // Handle radio button change
//   const handleRadioChange = (name: string, value: string) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   // Handle payment term selection
//   const handlePaymentTermSelect = (value: string) => {
//     // Find the payment term ID by name
//     const term = paymentTerms.find((t) => t.name === value)
//     if (term) {
//       setFormData({
//         ...formData,
//         paymentTerms: term._id,
//       })
//     }
//   }

//   // Handle product selection
//   const handleProductSelect = (value: string) => {
//     // Find the product ID by name
//     const product = productCategories.find((p) => p.name === value)
//     if (product) {
//       // Check if product is already selected
//       if (!formData.productsSupplied.includes(product._id)) {
//         setFormData({
//           ...formData,
//           productsSupplied: [...formData.productsSupplied, product._id],
//         })
//         setSelectedProducts([...selectedProducts, product.name])
//       } else {
//         toast.info("This product is already selected")
//       }
//     }
//   }

//   // Remove a selected product
//   const removeProduct = (index: number) => {
//     const updatedProducts = [...formData.productsSupplied]
//     updatedProducts.splice(index, 1)

//     const updatedProductNames = [...selectedProducts]
//     updatedProductNames.splice(index, 1)

//     setFormData({
//       ...formData,
//       productsSupplied: updatedProducts,
//     })
//     setSelectedProducts(updatedProductNames)
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation checks
//     if (!formData.companyName) {
//       toast.error("Company name is required")
//       return
//     }

//     if (!formData.representativeName) {
//       toast.error("Representative name is required")
//       return
//     }

//     if (!formData.phone) {
//       toast.error("Phone number is required")
//       return
//     }

//     if (!formData.email) {
//       toast.error("Email is required")
//       return
//     }

//     if (!formData.businessAddress) {
//       toast.error("Business address is required")
//       return
//     }

//     if (!formData.paymentTerms) {
//       toast.error("Payment term is required")
//       return
//     }

//     if (formData.productsSupplied.length === 0) {
//       toast.error("At least one product must be selected")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData()

//       // Add all form fields to FormData
//       formDataToSend.append("companyName", formData.companyName)
//       formDataToSend.append("representativeName", formData.representativeName)
//       formDataToSend.append("phone", formData.phone)
//       formDataToSend.append("email", formData.email)
//       formDataToSend.append("businessAddress", formData.businessAddress)
//       formDataToSend.append("bankAccount", formData.bankAccount || "")
//       formDataToSend.append("status", formData.status)
//       formDataToSend.append("supplierPriority", formData.supplierPriority)

//       // Only append payment terms if it exists
//       if (formData.paymentTerms) {
//         formDataToSend.append("paymentTerms", formData.paymentTerms)
//       }

//       // Handle products supplied array properly
//       // Use the same key multiple times for array values
//       formData.productsSupplied.forEach((productId) => {
//         formDataToSend.append("productsSupplied", productId)
//       })

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profilePicture", uploadedFile)
//       }

//       const response = await axios.post(`${API_URL}/api/abid-jewelry-ms/createSupplier`, formDataToSend, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       if (response.data.success) {
//         toast.success("Supplier added successfully!")
//         navigate("/dashboard/suppliers/view-all-suppliers")
//       } else {
//         toast.error(response.data.message || "Failed to add supplier")
//       }
//     } catch (error) {
//       console.error("Error adding supplier:", error)
//       if (axios.isAxiosError(error) && error.response) {
//         toast.error(error.response.data.message || "Failed to add supplier")
//         console.error("Server error details:", error.response.data)
//       } else {
//         toast.error("An error occurred while adding the supplier")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <Link to="/dashboard/suppliers/view-all-suppliers" className="cursor-pointer">
//           Suppliers
//         </Link>{" "}
//         / <span className="text-black">Add Suppliers</span>
//       </h2>

//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <form className="" onSubmit={handleSubmit}>
//           <div className="">
//             {/* Top Side */}
//             <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">Add New Supplier</p>
//             <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
//               {/* Left Side */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="companyName" className="mb-1">
//                     Company Name
//                   </label>
//                   <Input
//                     name="companyName"
//                     placeholder="Company Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.companyName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="representativeName" className="mb-1">
//                     Representative Name
//                   </label>
//                   <Input
//                     name="representativeName"
//                     placeholder="Individual Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.representativeName}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="phone" className="mb-1">
//                     Phone no
//                   </label>
//                   <Input
//                     name="phone"
//                     placeholder="+56 362738233"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="email" className="mb-1">
//                     Email
//                   </label>
//                   <Input
//                     name="email"
//                     placeholder="john@example.com"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="businessAddress" className="mb-1">
//                     Business Address
//                   </label>
//                   <Input
//                     name="businessAddress"
//                     placeholder="Street, City, State, Zip Code, Country"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.businessAddress}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="bankAccount" className="mb-1">
//                     Bank Account Details
//                   </label>
//                   <Input
//                     name="bankAccount"
//                     placeholder="Enter IBAN (e.g, GB29 NWBK 6016 1331 9268 19)"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.bankAccount}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="productsSupplied" className="mb-1">
//                     Product Supplied
//                   </label>

//                   <Dropdown
//                     options={productCategories.map((cat) => cat.name)}
//                     defaultValue="Select Product"
//                     onSelect={handleProductSelect}
//                   />

//                   {/* Display selected products */}
//                   {selectedProducts.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium mb-1">Selected Products:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedProducts.map((name, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             <span>{name}</span>
//                             <button
//                               type="button"
//                               className="ml-2 text-blue-600 hover:text-blue-800"
//                               onClick={() => removeProduct(index)}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Side */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="paymentTerms" className="mb-1">
//                     Payment Terms
//                   </label>
//                   <Dropdown
//                     options={paymentTerms.map((term) => term.name)}
//                     defaultValue="Select Payment Term"
//                     onSelect={handlePaymentTermSelect}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Status</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={() => handleRadioChange("status", "active")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Active</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={() => handleRadioChange("status", "inactive")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Inactive</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Priority</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="primary"
//                         checked={formData.supplierPriority === "primary"}
//                         onChange={() => handleRadioChange("supplierPriority", "primary")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Primary</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="secondary"
//                         checked={formData.supplierPriority === "secondary"}
//                         onChange={() => handleRadioChange("supplierPriority", "secondary")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Secondary</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Upload Image</label>
//                   <DropImage uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} className="w-full" />
//                 </div>

//                 <div className="flex justify-end gap-4 Poppins-font font-medium mt-8">
//                   <Button
//                     text="Cancel"
//                     type="button"
//                     onClick={() => navigate("/dashboard/suppliers/view-all-suppliers")}
//                     className="px-6 !bg-[#F4F4F5] !border-none "
//                   />
//                   <Button
//                     text={isSubmitting ? "Saving..." : "Save"}
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-6 !bg-[#056BB7] border-none text-white"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AddSuppliers

// import type React from "react"
// import { useState, useEffect } from "react"
// import Input from "../../../components/Input"
// import Button from "../../../components/Button"
// import Dropdown from "../../../components/Dropdown"
// import { DropImage } from "../../../components/UploadPicture"
// import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "react-toastify"

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token")
//   if (!token) {
//     token = sessionStorage.getItem("token")
//   }
//   return token
// }

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

// interface AddUserProps {
//   uploadedFile: File | null
//   setUploadedFile: (file: File | null) => void
// }

// const AddSuppliers: React.FC<AddUserProps> = ({ uploadedFile, setUploadedFile }) => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([])
//   const [paymentTerms, setPaymentTerms] = useState<{ _id: string; name: string }[]>([])
//   const [productCategories, setProductCategories] = useState<{ _id: string; name: string }[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

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
//   })

//   const navigate = useNavigate()

//   const userRole = getUserRole()
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"
//   // Check permissions on component mount
//   useEffect(() => {

//     if (!isAdmin && !hasPermission("Suppliers", "create")) {
//       toast.error("You don't have permission to add suppliers")
//       // navigate("/dashboard/suppliers/view-all-suppliers")
//       return
//     }

//     fetchPaymentTerms()
//     fetchProductCategories()
//   }, [navigate])

//   // Fetch payment terms
//   const fetchPaymentTerms = async () => {
//     try {
//       const API_URL = "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/allTemplates`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       })

//       if (response.data.success) {
//         console.log('response.data.data', response.data.data)
//         setPaymentTerms(response.data.data)
//       } else {
//         toast.error(response.data.message || "Failed to fetch payment terms")
//       }
//     } catch (error) {
//       console.error("Error fetching payment terms:", error)
//       toast.error("An error occurred while fetching payment terms")
//     }
//   }

//   // Fetch product categories
//   const fetchProductCategories = async () => {
//     try {
//       const API_URL = "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/getAllCategory`, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "application/json",
//         },
//       })

//       if (response.data.success) {
//         setProductCategories(response.data.data)
//       } else {
//         toast.error(response.data.message || "Failed to fetch product categories")
//       }
//     } catch (error) {
//       console.error("Error fetching product categories:", error)
//       toast.error("An error occurred while fetching product categories")
//     }
//   }

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   // Handle radio button change
//   const handleRadioChange = (name: string, value: string) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   // Handle payment term selection
//   const handlePaymentTermSelect = (value: string) => {
//     // Find the payment term ID by name
//     const term = paymentTerms.find((t) => t.name === value)
//     if (term) {
//       setFormData({
//         ...formData,
//         paymentTerms: term._id,
//       })
//     }
//   }

//   // Handle product selection
//   const handleProductSelect = (value: string) => {
//     // Find the product ID by name
//     const product = productCategories.find((p) => p.name === value)
//     if (product) {
//       // Check if product is already selected
//       if (!formData.productsSupplied.includes(product._id)) {
//         setFormData({
//           ...formData,
//           productsSupplied: [...formData.productsSupplied, product._id],
//         })
//         setSelectedProducts([...selectedProducts, product.name])
//       } else {
//         toast.info("This product is already selected")
//       }
//     }
//   }

//   // Remove a selected product
//   const removeProduct = (index: number) => {
//     const updatedProducts = [...formData.productsSupplied]
//     updatedProducts.splice(index, 1)

//     const updatedProductNames = [...selectedProducts]
//     updatedProductNames.splice(index, 1)

//     setFormData({
//       ...formData,
//       productsSupplied: updatedProducts,
//     })
//     setSelectedProducts(updatedProductNames)
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Check permission before submitting
//     const userRole = getUserRole()
//     const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

//     if (!isAdmin && !hasPermission("Suppliers", "create")) {
//       toast.error("You don't have permission to create suppliers")
//       return
//     }

//     // Validation checks
//     if (!formData.companyName) {
//       toast.error("Company name is required")
//       return
//     }

//     if (!formData.representativeName) {
//       toast.error("Representative name is required")
//       return
//     }

//     if (!formData.phone) {
//       toast.error("Phone number is required")
//       return
//     }

//     if (!formData.email) {
//       toast.error("Email is required")
//       return
//     }

//     if (!formData.businessAddress) {
//       toast.error("Business address is required")
//       return
//     }

//     if (!formData.paymentTerms) {
//       toast.error("Payment term is required")
//       return
//     }

//     if (formData.productsSupplied.length === 0) {
//       toast.error("At least one product must be selected")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"
//       const token = getAuthToken()

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.")
//         return
//       }

//       // Create FormData object to handle file upload
//       const formDataToSend = new FormData()

//       // Add all form fields to FormData
//       formDataToSend.append("companyName", formData.companyName)
//       formDataToSend.append("representativeName", formData.representativeName)
//       formDataToSend.append("phone", formData.phone)
//       formDataToSend.append("email", formData.email)
//       formDataToSend.append("businessAddress", formData.businessAddress)
//       formDataToSend.append("bankAccount", formData.bankAccount || "")
//       formDataToSend.append("status", formData.status)
//       formDataToSend.append("supplierPriority", formData.supplierPriority)

//       // Only append payment terms if it exists
//       if (formData.paymentTerms) {
//         formDataToSend.append("paymentTerms", formData.paymentTerms)
//       }

//       // Handle products supplied array properly
//       // Use the same key multiple times for array values
//       formData.productsSupplied.forEach((productId) => {
//         formDataToSend.append("productsSupplied", productId)
//       })

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profilePicture", uploadedFile)
//       }

//       const response = await axios.post(`${API_URL}/api/abid-jewelry-ms/createSupplier`, formDataToSend, {
//         headers: {
//           "x-access-token": token,
//           "Content-Type": "multipart/form-data",
//         },
//       })

//       if (response.data.success) {
//         toast.success("Supplier added successfully!")
//         navigate("/dashboard/suppliers/view-all-suppliers")
//       } else {
//         toast.error(response.data.message || "Failed to add supplier")
//       }
//     } catch (error) {
//       console.error("Error adding supplier:", error)
//       if (axios.isAxiosError(error) && error.response) {
//         toast.error(error.response.data.message || "Failed to add supplier")
//         console.error("Server error details:", error.response.data)
//       } else {
//         toast.error("An error occurred while adding the supplier")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <Link to="/dashboard/suppliers/view-all-suppliers" className="cursor-pointer">
//           Suppliers
//         </Link>{" "}
//         / <span className="text-black">Add Suppliers</span>
//       </h2>

//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         <form className="" onSubmit={handleSubmit}>
//           <div className="">
//             {/* Top Side */}
//             <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">Add New Supplier</p>
//             <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
//               {/* Left Side */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="companyName" className="mb-1">
//                     Company Name
//                   </label>
//                   <Input
//                     name="companyName"
//                     placeholder="Company Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.companyName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="representativeName" className="mb-1">
//                     Representative Name
//                   </label>
//                   <Input
//                     name="representativeName"
//                     placeholder="Individual Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.representativeName}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="phone" className="mb-1">
//                     Phone no
//                   </label>
//                   <Input
//                     name="phone"
//                     placeholder="+56 362738233"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="email" className="mb-1">
//                     Email
//                   </label>
//                   <Input
//                     name="email"
//                     placeholder="john@example.com"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="businessAddress" className="mb-1">
//                     Business Address
//                   </label>
//                   <Input
//                     name="businessAddress"
//                     placeholder="Street, City, State, Zip Code, Country"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.businessAddress}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="bankAccount" className="mb-1">
//                     Bank Account Details
//                   </label>
//                   <Input
//                     name="bankAccount"
//                     placeholder="Enter IBAN (e.g, GB29 NWBK 6016 1331 9268 19)"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.bankAccount}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="productsSupplied" className="mb-1">
//                     Product Supplied
//                   </label>

//                   <Dropdown
//                     options={productCategories.map((cat) => cat.name)}
//                     defaultValue="Select Product"
//                     onSelect={handleProductSelect}
//                   />

//                   {/* Display selected products */}
//                   {selectedProducts.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium mb-1">Selected Products:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedProducts.map((name, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             <span>{name}</span>
//                             <button
//                               type="button"
//                               className="ml-2 text-blue-600 hover:text-blue-800"
//                               onClick={() => removeProduct(index)}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Side */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="paymentTerms" className="mb-1">
//                     Payment Terms
//                   </label>
//                   <Dropdown
//                     options={paymentTerms.map((term) => term.name)}
//                     defaultValue="Select Payment Term"
//                     onSelect={handlePaymentTermSelect}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Status</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={() => handleRadioChange("status", "active")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Active</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={() => handleRadioChange("status", "inactive")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Inactive</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Priority</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="primary"
//                         checked={formData.supplierPriority === "primary"}
//                         onChange={() => handleRadioChange("supplierPriority", "primary")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Primary</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="secondary"
//                         checked={formData.supplierPriority === "secondary"}
//                         onChange={() => handleRadioChange("supplierPriority", "secondary")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Secondary</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Upload Image</label>
//                   <DropImage uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} className="w-full" />
//                 </div>

//                 <div className="flex justify-end gap-4 Poppins-font font-medium mt-8">
//                   <Button
//                     text="Cancel"
//                     type="button"
//                     onClick={() => navigate("/dashboard/suppliers/view-all-suppliers")}
//                     className="px-6 !bg-[#F4F4F5] !border-none "
//                   />
//                   {(isAdmin || hasPermission("Suppliers", "create")) && (
//                     <Button
//                       text={isSubmitting ? "Saving..." : "Save"}
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-6 !bg-[#056BB7] border-none text-white"
//                     />
//                   )}

//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AddSuppliers

// import type React from "react";
// import { useState, useEffect } from "react";
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Dropdown from "../../../components/Dropdown";
// import { DropImage } from "../../../components/UploadPicture";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

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

// interface AddUserProps {
//   uploadedFile: File | null;
//   setUploadedFile: (file: File | null) => void;
// }

// const AddSuppliers: React.FC<AddUserProps> = ({
//   uploadedFile,
//   setUploadedFile,
// }) => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [paymentTerms, setPaymentTerms] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [productCategories, setProductCategories] = useState<
//     { _id: string; name: string }[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [hasInitialized, setHasInitialized] = useState(false);

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
//   });

//   const navigate = useNavigate();

//   // Check permissions and fetch data only once
//   useEffect(() => {
//     if (hasInitialized) return;

//     const userRole = getUserRole();
//     const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

//     if (!isAdmin && !hasPermission("Suppliers", "create")) {
//       toast.error("You don't have permission to add suppliers");
//       return;
//     }

//     // Set flag to prevent re-initialization
//     setHasInitialized(true);

//     // Fetch data
//     fetchPaymentTerms();
//     fetchProductCategories();
//   }, [hasInitialized]); // Only depend on hasInitialized

//   // Fetch payment terms with error handling and loading state
//   const fetchPaymentTerms = async () => {
//     if (paymentTerms.length > 0) return; // Don't fetch if already loaded

//     try {
//       setIsLoading(true);
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
//           timeout: 10000, // 10 second timeout
//         }
//       );

//       if (response.data.success) {
//         console.log("Payment terms fetched:", response.data.data);
//         setPaymentTerms(response.data.data);
//       } else {
//         toast.error(response.data.message || "Failed to fetch payment terms");
//       }
//     } catch (error) {
//       console.error("Error fetching payment terms:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.code === "ECONNABORTED") {
//           toast.error("Request timeout. Please check your connection.");
//         } else if (error.response) {
//           toast.error(`Server error: ${error.response.status}`);
//         } else {
//           toast.error("Network error. Please check your connection.");
//         }
//       } else {
//         toast.error("An error occurred while fetching payment terms");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch product categories with error handling and loading state
//   const fetchProductCategories = async () => {
//     if (productCategories.length > 0) return; // Don't fetch if already loaded

//     try {
//       setIsLoading(true);
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
//           timeout: 10000, // 10 second timeout
//         }
//       );

//       if (response.data.success) {
//         console.log("Product categories fetched:", response.data.data);
//         setProductCategories(response.data.data);
//       } else {
//         toast.error(
//           response.data.message || "Failed to fetch product categories"
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching product categories:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.code === "ECONNABORTED") {
//           toast.error("Request timeout. Please check your connection.");
//         } else if (error.response) {
//           toast.error(`Server error: ${error.response.status}`);
//         } else {
//           toast.error("Network error. Please check your connection.");
//         }
//       } else {
//         toast.error("An error occurred while fetching product categories");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle radio button change
//   const handleRadioChange = (name: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle payment term selection
//   const handlePaymentTermSelect = (value: string) => {
//     const term = paymentTerms.find((t) => t.name === value);
//     if (term) {
//       setFormData((prev) => ({
//         ...prev,
//         paymentTerms: term._id,
//       }));
//     }
//   };

//   // Handle product selection
//   const handleProductSelect = (value: string) => {
//     //  if (!formData.stores.includes(storeId)) {
//     //       setFormData((prev) => ({
//     //         ...prev,
//     //         stores: [...prev.stores, storeId],
//     //       }));
//     //       setSelectedStoreNames((prev) => [...prev, storeName]);
//     //     } else {
//     //       toast.info("This store is already selected");
//     //     }

//     const product = productCategories.find((p) => p.name === value);
//     if (product) {
//       if (!formData.productsSupplied.includes(product._id)) {
//         setFormData((prev) => ({
//           ...prev,
//           productsSupplied: [...prev.productsSupplied, product._id],
//         }));
//         setSelectedProducts((prev) => [...prev, product.name]);
//       } else {
//         toast.info("This product is already selected");
//       }
//     }
//   };

//   // Remove a selected product
//   const removeProduct = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       productsSupplied: prev.productsSupplied.filter((_, i) => i !== index),
//     }));
//     setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check permission before submitting
//     const userRole = getUserRole();
//     const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

//     if (!isAdmin && !hasPermission("Suppliers", "create")) {
//       toast.error("You don't have permission to create suppliers");
//       return;
//     }

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

//     if (!formData.paymentTerms) {
//       toast.error("Payment term is required");
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

//       // Only append payment terms if it exists
//       if (formData.paymentTerms) {
//         formDataToSend.append("paymentTerms", formData.paymentTerms);
//       }

//       // Handle products supplied array properly
//       formData.productsSupplied.forEach((productId) => {
//         formDataToSend.append("productsSupplied", productId);
//       });

//       // Add profile image if it exists
//       if (uploadedFile) {
//         formDataToSend.append("profilePicture", uploadedFile);
//       }

//       const response = await axios.post(
//         `${API_URL}/api/abid-jewelry-ms/createSupplier`,
//         formDataToSend,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 30000, // 30 second timeout for file upload
//         }
//       );

//       if (response.data.success) {
//         toast.success("Supplier added successfully!");
//         navigate("/dashboard/suppliers/view-all-suppliers");
//       } else {
//         toast.error(response.data.message || "Failed to add supplier");
//       }
//     } catch (error) {
//       console.error("Error adding supplier:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.code === "ECONNABORTED") {
//           toast.error("Request timeout. Please try again.");
//         } else if (error.response) {
//           toast.error(error.response.data.message || "Failed to add supplier");
//         } else {
//           toast.error("Network error. Please check your connection.");
//         }
//       } else {
//         toast.error("An error occurred while adding the supplier");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const userRole = getUserRole();
//   const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

//   return (
//     <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
//       <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
//         <Link
//           to="/dashboard/suppliers/view-all-suppliers"
//           className="cursor-pointer"
//         >
//           Suppliers
//         </Link>{" "}
//         / <span className="text-black">Add Suppliers</span>
//       </h2>

//       <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
//         {isLoading && (
//           <div className="flex justify-center items-center py-4">
//             <div className="text-blue-600">Loading...</div>
//           </div>
//         )}

//         <form className="" onSubmit={handleSubmit}>
//           <div className="">
//             {/* Top Side */}
//             <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
//               Add New Supplier
//             </p>
//             <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
//               {/* Left Side */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="companyName" className="mb-1">
//                     Company Name <span className="text-red-500"> *</span>
//                   </label>
//                   <Input
//                     name="companyName"
//                     placeholder="Company Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.companyName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="representativeName" className="mb-1">
//                     Representative Name <span className="text-red-500"> *</span>
//                   </label>
//                   <Input
//                     name="representativeName"
//                     placeholder="Individual Name"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.representativeName}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="phone" className="mb-1">
//                     Phone no<span className="text-red-500"> *</span>
//                   </label>
//                   <Input
//                     name="phone"
//                     placeholder="+56 362738233"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="email" className="mb-1">
//                     Email<span className="text-red-500"> *</span>
//                   </label>
//                   <Input
//                     name="email"
//                     placeholder="john@example.com"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="businessAddress" className="mb-1">
//                     Business Address<span className="text-red-500"> *</span>
//                   </label>
//                   <Input
//                     name="businessAddress"
//                     placeholder="Street, City, State, Zip Code, Country"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.businessAddress}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="bankAccount" className="mb-1">
//                     Bank Account Details
//                   </label>
//                   <Input
//                     name="bankAccount"
//                     placeholder="Enter IBAN (e.g, GB29 NWBK 6016 1331 9268 19)"
//                     className="outline-none focus:outline-none w-full"
//                     value={formData.bankAccount}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="productsSupplied" className="mb-1">
//                     Product Supplied <span className="text-red-500"> *</span>
//                   </label>

//                   <Dropdown
//                     //                   key={selectedCategory}
//                     // defaultValue={selectedCategory || "Select Category"}
//                     options={productCategories.map((cat) => cat.name)}
//                     defaultValue="Select Product"
//                     onSelect={handleProductSelect}
//                     searchable={true}
//                     noResultsMessage="No Product found"
//                   />

//                   {/* Display selected products */}
//                   {selectedProducts.length > 0 && (
//                     <div className="mt-2">
//                       <p className="text-sm font-medium mb-1">
//                         Selected Products:
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedProducts.map((name, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                           >
//                             <span>{name}</span>
//                             <button
//                               type="button"
//                               className="ml-2 text-blue-600 hover:text-blue-800"
//                               onClick={() => removeProduct(index)}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Side */}
//               <div className="space-y-4 relative">
//                 <div className="flex flex-col">
//                   <label htmlFor="paymentTerms" className="mb-1">
//                     Payment Terms <span className="text-red-500"> *</span>
//                   </label>
//                   <Dropdown
//                     options={paymentTerms.map((term) => term.name)}
//                     defaultValue="Select Payment Term"
//                     onSelect={handlePaymentTermSelect}
//                     searchable={true}
//                     noResultsMessage="No Payment Term found"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Status</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={() => handleRadioChange("status", "active")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Active</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={() => handleRadioChange("status", "inactive")}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Inactive</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="mb-1">Priority</label>
//                   <div className="flex gap-4 mt-1">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="primary"
//                         checked={formData.supplierPriority === "primary"}
//                         onChange={() =>
//                           handleRadioChange("supplierPriority", "primary")
//                         }
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Primary</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="supplierPriority"
//                         value="secondary"
//                         checked={formData.supplierPriority === "secondary"}
//                         onChange={() =>
//                           handleRadioChange("supplierPriority", "secondary")
//                         }
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span>Secondary</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex flex-col !mb-8 sm:mb-0">
//                   <label className="mb-1">
//                     Upload Image <span className="text-[11px]">(optional)</span>
//                   </label>
//                   <DropImage
//                     uploadedFile={uploadedFile}
//                     setUploadedFile={setUploadedFile}
//                     className="w-full"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-4 Poppins-font font-medium !mt-8 absolute bottom-0 w-full">
//                   <Button
//                     text="Cancel"
//                     type="button"
//                     onClick={() =>
//                       navigate("/dashboard/suppliers/view-all-suppliers")
//                     }
//                     className="px-6 !bg-[#F4F4F5] !border-none "
//                   />
//                   {(isAdmin || hasPermission("Suppliers", "create")) && (
//                     <Button
//                       text={isSubmitting ? "Saving..." : "Save"}
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-6 !bg-[#056BB7] border-none text-white"
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddSuppliers;

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import AddProductSuppliedDropDown, {
  type DropdownRef,
} from "../../../components/AddProductSuppliedDropDown";
import { DropImage } from "../../../components/UploadPicture";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

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

interface AddUserProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const AddSuppliers: React.FC<AddUserProps> = ({
  uploadedFile,
  setUploadedFile,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<
    { _id: string; name: string }[]
  >([]);
  const [productCategories, setProductCategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Add refs for dropdown components
  const productDropdownRef = useRef<DropdownRef>(null);
  const paymentTermDropdownRef = useRef<DropdownRef>(null);

  // Add reset trigger states
  const [productResetTrigger, setProductResetTrigger] = useState(0);
  const [paymentTermResetTrigger, setPaymentTermResetTrigger] = useState(0);

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
  });

  const navigate = useNavigate();

  // Check permissions and fetch data only once
  useEffect(() => {
    if (hasInitialized) return;

    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "create")) {
      toast.error("You don't have permission to add suppliers");
      return;
    }

    // Set flag to prevent re-initialization
    setHasInitialized(true);

    // Fetch data
    fetchPaymentTerms();
    fetchProductCategories();
  }, [hasInitialized]); // Only depend on hasInitialized

  // Fetch payment terms with error handling and loading state
  const fetchPaymentTerms = async () => {
    if (paymentTerms.length > 0) return; // Don't fetch if already loaded

    try {
      setIsLoading(true);
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
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        // console.log("Payment terms fetched:", response.data.data);
        setPaymentTerms(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch payment terms");
      }
    } catch (error) {
      console.error("Error fetching payment terms:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (error.response) {
          toast.error(`Server error: ${error.response.status}`);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("An error occurred while fetching payment terms");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product categories with error handling and loading state
  const fetchProductCategories = async () => {
    if (productCategories.length > 0) return; // Don't fetch if already loaded

    try {
      setIsLoading(true);
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
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        // console.log("Product categories fetched:", response.data.data);
        setProductCategories(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch product categories"
        );
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (error.response) {
          toast.error(`Server error: ${error.response.status}`);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("An error occurred while fetching product categories");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Handle input change with validation
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   // Validate names (company name and representative name)
  //   if ((name === "companyName" || name === "representativeName") && value) {
  //     if (!validateName(value)) {
  //       toast.error(
  //         `${
  //           name === "companyName" ? "Company name" : "Representative name"
  //         } should only contain letters and spaces`
  //       );
  //       return;
  //     }
  //   }

  //   // Validate email
  //   if (name === "email" && value) {
  //     if (!validateEmail(value)) {
  //       toast.error("Please enter a valid email address");
  //       return;
  //     }
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle radio button change
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment term selection
  const handlePaymentTermSelect = (value: string) => {
    const term = paymentTerms.find((t) => t.name === value);
    if (term) {
      setFormData((prev) => ({
        ...prev,
        paymentTerms: term._id,
      }));
    }
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    const product = productCategories.find((p) => p.name === value);
    if (product) {
      if (!formData.productsSupplied.includes(product._id)) {
        setFormData((prev) => ({
          ...prev,
          productsSupplied: [...prev.productsSupplied, product._id],
        }));
        setSelectedProducts((prev) => [...prev, product.name]);
      } else {
        toast.info("This product is already selected");
      }
    }
  };

  // FIXED: Remove a selected product and reset dropdown
  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productsSupplied: prev.productsSupplied.filter((_, i) => i !== index),
    }));
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));

    // Reset the dropdown to default value
    setProductResetTrigger((prev) => prev + 1);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check permission before submitting
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "create")) {
      toast.error("You don't have permission to create suppliers");
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

    if (!formData.paymentTerms) {
      toast.error("Payment term is required");
      return;
    }

    if (formData.productsSupplied.length === 0) {
      toast.error("At least one product must be selected");
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

      // Only append payment terms if it exists
      if (formData.paymentTerms) {
        formDataToSend.append("paymentTerms", formData.paymentTerms);
      }

      // Handle products supplied array properly
      formData.productsSupplied.forEach((productId) => {
        formDataToSend.append("productsSupplied", productId);
      });

      // Add profile image if it exists
      if (uploadedFile) {
        formDataToSend.append("profilePicture", uploadedFile);
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createSupplier`,
        formDataToSend,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout for file upload
        }
      );

      if (response.data.success) {
        toast.success("Supplier added successfully!");

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
        });
        setSelectedProducts([]);

        // Reset dropdowns after successful form submission
        setProductResetTrigger((prev) => prev + 1);
        setPaymentTermResetTrigger((prev) => prev + 1);

        navigate("/dashboard/suppliers/view-all-suppliers");
      } else {
        toast.error(response.data.message || "Failed to add supplier");
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please try again.");
        } else if (error.response) {
          toast.error(error.response.data.message || "Failed to add supplier");
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("An error occurred while adding the supplier");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <Link
          to="/dashboard/suppliers/view-all-suppliers"
          className="cursor-pointer"
        >
          Suppliers
        </Link>{" "}
        / <span className="text-black">Add Suppliers</span>
      </h2>

      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        {/* {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="text-blue-600">Loading...</div>
          </div>
        )} */}

        <form className="" onSubmit={handleSubmit}>
          <div className="">
            {/* Top Side */}
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
              Add New Supplier
            </p>
            <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
              {/* Left Side */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="companyName" className="mb-1">
                    Company Name <span className="text-red-500"> *</span>
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
                    Representative Name <span className="text-red-500"> *</span>
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
                    Phone no<span className="text-red-500"> *</span>
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
                    Email<span className="text-red-500"> *</span>
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
                    Business Address<span className="text-red-500"> *</span>
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
                    Product Supplied <span className="text-red-500"> *</span>
                  </label>

                  <AddProductSuppliedDropDown
                    ref={productDropdownRef}
                    options={productCategories.map((cat) => cat.name)}
                    defaultValue="Select Product"
                    onSelect={handleProductSelect}
                    searchable={true}
                    noResultsMessage="No Product found"
                    resetTrigger={productResetTrigger}
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

              {/* Right Side */}
              <div className="space-y-4 relative">
                <div className="flex flex-col">
                  <label htmlFor="paymentTerms" className="mb-1">
                    Payment Terms <span className="text-red-500"> *</span>
                  </label>
                  <Dropdown
                    options={paymentTerms.map((term) => term.name)}
                    defaultValue="Select Payment Term"
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
                        onChange={() => handleRadioChange("status", "active")}
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
                        onChange={() => handleRadioChange("status", "inactive")}
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

                <div className="flex flex-col !mb-8 sm:mb-0">
                  <label className="mb-1">
                    Upload Image <span className="text-[11px]">(optional)</span>
                  </label>
                  <DropImage
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-4 Poppins-font font-medium !mt-8 absolute bottom-0 w-full">
                  <Button
                    text="Cancel"
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/suppliers/view-all-suppliers")
                    }
                    className="px-6 !bg-[#F4F4F5] !border-none "
                  />
                  {(isAdmin || hasPermission("Suppliers", "create")) && (
                    <Button
                      text={isSubmitting ? "Saving..." : "Save"}
                      className={`px-6 !bg-[#056BB7] border-none text-white ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      type="submit"
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuppliers;
