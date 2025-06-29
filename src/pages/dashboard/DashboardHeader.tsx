import React, { useState, useRef, useEffect } from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "../../components/Button";
import user from "../../assets/user.svg";
import chain from "../../assets/chain.png";
import { clearPersistedPermissions } from "../../redux/slices/permissionSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { BsWallet2 } from "react-icons/bs";

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

const DashboardHeader: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    profileImage?: string;
    firstName?: string;
  }>({});

  const notificationRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  const toggleNotificationsPanel = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    let storedUser = localStorage.getItem("user");

    // If not in localStorage, check sessionStorage
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }

    if (storedUser) {
      try {
        const token = getAuthToken();

        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedOutside =
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        iconRef.current &&
        !iconRef.current.contains(target);

      if (clickedOutside) {
        setShowNotifications(false);
      }
    };

    // Use capture phase to avoid race conditions
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  // Handle logout function
  const handleLogout = () => {
    // Explicitly dispatch the clearPersistedPermissions action
    dispatch(clearPersistedPermissions());

    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("persistedPermissions");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Clear token and user data from sessionStorage as well
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("permissions");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="bg-white dashboard-header flex justify-between items-center px-4 md:px-5 lg:px-7 py-3 shadow-[0_4px_10px_2px_rgba(0,0,0,0.12)] sticky top-0 z-30">
      <h1 className="Source-Sans-Pro-font text-[15px] sm:text-[18px] md:text-[22px] lg:text-[24px] text-[#5D6679] flex items-center">
        <div
          className="px-1 py-1 border-1 mr-2 rounded-sm lg:hidden cursor-pointer text-[#606777]"
          onClick={toggleSidebar}
        >
          <IoMenu />
        </div>
        Administration
      </h1>

      <div className="flex items-center gap-5 relative">
        <div className="relative cursor-pointer">
          <BsWallet2 className="text-[19px]" />
        </div>
        {/* Bell Icon */}
        <div
          ref={iconRef}
          className="relative cursor-pointer"
          onClick={toggleNotificationsPanel}
        >
          <IoNotificationsOutline className="text-[19px]" />
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute right-14 top-10 bg-white rounded shadow-lg w-[350px] z-50 border border-gray-200 select-none"
            draggable={false}
          >
            <div className="bg-[#F5EFE2] px-4 py-2 border-b border-gray-200 text-sm">
              Notifications
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-white text-sm font-semibold border-b">
              <span className="text-[#000]">Unread</span>
              <button className="bg-[#F5EFE2] px-2 py-1 text-xs rounded">
                Mark all as read
              </button>
            </div>
            <div className="px-4 py-3 flex items-start gap-3 bg-[#E9F4FF] text-xs">
              <div className="flex items-center">
                <div className="w-[8px] h-[8px] bg-red-500 rounded-full" />
              </div>
              <div className="mt-1">
                <img src={chain} alt="" width={90} />
              </div>
              <div>
                <p>
                  <span className="font-semibold">Enchanted Chain</span> has
                  been delivered to the store (Zone 2, Velvet & Gold), and Sarah
                  Johnson has verified it.
                </p>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  Nov 3, 2024, 5:30 PM
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User & Logout Buttons */}
        <div className="flex gap-3">
          {/* <Button
            className="select-none"
            imageSrc={user}
            text="Abid"
            variant="bg"
            fontFamily="Source-Sans-Pro-font"
            onClick={() => alert("Image Button with Text and Icon Clicked")}
            icon={<IoIosArrowDown />}
          /> */}

          <Button
            className="select-none"
            imageSrc={`${API_URL}${userInfo.profileImage}` || user}
            text={userInfo.firstName || "User"}
            variant="bg"
            fontFamily="Source-Sans-Pro-font"
            onClick={() => alert("Image Button with Text and Icon Clicked")}
            icon={<IoIosArrowDown />}
          />

          <Button
            className="select-none"
            variant="border"
            fontFamily="Inter-font"
            text="Logout"
            icon={<AiOutlineLogout />}
            onClick={handleLogout} // Use the handleLogout function
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;


// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { IoMenu, IoNotificationsOutline } from "react-icons/io5"
// import { AiOutlineLogout } from "react-icons/ai"
// import { IoIosArrowDown } from "react-icons/io"
// import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
// import user from "../../assets/user.svg"
// import chain from "../../assets/chain.png"
// import { clearPersistedPermissions } from "../../redux/slices/permissionSlice"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { BsWallet2 } from "react-icons/bs"

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token")
//   if (!token) {
//     token = sessionStorage.getItem("token")
//   }
//   return token
// }

// interface DashboardHeaderProps {
//   toggleSidebar: () => void
//   isSidebarOpen: boolean
// }

// const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [userInfo, setUserInfo] = useState<{
//     profileImage?: string
//     firstName?: string
//   }>({})

//   const notificationRef = useRef<HTMLDivElement>(null)
//   const iconRef = useRef<HTMLDivElement>(null)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000"

//   const toggleNotificationsPanel = () => {
//     setShowNotifications((prev) => !prev)
//   }

//   useEffect(() => {
//     let storedUser = localStorage.getItem("user")

//     if (!storedUser) {
//       storedUser = sessionStorage.getItem("user")
//     }

//     if (storedUser) {
//       try {
//         const token = getAuthToken()

//         if (!token) {
//           toast.error("Authentication token not found. Please login again.")
//           return
//         }

//         const parsedUser = JSON.parse(storedUser)
//         setUserInfo(parsedUser)
//       } catch (error) {
//         console.error("Failed to parse user data", error)
//       }
//     }

//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node

//       const clickedOutside =
//         notificationRef.current &&
//         !notificationRef.current.contains(target) &&
//         iconRef.current &&
//         !iconRef.current.contains(target)

//       if (clickedOutside) {
//         setShowNotifications(false)
//       }
//     }

//     document.addEventListener("click", handleClickOutside, true)
//     return () => document.removeEventListener("click", handleClickOutside, true)
//   }, [])

//   const handleLogout = () => {
//     dispatch(clearPersistedPermissions())

//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     localStorage.removeItem("persistedPermissions")
//     localStorage.removeItem("persist:root")
//     localStorage.removeItem("permissions")
//     localStorage.removeItem("role")
//     localStorage.removeItem("userId")

//     sessionStorage.removeItem("token")
//     sessionStorage.removeItem("user")
//     sessionStorage.removeItem("permissions")
//     sessionStorage.removeItem("role")
//     sessionStorage.removeItem("userId")

//     navigate("/")
//   }

//   return (
//     <div className="bg-white dashboard-header flex justify-between items-center px-4 md:px-5 lg:px-7 py-3 shadow-[0_4px_10px_2px_rgba(0,0,0,0.12)] sticky top-0 z-30">
//       <h1 className="Source-Sans-Pro-font text-[15px] sm:text-[18px] md:text-[22px] lg:text-[24px] text-[#5D6679] flex items-center">
//         <button
//           className="p-2 mr-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//           onClick={toggleSidebar}
//         >
//           <IoMenu className="text-[20px] text-[#606777]" />
//         </button>
//         Administration
//       </h1>

//       <div className="flex items-center gap-5 relative">
//         <div className="relative cursor-pointer">
//           <BsWallet2 className="text-[19px]" />
//         </div>

//         <div ref={iconRef} className="relative cursor-pointer" onClick={toggleNotificationsPanel}>
//           <IoNotificationsOutline className="text-[19px]" />
//         </div>

//         {showNotifications && (
//           <div
//             ref={notificationRef}
//             className="absolute right-14 top-10 bg-white rounded shadow-lg w-[350px] z-50 border border-gray-200 select-none"
//             draggable={false}
//           >
//             <div className="bg-[#F5EFE2] px-4 py-2 border-b border-gray-200 text-sm">Notifications</div>
//             <div className="flex justify-between items-center px-4 py-2 bg-white text-sm font-semibold border-b">
//               <span className="text-[#000]">Unread</span>
//               <button className="bg-[#F5EFE2] px-2 py-1 text-xs rounded">Mark all as read</button>
//             </div>
//             <div className="px-4 py-3 flex items-start gap-3 bg-[#E9F4FF] text-xs">
//               <div className="flex items-center">
//                 <div className="w-[8px] h-[8px] bg-red-500 rounded-full" />
//               </div>
//               <div className="mt-1">
//                 <img src={chain || "/placeholder.svg"} alt="" width={90} />
//               </div>
//               <div>
//                 <p>
//                   <span className="font-semibold">Enchanted Chain</span> has been delivered to the store (Zone 2, Velvet
//                   & Gold), and Sarah Johnson has verified it.
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1 text-right">Nov 3, 2024, 5:30 PM</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3">
//           <Button
//             className="select-none"
//             imageSrc={`${API_URL}${userInfo.profileImage}` || user}
//             text={userInfo.firstName || "User"}
//             variant="bg"
//             fontFamily="Source-Sans-Pro-font"
//             onClick={() => alert("Image Button with Text and Icon Clicked")}
//             icon={<IoIosArrowDown />}
//           />

//           <Button
//             className="select-none"
//             variant="border"
//             fontFamily="Inter-font"
//             text="Logout"
//             icon={<AiOutlineLogout />}
//             onClick={handleLogout}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashboardHeader



// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { IoMenu, IoNotificationsOutline } from "react-icons/io5"
// import { AiOutlineLogout } from "react-icons/ai"
// import { IoIosArrowDown } from "react-icons/io"
// import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
// import user from "../../assets/user.svg"
// import chain from "../../assets/chain.png"
// import { clearPersistedPermissions } from "../../redux/slices/permissionSlice"
// import { useDispatch } from "react-redux"
// import { toast } from "react-toastify"
// import { BsWallet2 } from "react-icons/bs"

// // Helper function to get auth token
// const getAuthToken = () => {
//   let token = localStorage.getItem("token")
//   if (!token) {
//     token = sessionStorage.getItem("token")
//   }
//   return token
// }

// interface DashboardHeaderProps {
//   toggleSidebar: () => void
//   isSidebarOpen: boolean
// }

// const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [userInfo, setUserInfo] = useState<{
//     profileImage?: string
//     firstName?: string
//   }>({})

//   const notificationRef = useRef<HTMLDivElement>(null)
//   const iconRef = useRef<HTMLDivElement>(null)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000"

//   const toggleNotificationsPanel = () => {
//     setShowNotifications((prev) => !prev)
//   }

//   useEffect(() => {
//     let storedUser = localStorage.getItem("user")

//     if (!storedUser) {
//       storedUser = sessionStorage.getItem("user")
//     }

//     if (storedUser) {
//       try {
//         const token = getAuthToken()

//         if (!token) {
//           toast.error("Authentication token not found. Please login again.")
//           return
//         }

//         const parsedUser = JSON.parse(storedUser)
//         setUserInfo(parsedUser)
//       } catch (error) {
//         console.error("Failed to parse user data", error)
//       }
//     }

//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node

//       const clickedOutside =
//         notificationRef.current &&
//         !notificationRef.current.contains(target) &&
//         iconRef.current &&
//         !iconRef.current.contains(target)

//       if (clickedOutside) {
//         setShowNotifications(false)
//       }
//     }

//     document.addEventListener("click", handleClickOutside, true)
//     return () => document.removeEventListener("click", handleClickOutside, true)
//   }, [])

//   const handleLogout = () => {
//     dispatch(clearPersistedPermissions())

//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     localStorage.removeItem("persistedPermissions")
//     localStorage.removeItem("persist:root")
//     localStorage.removeItem("permissions")
//     localStorage.removeItem("role")
//     localStorage.removeItem("userId")

//     sessionStorage.removeItem("token")
//     sessionStorage.removeItem("user")
//     sessionStorage.removeItem("permissions")
//     sessionStorage.removeItem("role")
//     sessionStorage.removeItem("userId")

//     navigate("/")
//   }

//   return (
//     <div className="bg-white dashboard-header flex justify-between items-center px-4 md:px-5 lg:px-7 py-3 shadow-[0_4px_10px_2px_rgba(0,0,0,0.12)] sticky top-0 z-30">
//       <h1 className="Source-Sans-Pro-font text-[15px] sm:text-[18px] md:text-[22px] lg:text-[24px] text-[#5D6679] flex items-center">
//         <button
//           className="p-2 mr-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//           onClick={toggleSidebar}
//         >
//           <IoMenu className="text-[20px] text-[#606777]" />
//         </button>
//         Administration
//       </h1>

//       <div className="flex items-center gap-5 relative">
//         <div className="relative cursor-pointer">
//           <BsWallet2 className="text-[19px]" />
//         </div>

//         <div ref={iconRef} className="relative cursor-pointer" onClick={toggleNotificationsPanel}>
//           <IoNotificationsOutline className="text-[19px]" />
//         </div>

//         {showNotifications && (
//           <div
//             ref={notificationRef}
//             className="absolute right-14 top-10 bg-white rounded shadow-lg w-[350px] z-50 border border-gray-200 select-none"
//             draggable={false}
//           >
//             <div className="bg-[#F5EFE2] px-4 py-2 border-b border-gray-200 text-sm">Notifications</div>
//             <div className="flex justify-between items-center px-4 py-2 bg-white text-sm font-semibold border-b">
//               <span className="text-[#000]">Unread</span>
//               <button className="bg-[#F5EFE2] px-2 py-1 text-xs rounded">Mark all as read</button>
//             </div>
//             <div className="px-4 py-3 flex items-start gap-3 bg-[#E9F4FF] text-xs">
//               <div className="flex items-center">
//                 <div className="w-[8px] h-[8px] bg-red-500 rounded-full" />
//               </div>
//               <div className="mt-1">
//                 <img src={chain || "/placeholder.svg"} alt="" width={90} />
//               </div>
//               <div>
//                 <p>
//                   <span className="font-semibold">Enchanted Chain</span> has been delivered to the store (Zone 2, Velvet
//                   & Gold), and Sarah Johnson has verified it.
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1 text-right">Nov 3, 2024, 5:30 PM</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3">
//           <Button
//             className="select-none"
//             imageSrc={`${API_URL}${userInfo.profileImage}` || user}
//             text={userInfo.firstName || "User"}
//             variant="bg"
//             fontFamily="Source-Sans-Pro-font"
//             onClick={() => alert("Image Button with Text and Icon Clicked")}
//             icon={<IoIosArrowDown />}
//           />

//           <Button
//             className="select-none"
//             variant="border"
//             fontFamily="Inter-font"
//             text="Logout"
//             icon={<AiOutlineLogout />}
//             onClick={handleLogout}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashboardHeader
