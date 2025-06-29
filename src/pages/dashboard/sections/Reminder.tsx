// import React from "react";
// import { FiClock } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";

// const reminders = [
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#FE9601]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#6700CD]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0695CA]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
// ];

// const Reminder = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">
//         Reminders
//       </h2>
//       <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
//         {reminders.map((reminder, index) => (
//           <div
//             key={index}
//             className="border-b last:border-none border-gray-400 pb-4 last:pb-0 grid grid-cols-[auto_1fr_auto] items-start gap-4 Source-Sans-Pro-font"
//           >
//             {/* Close Icon */}
//             <button className="text-white bg-[#DEE5E7] rounded-sm hover:text-red-500 mt-1">
//               <IoMdClose size={18} />
//             </button>

//             {/* Reminder Content */}
//             <div className="space-y-1">
//               <span
//                 className={`text-white text-xs px-2 py-1 rounded-md inline-block ${reminder.color}`}
//               >
//                 {reminder.label}
//               </span>
//               <h3 className="font-semibold text-md text-[#525252]">
//                 There are many variations of passages
//               </h3>
//               <p className="text-[14px] font-semibold text-[#525252e3]">
//                 Lorem Ipsum is simply dummy text of the printing and typesetting
//                 industry. Lorem Ipsum has been the industry’s standard dummy
//                 text ever since the 1500s
//               </p>
//               <p className="text-red-500 font-semibold text-[15px]">
//                 {reminder.username}
//               </p>
//             </div>

//             {/* Time */}
//             <div className="flex items-center text-[#5D6679] font-semibold text-sm gap-2">
//               <FiClock size={16} className="" />
//               <span>24 Nov 2025 at 9:30 AM</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reminder;

// import React from "react";
// import { FiClock } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";

// const reminders = [
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#FE9601]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#6700CD]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0695CA]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
// ];

// const Reminder = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="Inter-font font-semibold text-[20px] mb-2">Reminders</h2>
//       <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
//         {reminders.map((reminder, index) => (
//           <div
//             key={index}
//             className="border-b last:border-none border-gray-400 pb-4 last:pb-0 grid grid-cols-[auto_1fr_auto] items-start gap-4 Source-Sans-Pro-font"
//           >
//             {/* Close Icon */}
//             <button className="text-white bg-[#DEE5E7] rounded-sm hover:text-red-500 mt-1">
//               <IoMdClose size={18} />
//             </button>

//             {/* Reminder Content */}
//             <div className="space-y-1 border">
//               <div className="flex space-between border">
//                 <span
//                   className={`text-white text-xs px-2 py-1 rounded-md inline-block ${reminder.color}`}
//                 >
//                   {reminder.label}
//                 </span>

//                 <div className="flex item-center">
//                   <FiClock size={16} className="" />
//                   <span>24 Nov 2025 at 9:30 AM</span>
//                 </div>
//               </div>
//               <h3 className="font-semibold text-md text-[#525252]">
//                 There are many variations of passages
//               </h3>
//               <p className="text-[14px] font-semibold text-[#525252e3]">
//                 Lorem Ipsum is simply dummy text of the printing and typesetting
//                 industry. Lorem Ipsum has been the industry’s standard dummy
//                 text ever since the 1500s
//               </p>
//               <p className="text-red-500 font-semibold text-[15px]">
//                 {reminder.username}
//               </p>
//             </div>

//             {/* Time */}
//             {/* <div className="flex items-center text-[#5D6679] font-semibold text-sm gap-2">
//               <FiClock size={16} className="" />
//               <span>24 Nov 2025 at 9:30 AM</span>
//             </div> */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reminder;

// import React from "react";
// import { FiClock } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";

// const reminders = [
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#FE9601]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#6700CD]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0695CA]", username: "Allen Deu" },
//   { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
// ];

// const Reminder = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
//       <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
//         {reminders.map((reminder, index) => (
//           <div
//             key={index}
//             className="border-b last:border-none border-gray-300 pb-4 last:pb-0 grid grid-cols-[auto_1fr] gap-4 items-start Source-Sans-Pro-font"
//           >
//             {/* Close Icon */}
//             <button className="text-white bg-[#DEE5E7] rounded-sm p-[2px]">
//               <IoMdClose size={18} />
//             </button>

//             {/* Reminder Content */}
//             <div className="space-y-2">
//               {/* Badge + Time */}  
//               <div className="flex justify-between items-center">
//                 <span
//                   className={`text-white text-xs px-2 py-[3px] rounded-md ${reminder.color}`}
//                 >
//                   {reminder.label}
//                 </span>
//                 <div className="flex items-center gap-1 text-[13px] text-[#525252] font-medium">
//                   <FiClock size={15} />
//                   <span>24 Nov 2025 at 9:30 AM</span>
//                 </div>
//               </div>

//               {/* Title */}
//               <h3 className="font-semibold text-[15px] text-[#525252]">
//                 There are many variations of passages
//               </h3>

//               {/* Description */}
//               <p className="text-[14px] font-semibold text-[#525252e3] leading-relaxed">
//                 Lorem Ipsum is simply dummy text of the printing and typesetting
//                 industry. Lorem Ipsum has been the industry’s standard dummy
//                 text ever since the 1500s
//               </p>

//               {/* Username */}
//               <p className="text-red-500 font-semibold text-[15px]">
//                 {reminder.username}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reminder;


// import React, { useState, useEffect } from "react";
// import { FiClock } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";
// import axios from "axios";
// import { toast } from "react-toastify"; // Make sure you have react-toastify installed

// // API Configuration
// const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

// const getAuthToken = () => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     token = sessionStorage.getItem("token");
//   }
//   return token;
// };

// // Types for better type safety
// interface Notification {
//   _id: string;
//   label: string;
//   color: string;
//   username: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   isRead: boolean;
//   // Add other fields as per your API response
// }

// const Reminder = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Axios instance with default config
//   const apiClient = axios.create({
//     baseURL: API_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   // Add auth token to requests
//   apiClient.interceptors.request.use((config) => {
//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   // Fetch user notifications
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await apiClient.get('/api/abid-jewelry-ms/getUserNotifications');

//       if (response.data && response.data.success) {
//         setNotifications(response.data.data || response.data.notifications || []);
//       } else {
//         setError("Failed to fetch notifications");
//         toast.error("Failed to fetch notifications");
//       }
//     } catch (err: any) {
//       console.error("Error fetching notifications:", err);
//       setError(err.response?.data?.message || "Failed to fetch notifications");
//       toast.error(err.response?.data?.message || "Failed to fetch notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark single notification as read
//   const markAsRead = async (notificationId: string) => {
//     try {
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await apiClient.get(`/api/abid-jewelry-ms/${notificationId}/read`);

//       if (response.data && response.data.success) {
//         // Update the notification in the local state
//         setNotifications(prev =>
//           prev.map(notification =>
//             notification._id === notificationId
//               ? { ...notification, isRead: true }
//               : notification
//           )
//         );
//         toast.success("Notification marked as read");
//       } else {
//         toast.error("Failed to mark notification as read");
//       }
//     } catch (err: any) {
//       console.error("Error marking notification as read:", err);
//       toast.error(err.response?.data?.message || "Failed to mark notification as read");
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       const token = getAuthToken();

//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       // Note: The API endpoint seems to have the same path as single read
//       // You might need to adjust this based on your actual API
//       const response = await apiClient.get('/api/abid-jewelry-ms/notificationId/read');

//       if (response.data && response.data.success) {
//         // Update all notifications as read
//         setNotifications(prev =>
//           prev.map(notification => ({ ...notification, isRead: true }))
//         );
//         toast.success("All notifications marked as read");
//       } else {
//         toast.error("Failed to mark all notifications as read");
//       }
//     } catch (err: any) {
//       console.error("Error marking all notifications as read:", err);
//       toast.error(err.response?.data?.message || "Failed to mark all notifications as read");
//     }
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   // Get color class based on notification type or use default colors
//   const getColorClass = (notification: Notification, index: number) => {
//     if (notification.color) return notification.color;

