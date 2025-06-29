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

import React from "react";
import { FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const reminders = [
  { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
  { label: "Joined New User", color: "bg-[#FE9601]", username: "Allen Deu" },
  { label: "Joined New User", color: "bg-[#6700CD]", username: "Allen Deu" },
  { label: "Joined New User", color: "bg-[#0695CA]", username: "Allen Deu" },
  { label: "Joined New User", color: "bg-[#0C9938]", username: "Allen Deu" },
];

const Reminder = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="Inter-font font-semibold text-[20px] mb-4">Reminders</h2>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
        {reminders.map((reminder, index) => (
          <div
            key={index}
            className="border-b last:border-none border-gray-300 pb-4 last:pb-0 grid grid-cols-[auto_1fr] gap-4 items-start Source-Sans-Pro-font"
          >
            {/* Close Icon */}
            <button className="text-white bg-[#DEE5E7] rounded-sm p-[2px]">
              <IoMdClose size={18} />
            </button>

            {/* Reminder Content */}
            <div className="space-y-2">
              {/* Badge + Time */}  
              <div className="flex justify-between items-center">
                <span
                  className={`text-white text-xs px-2 py-[3px] rounded-md ${reminder.color}`}
                >
                  {reminder.label}
                </span>
                <div className="flex items-center gap-1 text-[13px] text-[#525252] font-medium">
                  <FiClock size={15} />
                  <span>24 Nov 2025 at 9:30 AM</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[15px] text-[#525252]">
                There are many variations of passages
              </h3>

              {/* Description */}
              <p className="text-[14px] font-semibold text-[#525252e3] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry’s standard dummy
                text ever since the 1500s
              </p>

              {/* Username */}
              <p className="text-red-500 font-semibold text-[15px]">
                {reminder.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminder;
