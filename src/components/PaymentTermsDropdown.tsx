// import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown } from "react-icons/fa";
// import plusIcon from "../assets/plus.svg"; // Adjust path as needed
// import { useNavigate } from "react-router-dom";

// type Props = {
//   defaultValue?: string;
//   options: string[];
//   className?: string;
//   onPlusClick?: () => void; // Add this prop
// };

// const PaymentTermsDropdown: React.FC<Props> = ({
//   defaultValue = "Payment term",
//   options,
//   className = "",
//   onPlusClick, // Use this prop
// }) => {
//   const [selected, setSelected] = useState(defaultValue);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (value: string) => {
//     setSelected(value);
//     setOpen(false);
//   };
//   const navigate = useNavigate();
//   const handlePlusClick = (e: React.MouseEvent) => {
//     console.log("Plus icon clicked - before stopPropagation");
//     e.stopPropagation();
//     console.log("Plus icon clicked - after stopPropagation");

//     if (onPlusClick) {
//       console.log("Using provided onPlusClick callback");
//       onPlusClick(); // Call the provided callback
//     } else {
//       console.log("Using internal navigation");
//       navigate("/dashboard/suppliers/add-template");
//     }
//     console.log("Navigation should have happened by now");
//   };
//   return (
//     <div className="flex flex-col w-full bg-amber-600" ref={dropdownRef}>
//       <div className="flex items-center gap-1 mb-1">
//         <label className="text-sm font-medium text-gray-800">
//           Payment terms
//         </label>
//         <img
//           src={plusIcon}
//           alt="Add"
//           className="w-4 h-4 cursor-pointer"
//           onClick={handlePlusClick}
//         />
//       </div>

//       <div
//         className={`relative w-full ${className}`}
//         onClick={() => setOpen(!open)}
//       >
//         <div className="flex items-start justify-between border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-500 bg-white cursor-pointer min-h-20">
//           <span>{selected}</span>
//           <FaChevronDown className="text-xs" />
//         </div>

//         {open && (
//           <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 h-auto overflow-y-auto">
//             {options.map((option, index) => (
//               <li
//                 key={index}
//                 onClick={() => handleSelect(option)}
//                 className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//               >
//                 {option}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTermsDropdown;

// import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown } from "react-icons/fa";
// import plusIcon from "../assets/plus.svg"; // Adjust path as needed
// import { useNavigate } from "react-router-dom";

// type Props = {
//   defaultValue?: string;
//   options: string[];
//   className?: string;
//   onPlusClick?: () => void; // Add this prop
// };

// const PaymentTermsDropdown: React.FC<Props> = ({
//   defaultValue = "Payment term",
//   options,
//   className = "",
//   onPlusClick, // Use this prop
// }) => {
//   const [selected, setSelected] = useState(defaultValue);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (value: string) => {
//     setSelected(value);
//     setOpen(false);
//   };
//   const navigate = useNavigate();
//   const handlePlusClick = (e: React.MouseEvent) => {
//     console.log("Plus icon clicked - before stopPropagation");
//     e.stopPropagation();
//     console.log("Plus icon clicked - after stopPropagation");

//     if (onPlusClick) {
//       console.log("Using provided onPlusClick callback");
//       onPlusClick(); // Call the provided callback
//     } else {
//       console.log("Using internal navigation");
//       navigate("/dashboard/suppliers/add-template");
//     }
//     console.log("Navigation should have happened by now");
//   };
//   return (
//     <div className="flex flex-col w-full bg-amber-600" ref={dropdownRef} onClick={()=> console.log('fdsfsdfdsf')
//     }>
//       <div className="flex items-center gap-1 mb-1 z-30">
//         <label className="text-sm font-medium text-gray-800">
//           Payment terms
//         </label>
//         <img
//           src={plusIcon}
//           alt="Add"
//           className="w-4 h-4 cursor-pointer"
//           onClick={handlePlusClick}
//         />
//       </div>

//       <div
//         className={`relative w-full ${className}`}
//         onClick={() => setOpen(!open)}
//       >
//         <div className="flex items-start justify-between border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-500 bg-white cursor-pointer min-h-20">
//           <span>{selected}</span>
//           <FaChevronDown className="text-xs" />
//         </div>

//         {open && (
//           <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 h-auto overflow-y-auto">
//             {options.map((option, index) => (
//               <li
//                 key={index}
//                 onClick={() => handleSelect(option)}
//                 className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//               >
//                 {option}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTermsDropdown;

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import plusIcon from "../assets/plus.svg"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

type Props = {
  defaultValue?: string;
  options: string[];
  className?: string;
  onPlusClick?: () => void;
};

const PaymentTermsDropdown: React.FC<Props> = ({
  defaultValue = "Payment term",
  options,
  className = "",
  onPlusClick,
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
  };

  const navigate = useNavigate();

  const handlePlusClick = (e: React.MouseEvent) => {
    // console.log("Plus icon clicked - before stopPropagation");
    e.stopPropagation();
    // console.log("Plus icon clicked - after stopPropagation");

    if (onPlusClick) {
      //   console.log("Using provided onPlusClick callback");
      onPlusClick();
    } else {
      //   console.log("Using internal navigation");
      navigate("/dashboard/suppliers/add-template");
    }
    // console.log("Navigation should have happened by now");
  };

  return (
    <div className="flex flex-col w-full" ref={dropdownRef}>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-sm font-medium text-gray-800">
          Payment terms
        </label>
        {/* Replace the img with a button */}
        <button
          type="button"
          onClick={handlePlusClick}
          className="w-4 h-4 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0"
        >
          <img src={plusIcon} alt="Add" className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`relative w-full ${className}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start justify-between border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-500 bg-white cursor-pointer min-h-20">
          <span>{selected}</span>
          <FaChevronDown className="text-xs" />
        </div>

        {open && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 h-auto overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaymentTermsDropdown;