//     const defaultColors = [
//       "bg-[#0C9938]",
//       "bg-[#FE9601]",
//       "bg-[#6700CD]",
//       "bg-[#0695CA]"
//     ];
//     return defaultColors[index % defaultColors.length];
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="ml-2">Loading notifications...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && notifications.length === 0) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="text-center py-8">
//             <p className="text-red-500 mb-4">{error}</p>
//             <button
//               onClick={fetchNotifications}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="Inter-font font-semibold text-[20px]">Reminders</h2>
//         {notifications.length > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
//         {notifications.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             No notifications found
//           </div>
//         ) : (
//           notifications.map((notification, index) => (
//             <div
//               key={notification._id}
//               className={`border-b last:border-none border-gray-300 pb-4 last:pb-0 grid grid-cols-[auto_1fr] gap-4 items-start Source-Sans-Pro-font ${notification.isRead ? 'opacity-60' : ''
//                 }`}
//             >
//               {/* Close Icon */}
//               <button
//                 className="text-white bg-[#DEE5E7] rounded-sm p-[2px] hover:bg-gray-400"
//                 onClick={() => markAsRead(notification._id)}
//                 title="Mark as read"
//               >
//                 <IoMdClose size={18} />
//               </button>

//               {/* Reminder Content */}
//               <div className="space-y-2">
//                 {/* Badge + Time */}
//                 <div className="flex justify-between items-center">
//                   <span
//                     className={`text-white text-xs px-2 py-[3px] rounded-md ${getColorClass(notification, index)}`}
//                   >
//                     {notification.label || "Notification"}
//                   </span>
//                   <div className="flex items-center gap-1 text-[13px] text-[#525252] font-medium">
//                     <FiClock size={15} />
//                     <span>{formatDate(notification.createdAt)}</span>
//                   </div>
//                 </div>

//                 {/* Title */}
//                 <h3 className="font-semibold text-[15px] text-[#525252]">
//                   {notification.title || "There are many variations of passages"}
//                 </h3>

//                 {/* Description */}
//                 <p className="text-[14px] font-semibold text-[#525252e3] leading-relaxed">
//                   {notification.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
//                 </p>

//                 {/* Username */}
//                 <p className="text-red-500 font-semibold text-[15px]">
//                   {notification.username || "Unknown User"}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reminder;



// import React, { useState, useEffect } from "react";
// import { FiClock } from "react-icons/fi";
// import { IoMdClose } from "react-icons/io";
// import axios from "axios";
// import { toast } from "react-toastify";

// interface Notification {
//   _id: string;
//   label: string;
//   title: string;
//   description: string;
//   username: string;
//   createdAt: string;
//   isRead: boolean;
//   color?: string;
// }

// const Reminder = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);

//   const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

//   const getAuthToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = sessionStorage.getItem("token");
//     }
//     return token;
//   };

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.get(
//         `${API_URL}/api/abid-jewelry-ms/getUserNotifications`,
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         setNotifications(response.data.notifications || []);
//       } else {
//         toast.error("Failed to fetch notifications");
//       }
//     } catch (error: any) {
//       console.error("Error fetching notifications:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to fetch notifications"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark single notification as read
//   const markAsRead = async (notificationId: string) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.patch(
//         `${API_URL}/api/abid-jewelry-ms/${notificationId}/read`,
//         {},
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         // Remove the notification from the list or mark as read
//         setNotifications(prev =>
//           prev.filter(notification => notification._id !== notificationId)
//         );
//         toast.success("Notification marked as read");
//       } else {
//         toast.error("Failed to mark notification as read");
//       }
//     } catch (error: any) {
//       console.error("Error marking notification as read:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to mark notification as read"
//       );
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         toast.error("Authentication token not found. Please login again.");
//         return;
//       }

//       const response = await axios.patch(
//         `${API_URL}/api/abid-jewelry-ms/notifications/reads`,
//         {},
//         {
//           headers: {
//             "x-access-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         setNotifications([]);
//         toast.success("All notifications marked as read");
//       } else {
//         toast.error("Failed to mark all notifications as read");
//       }
//     } catch (error: any) {
//       console.error("Error marking all notifications as read:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to mark all notifications as read"
//       );
//     }
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }) + " at " + date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // Get color for notification type
//   const getNotificationColor = (label: string) => {
//     const colorMap: { [key: string]: string } = {
//       "Joined New User": "bg-[#0C9938]",
//       "Order Placed": "bg-[#FE9601]",
//       "Payment Received": "bg-[#6700CD]",
//       "Inventory Update": "bg-[#0695CA]",
//       default: "bg-[#525252]",
//     };
//     return colorMap[label] || colorMap.default;
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="Inter-font font-semibold text-[20px]">Reminders</h2>
//         {notifications.length > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-4">
//         {notifications.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <p>No notifications available</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {notifications.map((notification) => (
//               <div
//                 key={notification._id}
//                 className="border-b last:border-none border-gray-300 pb-4 last:pb-0 grid grid-cols-[auto_1fr] gap-4 items-start Source-Sans-Pro-font"
//               >
//                 {/* Close Icon */}
//                 <button
//                   onClick={() => markAsRead(notification._id)}
//                   className="text-gray-600 bg-[#DEE5E7] rounded-sm p-[2px] hover:bg-gray-300 transition-colors"
//                 >
//                   <IoMdClose size={18} />
//                 </button>

