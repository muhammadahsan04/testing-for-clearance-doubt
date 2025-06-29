// import React, { useState, useEffect, useRef } from "react";
// import { FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// type ManagerDropDownProps = {
//   className?: string;
//   icon?: React.ReactNode;
//   iconFirst?: boolean;
//   onSelect?: (userId: string, userName: string) => void;
//   defaultValue?: string;
//   DropDownName?: string;
//   searchable?: boolean; // Add this prop
//   noResultsMessage?: string; // Add this prop
// };

// // // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   userId: string;
// }

// const ZoneRepresentativeDropDown: React.FC<ManagerDropDownProps> = ({
//   className = "",
//   onSelect,
//   icon,
//   iconFirst = false,
//   defaultValue = "Select Manager",
//   DropDownName,
//   searchable = false, // Add this prop
//   noResultsMessage = "No users found", // Add this prop
// }) => {
//   const [selected, setSelected] = useState(defaultValue);
//   const [open, setOpen] = useState(false);
//   const [isAbove, setIsAbove] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(""); // Add search state
//   const [isSearching, setIsSearching] = useState(false); // Add searching state
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null); // Add input ref
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       try {
//         const API_URL =
//           import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//         const token = getAuthToken();
//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/getAllUsers`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.data.success && Array.isArray(response.data.data)) {
//           setUsers(response.data.data);
//           console.log("Users fetched:", response.data.data); // Add this for debugging
//         } else {
//           toast.warning("No users found or invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to fetch users");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Also add the missing useEffect hooks for click outside and dropdown position
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open]);

//   useEffect(() => {
//     const checkDropdownPosition = () => {
//       if (dropdownRef.current) {
//         const dropdownRect = dropdownRef.current.getBoundingClientRect();
//         const spaceBelow = window.innerHeight - dropdownRect.bottom;
//         setIsAbove(spaceBelow < 200);
//       }
//     };

//     if (open) {
//       checkDropdownPosition();
//     }

//     window.addEventListener("resize", checkDropdownPosition);
//     return () => window.removeEventListener("resize", checkDropdownPosition);
//   }, [open]);

//   // Filter users based on search term
//   // const filteredUsers = searchable
//   //   ? users.filter(
//   //       (user) =>
//   //         `${user.firstName} ${user.lastName}`
//   //           .toLowerCase()
//   //           .includes(searchTerm.toLowerCase()) ||
//   //         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   //     )
//   //   : users;

//   // Filter users based on search term AND role
//   const filteredUsers = users.filter((user) => {
//     // First filter: only show managers
//     const isManager = user?.role?.name?.toLowerCase() === "zone representative";

//     if (!isManager) return false;

//     // Second filter: apply search if searchable is enabled
//     if (searchable && searchTerm) {
//       const matchesSearch =
//         `${user.firstName} ${user.lastName}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase());

//       return matchesSearch;
//     }

//     return true; // Show all managers if no search term
//   });

//   // Rest of your existing code remains the same until the handleSelect function...

//   // const handleSelect = async (user: User, e: React.MouseEvent) => {
//   //   e.stopPropagation();
//   //   try {
//   //     const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//   //     const token = getAuthToken();
//   //     if (!token) {
//   //       toast.error("Authentication token not found. Please login again.");
//   //       return;
//   //     }

//   //     const response = await axios.get(
//   //       `${API_URL}/api/abid-jewelry-ms/getOneUser/${user._id}`,
//   //       {
//   //         headers: {
//   //           "x-access-token": token,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     if (response.data.success) {
//   //       const userData = response.data.data;
//   //       const fullName = `${userData.firstName} ${userData.lastName}`;
//   //       setSelected(fullName);
//   //       setOpen(false);
//   //       setSearchTerm(""); // Reset search term
//   //       setIsSearching(false); // Reset searching state
//   //       onSelect?.(userData._id, fullName);
//   //     } else {
//   //       toast.error("Failed to get user details");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching user details:", error);
//   //     toast.error("Failed to get user details");
//   //   }
//   // };

//   // ✅ FIXED CODE
//   const handleSelect = (user: User, e: React.MouseEvent) => {
//     e.stopPropagation();

//     // Use the data we already have from the initial fetch
//     const fullName = `${user.firstName} ${user.lastName}`;
//     setSelected(fullName);
//     setOpen(false);
//     setSearchTerm("");
//     setIsSearching(false);

//     // Call the onSelect callback with the user ID and name
//     onSelect?.(user._id, fullName);
//   };

//   // Add button click handler
//   const handleButtonClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!open) {
//       setOpen(true);
//       if (searchable) {
//         setTimeout(() => {
//           inputRef.current?.focus();
//           setIsSearching(true);
//         }, 100);
//       }
//     } else {
//       setOpen(false);
//       setIsSearching(false);
//     }
//   };

//   // Add search input handlers
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleInputFocus = () => {
//     setIsSearching(true);
//   };

//   const handleInputBlur = () => {
//     setTimeout(() => {
//       setIsSearching(false);
//     }, 150);
//   };

//   // Clear search term when dropdown closes
//   useEffect(() => {
//     if (!open) {
//       setSearchTerm("");
//       setIsSearching(false);
//     }
//   }, [open]);

//   // Rest of your existing useEffect hooks remain the same...

//   return (
//     <div
//       className="relative text-left text-[#5D6679]"
//       ref={dropdownRef}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div
//         className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full cursor-pointer ${className}`}
//         onClick={handleButtonClick}
//       >
//         <div className="flex items-center text-start gap-2 flex-1">
//           {iconFirst && icon}
//           {/* Show input when searching, otherwise show labels */}
//           {searchable && open && isSearching ? (
//             <input
//               ref={inputRef}
//               type="text"
//               onClick={(e) => {
//                 e.stopPropagation();
//               }}
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onFocus={handleInputFocus}
//               onBlur={handleInputBlur}
//               // placeholder={DropDownName || "Search users..."}
//               className="outline-none bg-transparent flex-1 font-medium text-gray-600"
//               autoFocus
//             />
//           ) : (
//             <>
//               {DropDownName && (
//                 <span className="font-medium">{DropDownName}</span>
//               )}
//               {!DropDownName && (
//                 <span>{isLoading ? "Loading..." : selected}</span>
//               )}
//               {DropDownName && (
//                 <span>{isLoading ? "Loading..." : selected}</span>
//               )}
//             </>
//           )}
//         </div>
//         {!icon && (
//           <FaChevronDown
//             className={`text-xs ml-2 transition-transform ${
//               open ? "rotate-180" : ""
//             }`}
//           />
//         )}
//         {!iconFirst && icon}
//       </div>

//       {open && (
//         <ul
//           className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
//             isAbove ? "bottom-full mb-2" : "top-full mt-2"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {filteredUsers.length === 0 ? (
//             <li className="px-4 py-2 text-sm text-gray-500">
//               {noResultsMessage}
//             </li>
//           ) : (
//             filteredUsers.map((user) => (
//               <li
//                 key={user._id}
//                 onClick={(e) => handleSelect(user, e)}
//                 className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//               >
//                 {`${user.firstName} ${user.lastName}`}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ZoneRepresentativeDropDown;

// "use client";

// import type React from "react";
// import { useState, useEffect, useRef } from "react";
// import { FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// type ZoneRepresentativeDropDownProps = {
//   className?: string;
//   icon?: React.ReactNode;
//   iconFirst?: boolean;
//   onSelect?: (userId: string, userName: string) => void;
//   defaultValue?: string;
//   DropDownName?: string;
//   searchable?: boolean;
//   noResultsMessage?: string;
// };

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   userId: string;
//   role?: {
//     name: string;
//   };
// }

// const ZoneRepresentativeDropDown: React.FC<ZoneRepresentativeDropDownProps> = ({
//   className = "",
//   onSelect,
//   icon,
//   iconFirst = false,
//   defaultValue = "Select Zone Representative",
//   DropDownName,
//   searchable = false,
//   noResultsMessage = "No users found",
// }) => {
//   const [selected, setSelected] = useState(defaultValue);
//   const [open, setOpen] = useState(false);
//   const [isAbove, setIsAbove] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       try {
//         const API_URL =
//           import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//         const token = getAuthToken();
//         if (!token) {
//           toast.error("Authentication token not found. Please login again.");
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/api/abid-jewelry-ms/getAllUsers`,
//           {
//             headers: {
//               "x-access-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.data.success && Array.isArray(response.data.data)) {
//           setUsers(response.data.data);
//           console.log("Users fetched:", response.data.data);
//         } else {
//           toast.warning("No users found or invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to fetch users");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open]);

//   useEffect(() => {
//     const checkDropdownPosition = () => {
//       if (dropdownRef.current) {
//         const dropdownRect = dropdownRef.current.getBoundingClientRect();
//         const spaceBelow = window.innerHeight - dropdownRect.bottom;
//         setIsAbove(spaceBelow < 200);
//       }
//     };

//     if (open) {
//       checkDropdownPosition();
//     }

//     window.addEventListener("resize", checkDropdownPosition);
//     return () => window.removeEventListener("resize", checkDropdownPosition);
//   }, [open]);

//   // Filter users based on search term AND role
//   const filteredUsers = users.filter((user) => {
//     // First filter: only show zone representatives
//     const isZoneRepresentative =
//       user?.role?.name?.toLowerCase() === "zone representative";

//     if (!isZoneRepresentative) return false;

//     // Second filter: apply search if searchable is enabled
//     if (searchable && searchTerm) {
//       const matchesSearch =
//         `${user.firstName} ${user.lastName}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase());

