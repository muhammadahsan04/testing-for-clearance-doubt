// import React, { useState } from "react";
// import Button from "./Button";
// import Input from "./Input";
// import Dropdown from "./Dropdown";

// interface Store {
//   id: string;
//   name: string;
//   image: string;
//   address: string;
//   manager: string;
//   contact: string;
//   hours: string;
//   status: string;
// }

// interface ZoneProps {
//   filteredData: Store[];
//   search: string;
//   setSearch: (value: string) => void;
//   statusFilter: string;
//   setStatusFilter: (value: string) => void;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
// }

// const Zone: React.FC<ZoneProps> = ({
//   filteredData,
//   search,
//   setSearch,
//   statusFilter,
//   setStatusFilter,
//   currentPage,
//   setCurrentPage,
// }) => {
//   return (
//     <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
//       {/* Top Bar */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//         {/* Search & Filter */}
//         <div className="flex flex-row sm:items-center gap-3">
//           <Input
//             placeholder="Search Store, Store ID"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:max-w-xs rounded-full border border-gray-300 px-4 py-2"
//           />
//           <Dropdown
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <Button
//             text="Export"
//             variant="border"
//             className="bg-[#5D6679] text-white w-24 rounded-md"
//           />
//           <Button
//             text="Add Store"
//             className="bg-[#4E4FEB] text-white w-28 rounded-md border-none"
//           />
//         </div>
//       </div>

//       {/* Store Cards */}
//       <div className="space-y-4 grid sm:grid-cols-2 lg:grid-cols-1 sm:space-x-4 md:space-x-3 mx-auto lg:space-x-0 md:grid-cols-2">
//         {filteredData.map((store) => (
//           <div
//             key={store.id}
//             className="flex flex-col lg:flex-row bg-white rounded-xl md:m-2 shadow-sm overflow-hidden border border-gray-200"
//           >
//             {/* Store Image */}
//             <div className="md:w-auto lg:w-78 xl:w-80 h-auto md:h-54 xl:h-auto lg:h-44">
//               <img
//                 src={store.image}
//                 alt={store.name}
//                 className="object-contain sm:object-cover w-full h-full"
//               />
//             </div>

//             {/* Store Info */}
//             <div className="flex-1 p-4 flex flex-col justify-between md:ml-0 lg:ml-3 xl:ml-12">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2 text-sm">
//                   <span
//                     className={`h-3 w-3 rounded-full ${
//                       store.status === "Active" ? "bg-green-500" : "bg-red-500"
//                     }`}
//                   ></span>
//                   <span className="text-[#5D6679]">
//                     Store ID:{" "}
//                     <span className="text-blue-600 font-medium">
//                       {store.id}
//                     </span>
//                   </span>
//                 </div>
//                 <h3 className="text-md md:text-lg lg:text-sm xl:text-[16px] font-medium text-[#5D6679]">
//                   {store.name}
//                 </h3>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   {store.address}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   Manager Name - {store.manager}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   Contact Number - {store.contact}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D]">
//                   Operating Hours - {store.hours}
//                 </p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex lg:flex-col justify-center items-center gap-2 px-4 py-2 sm:py-2 md:p-4">
//               <Button
//                 text="View"
//                 className="!text-[#1366D9] w-24 rounded-md border border-gray-100"
//               />
//               <Button
//                 text="Edit"
//                 className="!text-[#E19133] w-24 rounded-md border border-gray-100"
//               />
//               <Button
//                 text="Delete"
//                 className="!text-[#DC3545] w-24 rounded-md border border-gray-100"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Zone;

//sahi hai ye code filter work kr raha lekin jab user kuch aisa serach kr raha jo exist hi krti wo ye kuch nahi dikha raha
// import React from "react";
// import Button from "./Button";
// import Input from "./Input";
// import Dropdown from "./Dropdown";

// interface Store {
//   id: string;
//   name: string;
//   image: string;
//   address: string;
//   manager: string;
//   contact: string;
//   hours: string;
//   status: string;
// }

// interface ZoneProps {
//   filteredData: Store[];
//   search: string;
//   setSearch: (value: string) => void;
//   statusFilter: string;
//   setStatusFilter: (value: string) => void;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
//   onViewClick?: (store: Store) => void;
//   onEditClick?: (store: Store) => void;
//   onDeleteClick?: (store: Store) => void;
// }

// const Zone: React.FC<ZoneProps> = ({
//   filteredData,
//   search,
//   setSearch,
//   statusFilter,
//   setStatusFilter,
//   currentPage,
//   setCurrentPage,
//   onViewClick,
//   onEditClick,
//   onDeleteClick,
// }) => {
//   return (
//     <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
//       {/* Top Bar */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//         {/* Search & Filter */}
//         <div className="flex flex-row sm:items-center gap-3">
//           <Input
//             placeholder="Search Store, Store ID"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:max-w-xs rounded-full border border-gray-300 px-4 py-2"
//           />
//           <Dropdown
//             options={["All", "Active", "Inactive"]}
//             DropDownName="Status"
//             defaultValue="All"
//             onSelect={(val) => {
//               setStatusFilter(val);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <Button
//             text="Export"
//             variant="border"
//             className="bg-[#5D6679] text-white w-24 rounded-md"
//           />
//           <Button
//             text="Add Store"
//             className="bg-[#4E4FEB] text-white w-28 rounded-md border-none"
//           />
//         </div>
//       </div>

