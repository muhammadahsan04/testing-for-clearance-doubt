// import React, { useState, useEffect, useRef } from "react";
// import { FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// type UserDropDownProps = {
//   className?: string;
//   icon?: React.ReactNode;
//   iconFirst?: boolean;
//   onSelect?: (userId: string, userName: string) => void;
//   defaultValue?: string;
//   DropDownName?: string;
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
// }

// const UserDropDown: React.FC<UserDropDownProps> = ({
//   className = "",
//   onSelect,
//   icon,
//   iconFirst = false,
//   defaultValue = "Select Manager",
//   DropDownName,
// }) => {
//   const [selected, setSelected] = useState(defaultValue);
//   const [open, setOpen] = useState(false);
//   const [isAbove, setIsAbove] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Fetch all users
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

//   const handleSelect = async (user: User, e: React.MouseEvent) => {
//     // Stop propagation to prevent modal from closing
//     e.stopPropagation();

//     try {
//       const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Get detailed user information
//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getOneUser/${user._id}`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const userData = response.data.data;
//         const fullName = `${userData.firstName} ${userData.lastName}`;

//         setSelected(fullName);
//         setOpen(false);

//         // Pass both user ID and full name to parent component
//         onSelect?.(userData._id, fullName);
//       } else {
//         toast.error("Failed to get user details");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       toast.error("Failed to get user details");
//     }
//   };

//   // Close dropdown on outside click
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

//   // Check dropdown position
//   useEffect(() => {
//     const checkDropdownPosition = () => {
//       if (dropdownRef.current) {
//         const dropdownRect = dropdownRef.current.getBoundingClientRect();
//         const spaceBelow = window.innerHeight - dropdownRect.bottom;
//         setIsAbove(spaceBelow < 200); // Adjust based on expected dropdown height
//       }
//     };
//     if (open) {
//       checkDropdownPosition();
//     }
//     window.addEventListener("resize", checkDropdownPosition);
//     return () => window.removeEventListener("resize", checkDropdownPosition);
//   }, [open]);

//   return (
//     <div
//       className="relative text-left text-[#5D6679]"
//       ref={dropdownRef}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <button
//         type="button"
//         onClick={(e) => {
//           e.stopPropagation();
//           setOpen((prev) => !prev);
//         }}
//         className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full ${className}`}
//       >
//         <div className="flex items-center text-start gap-2">
//           {DropDownName && <span className="font-medium">{DropDownName}</span>}
//           {iconFirst && icon}
//           <span>{isLoading ? "Loading..." : selected}</span>
//         </div>
//         {!icon && <FaChevronDown className="text-xs ml-2" />}
//         {!iconFirst && icon}
//       </button>
//       {open && (
//         <ul
//           className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${
//             isAbove ? "bottom-full mb-2" : "top-full mt-2"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {users.length === 0 ? (
//             <li className="px-4 py-2 text-sm text-gray-500">No users found</li>
//           ) : (
//             users.map((user) => (
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

// export default UserDropDown;

import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

type UserDropDownProps = {
  className?: string;
  icon?: React.ReactNode;
  iconFirst?: boolean;
  onSelect?: (userId: string, userName: string) => void;
  defaultValue?: string;
  DropDownName?: string;
  searchable?: boolean; // Add this prop
  noResultsMessage?: string; // Add this prop
};

// // Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
}

const UserDropDown: React.FC<UserDropDownProps> = ({
  className = "",
  onSelect,
  icon,
  iconFirst = false,
  defaultValue = "Select Manager",
  DropDownName,
  searchable = false, // Add this prop
  noResultsMessage = "No users found", // Add this prop
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state
  const [isSearching, setIsSearching] = useState(false); // Add searching state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Add input ref
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const API_URL =
          import.meta.env.VITE_BASE_URL || "http://localhost:9000";
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }
        const response = await axios.get(
          `${API_URL}/api/abid-jewelry-ms/getAllUsers`,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          // console.log("Users fetched:", response.data.data); // Add this for debugging
        } else {
          toast.warning("No users found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Also add the missing useEffect hooks for click outside and dropdown position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const checkDropdownPosition = () => {
      if (dropdownRef.current) {
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - dropdownRect.bottom;
        setIsAbove(spaceBelow < 200);
      }
    };

    if (open) {
      checkDropdownPosition();
    }

    window.addEventListener("resize", checkDropdownPosition);
    return () => window.removeEventListener("resize", checkDropdownPosition);
  }, [open]);

  // Filter users based on search term
  const filteredUsers = searchable
    ? users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Rest of your existing code remains the same until the handleSelect function...

  const handleSelect = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneUser/${user._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const userData = response.data.data;
        const fullName = `${userData.firstName} ${userData.lastName}`;
        setSelected(fullName);
        setOpen(false);
        setSearchTerm(""); // Reset search term
        setIsSearching(false); // Reset searching state
        onSelect?.(userData._id, fullName);
      } else {
        toast.error("Failed to get user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to get user details");
    }
  };

  // Add button click handler
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) {
      setOpen(true);
      if (searchable) {
        setTimeout(() => {
          inputRef.current?.focus();
          setIsSearching(true);
        }, 100);
      }
    } else {
      setOpen(false);
      setIsSearching(false);
    }
  };

  // Add search input handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setIsSearching(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 150);
  };

  // Clear search term when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setIsSearching(false);
    }
  }, [open]);

  // Rest of your existing useEffect hooks remain the same...

  return (
    <div
      className="relative text-left text-[#5D6679]"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 text-[13px] w-full cursor-pointer ${className}`}
        onClick={handleButtonClick}
      >
        <div className="flex items-center text-start gap-2 flex-1">
          {iconFirst && icon}
          {/* Show input when searching, otherwise show labels */}
          {searchable && open && isSearching ? (
            <input
              ref={inputRef}
              type="text"
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              // placeholder={DropDownName || "Search users..."}
              className="outline-none bg-transparent flex-1 font-medium text-gray-600"
              autoFocus
            />
          ) : (
            <>
              {DropDownName && (
                <span className="font-medium">{DropDownName}</span>
              )}
              {!DropDownName && (
                <span>{isLoading ? "Loading..." : selected}</span>
              )}
              {DropDownName && (
                <span>{isLoading ? "Loading..." : selected}</span>
              )}
            </>
          )}
        </div>
        {!icon && (
          <FaChevronDown
            className={`text-xs ml-2 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
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
            <li className="px-4 py-2 text-sm text-gray-500">
              {noResultsMessage}
            </li>
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
  );
};

export default UserDropDown;