//       return matchesSearch;
//     }

//     return true; // Show all zone representatives if no search term
//   });

//   // FIXED: Simplified handleSelect function - no API call needed
//   const handleSelect = (user: User, e: React.MouseEvent) => {
//     e.stopPropagation();

//     // Use the data we already have from the initial fetch
//     const fullName = `${user.firstName} ${user.lastName}`;
//     setSelected(fullName);
//     setOpen(false);
//     setSearchTerm("");
//     setIsSearching(false);

//     // Call the onSelect callback with the user ID and name
//     onSelect?.(user._id, fullName);
//   };

//   const handleButtonClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!open) {
//       setOpen(true);
//       if (searchable) {
//         setTimeout(() => {
//           inputRef.current?.focus();
//           setIsSearching(true);
//         }, 100);
//       }
//     } else {
//       setOpen(false);
//       setIsSearching(false);
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleInputFocus = () => {
//     setIsSearching(true);
//   };

//   const handleInputBlur = () => {
//     setTimeout(() => {
//       setIsSearching(false);
//     }, 150);
//   };

//   useEffect(() => {
//     if (!open) {
//       setSearchTerm("");
//       setIsSearching(false);
//     }
//   }, [open]);

//   return (
//     <div
//       className="relative text-left text-[#5D6679]"
//       ref={dropdownRef}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div
//         className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full cursor-pointer ${className}`}
//         onClick={handleButtonClick}
//       >
//         <div className="flex items-center text-start gap-2 flex-1">
//           {iconFirst && icon}
//           {searchable && open && isSearching ? (
//             <input
//               ref={inputRef}
//               type="text"
//               onClick={(e) => {
//                 e.stopPropagation();
//               }}
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onFocus={handleInputFocus}
//               onBlur={handleInputBlur}
//               className="outline-none bg-transparent flex-1 font-medium text-gray-600"
//               autoFocus
//             />
//           ) : (
//             <>
//               {DropDownName && (
//                 <span className="font-medium">{DropDownName}</span>
//               )}
//               {!DropDownName && (
//                 <span>{isLoading ? "Loading..." : selected}</span>
//               )}
//               {DropDownName && (
//                 <span>{isLoading ? "Loading..." : selected}</span>
//               )}
//             </>
//           )}
//         </div>
//         {!icon && (
//           <FaChevronDown
//             className={`text-xs ml-2 transition-transform ${
//               open ? "rotate-180" : ""
//             }`}
//           />
//         )}
//         {!iconFirst && icon}
//       </div>

//       {open && (
//         <ul
//           className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
//             isAbove ? "bottom-full mb-2" : "top-full mt-2"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {filteredUsers.length === 0 ? (
//             <li className="px-4 py-2 text-sm text-gray-500">
//               {noResultsMessage}
//             </li>
//           ) : (
//             filteredUsers.map((user) => (
//               <li
//                 key={user._id}
//                 onClick={(e) => handleSelect(user, e)}
//                 className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//               >
//                 {`${user.firstName} ${user.lastName}`}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ZoneRepresentativeDropDown;


"use client"

import type React from "react"
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { FaChevronDown } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"

type ZoneRepresentativeDropDownProps = {
  className?: string
  icon?: React.ReactNode
  iconFirst?: boolean
  onSelect?: (userId: string, userName: string) => void
  defaultValue?: string
  DropDownName?: string
  searchable?: boolean
  noResultsMessage?: string
  resetTrigger?: number // Add this prop to trigger reset
}

// Add ref type for reset function
export interface ZoneRepresentativeDropDownRef {
  resetSelection: () => void
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token")
  if (!token) {
    token = sessionStorage.getItem("token")
  }
  return token
}

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  userId: string
  role?: {
    name: string
  }
}

const ZoneRepresentativeDropDown = forwardRef<ZoneRepresentativeDropDownRef, ZoneRepresentativeDropDownProps>(
  (
    {
      className = "",
      onSelect,
      icon,
      iconFirst = false,
      defaultValue = "Select Zone Representative",
      DropDownName,
      searchable = false,
      noResultsMessage = "No users found",
      resetTrigger = 0, // Add this prop
    },
    ref,
  ) => {
    const [selected, setSelected] = useState(defaultValue)
    const [open, setOpen] = useState(false)
    const [isAbove, setIsAbove] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Expose reset function to parent component
    useImperativeHandle(ref, () => ({
      resetSelection: () => {
        setSelected(defaultValue)
        setSearchTerm("")
        setIsSearching(false)
        setOpen(false)
      },
    }))

    // Reset when resetTrigger changes
    useEffect(() => {
      if (resetTrigger > 0) {
        setSelected(defaultValue)
        setSearchTerm("")
        setIsSearching(false)
        setOpen(false)
      }
    }, [resetTrigger, defaultValue])

    useEffect(() => {
      const fetchUsers = async () => {
        setIsLoading(true)
        try {
          const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000"
          const token = getAuthToken()
          if (!token) {
            toast.error("Authentication token not found. Please login again.")
            return
          }
          const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/getAllUsers`, {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          })
          if (response.data.success && Array.isArray(response.data.data)) {
            setUsers(response.data.data)
            // console.log("Users fetched:", response.data.data)
          } else {
            toast.warning("No users found or invalid response format")
          }
        } catch (error) {
          console.error("Error fetching users:", error)
          toast.error("Failed to fetch users")
        } finally {
          setIsLoading(false)
        }
      }

      fetchUsers()
    }, [])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
      } else {
        document.removeEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open])

    useEffect(() => {
      const checkDropdownPosition = () => {
        if (dropdownRef.current) {
          const dropdownRect = dropdownRef.current.getBoundingClientRect()
          const spaceBelow = window.innerHeight - dropdownRect.bottom
          setIsAbove(spaceBelow < 200)
        }
      }

      if (open) {
        checkDropdownPosition()
      }

      window.addEventListener("resize", checkDropdownPosition)
      return () => window.removeEventListener("resize", checkDropdownPosition)
    }, [open])

    // Filter users based on search term AND role
    const filteredUsers = users.filter((user) => {
      // First filter: only show zone representatives
      const isZoneRepresentative = user?.role?.name?.toLowerCase() === "zone representative"

      if (!isZoneRepresentative) return false

      // Second filter: apply search if searchable is enabled
      if (searchable && searchTerm) {
        const matchesSearch =
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
      }

      return true // Show all zone representatives if no search term
    })

    // FIXED: Reset to default value after selection
    const handleSelect = (user: User, e: React.MouseEvent) => {
      e.stopPropagation()

      // Use the data we already have from the initial fetch
      const fullName = `${user.firstName} ${user.lastName}`
      setSelected(defaultValue) // Reset to default instead of showing selected name
      setOpen(false)
      setSearchTerm("")
      setIsSearching(false)

      // Call the onSelect callback with the user ID and name
      onSelect?.(user._id, fullName)
    }

    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!open) {
        setOpen(true)
        if (searchable) {
          setTimeout(() => {
            inputRef.current?.focus()
            setIsSearching(true)
          }, 100)
        }
      } else {
        setOpen(false)
        setIsSearching(false)
      }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    }

    const handleInputFocus = () => {
      setIsSearching(true)
    }

    const handleInputBlur = () => {
      setTimeout(() => {
        setIsSearching(false)
      }, 150)
    }

    useEffect(() => {
      if (!open) {
        setSearchTerm("")
        setIsSearching(false)
      }
    }, [open])

    return (
      <div className="relative text-left text-[#5D6679]" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
        <div
          className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full cursor-pointer ${className}`}
          onClick={handleButtonClick}
        >
          <div className="flex items-center text-start gap-2 flex-1">
            {iconFirst && icon}
            {searchable && open && isSearching ? (
              <input
                ref={inputRef}
                type="text"
                onClick={(e) => {
                  e.stopPropagation()
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="outline-none bg-transparent flex-1 font-medium text-gray-600"
                autoFocus
              />
            ) : (
              <>
                {DropDownName && <span className="font-medium">{DropDownName}</span>}
                {!DropDownName && <span>{isLoading ? "Loading..." : selected}</span>}
                {DropDownName && <span>{isLoading ? "Loading..." : selected}</span>}
              </>
            )}
          </div>
          {!icon && <FaChevronDown className={`text-xs ml-2 transition-transform ${open ? "rotate-180" : ""}`} />}
          {!iconFirst && icon}
        </div>

        {open && (
          <ul
            className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
              isAbove ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {filteredUsers.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-500">{noResultsMessage}</li>
            ) : (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={(e) => handleSelect(user, e)}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {`${user.firstName} ${user.lastName}`}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    )
  },
)

ZoneRepresentativeDropDown.displayName = "ZoneRepresentativeDropDown"

export default ZoneRepresentativeDropDown