//       {/* Store Cards */}
//       <div className="space-y-4 grid sm:grid-cols-2 lg:grid-cols-1 sm:space-x-4 md:space-x-3 mx-auto lg:space-x-0 md:grid-cols-2">
//         {filteredData.map((store) => (
//           <div
//             key={store.id}
//             className="flex flex-col lg:flex-row bg-white rounded-xl md:m-2 shadow-sm overflow-hidden border border-gray-200"
//           >
//             {/* Store Image */}
//             <div className="md:w-auto lg:w-78 xl:w-80 h-auto md:h-54 xl:h-auto lg:h-44">
//               <img
//                 src={store.image}
//                 alt={store.name}
//                 className="object-contain sm:object-cover w-full h-full"
//               />
//             </div>

//             {/* Store Info */}
//             <div className="flex-1 p-4 flex flex-col justify-between md:ml-0 lg:ml-3 xl:ml-12">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2 text-sm">
//                   <span
//                     className={`h-3 w-3 rounded-full ${
//                       store.status === "Active" ? "bg-green-500" : "bg-red-500"
//                     }`}
//                   ></span>
//                   <span className="text-[#5D6679]">
//                     Store ID:{" "}
//                     <span className="text-blue-600 font-medium">
//                       {store.id}
//                     </span>
//                   </span>
//                 </div>
//                 <h3 className="text-md md:text-lg lg:text-sm xl:text-[16px] font-medium text-[#5D6679]">
//                   {store.name}
//                 </h3>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   {store.address}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   Manager Name - {store.manager}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
//                   Contact Number - {store.contact}
//                 </p>
//                 <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D]">
//                   Operating Hours - {store.hours}
//                 </p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex lg:flex-col justify-center items-center gap-2 px-4 py-2 sm:py-2 md:p-4">
//               <Button
//                 text="View"
//                 className="!text-[#1366D9] w-24 rounded-md border border-gray-100"
//                 onClick={() => onViewClick && onViewClick(store)}
//               />
//               <Button
//                 text="Edit"
//                 className="!text-[#E19133] w-24 rounded-md border border-gray-100"
//                 onClick={() => onEditClick && onEditClick(store)}
//               />
//               <Button
//                 text="Delete"
//                 className="!text-[#DC3545] w-24 rounded-md border border-gray-100"
//                 onClick={() => onDeleteClick && onDeleteClick(store)}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Zone;

import React from "react";
import Button from "./Button";
import Input from "./Input";
import Dropdown from "./Dropdown";

interface Store {
  id: string;
  name: string;
  image: string;
  address: string;
  manager: string;
  contact: string;
  hours: string;
  status: string;
}

interface ZoneProps {
  filteredData: Store[];
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onViewClick?: (store: Store) => void;
  onEditClick?: (store: Store) => void;
  onDeleteClick?: (store: Store) => void;
}

const Zone: React.FC<ZoneProps> = ({
  filteredData,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  onViewClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
      {/* Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Search & Filter */}
        <div className="flex flex-row sm:items-center gap-3">
          <Input
            placeholder="Search Store, Store ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-full sm:max-w-2xl !rounded-full border border-gray-300 px-4 py-2"
          />
          <Dropdown
            options={["All", "Active", "Inactive"]}
            DropDownName="Status"
            defaultValue="All"
            onSelect={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            text="Export"
            variant="border"
            className="bg-[#5D6679] text-white w-24 rounded-md"
          />
          <Button
            text="Add Store"
            className="bg-[#4E4FEB] text-white w-28 rounded-md border-none"
          />
        </div>
      </div>

      {/* Store Cards or No Results Message */}
      {filteredData.length > 0 ? (
        <div className="space-y-4 grid sm:grid-cols-2 lg:grid-cols-1 sm:space-x-4 md:space-x-3 mx-auto lg:space-x-0 md:grid-cols-2">
          {filteredData.map((store) => (
            <div
              key={store.id}
              className="flex flex-col lg:flex-row bg-white rounded-xl md:m-2 shadow-sm overflow-hidden border border-gray-200"
            >
              {/* Store Image */}
              <div className="md:w-auto lg:w-78 xl:w-80 h-auto md:h-54 xl:h-auto lg:h-44">
                <img
                  src={store.image}
                  alt={store.name}
                  className="object-contain sm:object-cover w-full h-full"
                />
              </div>

              {/* Store Info */}
              <div className="flex-1 p-4 flex flex-col justify-between md:ml-0 lg:ml-3 xl:ml-12">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        store.status === "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-[#5D6679]">
                      Store ID:{" "}
                      <span className="text-blue-600 font-medium">
                        {store.id}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-md md:text-lg lg:text-sm xl:text-[16px] font-medium text-[#5D6679]">
                    {store.name}
                  </h3>
                  <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
                    {store.address}
                  </p>
                  <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
                    Manager Name - {store.manager}
                  </p>
                  <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D] m-0">
                    Contact Number - {store.contact}
                  </p>
                  <p className="text-[13px] sm:text-[12px] xl:text-sm text-[#858D9D]">
                    Operating Hours - {store.hours}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col justify-center items-center gap-2 px-4 py-2 sm:py-2 md:p-4">
                <Button
                  text="View"
                  className="!text-[#1366D9] w-24 rounded-md border border-gray-100"
                  onClick={() => onViewClick && onViewClick(store)}
                />
                <Button
                  text="Edit"
                  className="!text-[#E19133] w-24 rounded-md border border-gray-100"
                  onClick={() => onEditClick && onEditClick(store)}
                />
                <Button
                  text="Delete"
                  className="!text-[#DC3545] w-24 rounded-md border border-gray-100"
                  onClick={() => onDeleteClick && onDeleteClick(store)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No stores found
          </h3>
          <p className="text-gray-500 mb-4">
            {search ? (
              <>
                No results found for "
                <span className="font-semibold">{search}</span>"
              </>
            ) : (
              "No stores match the selected filters"
            )}
          </p>
          <Button
            text="Clear Filters"
            className="bg-blue-500 text-white rounded-md"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Zone;