//                 {/* Reminder Content */}
//                 <div className="space-y-2">
//                   {/* Badge + Time */}
//                   <div className="flex justify-between items-center">
//                     <span
//                       className={`text-white text-xs px-2 py-[3px] rounded-md ${getNotificationColor(notification.label)}`}
//                     >
//                       {notification.label}
//                     </span>
//                     <div className="flex items-center gap-1 text-[13px] text-[#525252] font-medium">
//                       <FiClock size={15} />
//                       <span>{formatDate(notification.createdAt)}</span>
//                     </div>
//                   </div>

//                   {/* Title */}
//                   <h3 className="font-semibold text-[15px] text-[#525252]">
//                     {notification.title}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-[14px] font-semibold text-[#525252e3] leading-relaxed">
//                     {notification.description}
//                   </p>

//                   {/* Username */}
//                   <p className="text-red-500 font-semibold text-[15px]">
//                     {notification.username}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reminder;


import React, { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

interface Notification {
  _id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  recipientType: string;
  relatedInvoiceType?: string;
  relatedInvoice?: any;
}

const Reminder = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getUserNotifications`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        // Filter only unread notifications
        const unreadNotifications = response.data.data.filter(
          (notification: Notification) => notification.status === "unread"
        );
        setNotifications(unreadNotifications || []);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/abid-jewelry-ms/${notificationId}/read`,
        {},
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        // Remove the notification from the list
        setNotifications(prev =>
          prev.filter(notification => notification._id !== notificationId)
        );
        toast.success("Notification marked as read");
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/abid-jewelry-ms/markAllRead`,
        {},
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setNotifications([]);
        toast.success("All notifications marked as read");
      } else {
        toast.error("Failed to mark all notifications as read");
      }
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark all notifications as read"
      );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get color for notification type
  const getNotificationColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      "Invoice Due Reminder": "bg-[#FE9601]",
      "Payment Received": "bg-[#6700CD]",
      "Inventory Update": "bg-[#0695CA]",
      "User Joined": "bg-[#0C9938]",
      default: "bg-[#525252]",
    };
    return colorMap[type] || colorMap.default;
  };

  // Get notification label based on type
  const getNotificationLabel = (notification: Notification) => {
    if (notification.relatedInvoiceType === "PurchaseInvoice") {
      return "Invoice Due";
    }
    return notification.title || "Notification";
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="Inter-font font-semibold text-[20px]">Reminders</h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="border-b last:border-none border-gray-300 pb-4 last:pb-0 grid grid-cols-[auto_1fr] gap-4 items-start Source-Sans-Pro-font"
              >
                {/* Close Icon */}
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-gray-600 bg-[#DEE5E7] rounded-sm p-[2px] hover:bg-gray-300 transition-colors"
                >
                  <IoMdClose size={18} />
                </button>

                {/* Reminder Content */}
                <div className="space-y-2">
                  {/* Badge + Time */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-white text-xs px-2 py-[3px] rounded-md ${getNotificationColor(notification.title)}`}
                    >
                      {getNotificationLabel(notification)}
                    </span>
                    <div className="flex items-center gap-1 text-[13px] text-[#525252] font-medium">
                      <FiClock size={15} />
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-[15px] text-[#525252]">
                    {notification.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] font-semibold text-[#525252e3] leading-relaxed">
                    {notification.message}
                  </p>

                  {/* Username */}
                  <p className="text-red-500 font-semibold text-[15px]">
                    {notification.recipient.firstName} {notification.recipient.lastName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminder;
