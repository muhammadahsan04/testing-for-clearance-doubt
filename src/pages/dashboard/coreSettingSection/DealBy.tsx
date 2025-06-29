import React, { useState } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { RiEditLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import GenericTable from "../../../components/UserTable";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}
const columns: Column[] = [
  { header: "S.no", accessor: "id" },
  { header: "Rate", accessor: "name", type: "image" },
  { header: "Actions", accessor: "actions", type: "actions" },
];

const byWeightData = [
  {
    id: "01",
    name: "Gold",
  },
  {
    id: "02",
    name: "Silver",
  },
  {
    id: "03",
    name: "Diamond",
  },
];
const byPieceData = [
  {
    id: "03",
    name: "Diamond",
  },
  {
    id: "01",
    name: "Gold",
  },
  {
    id: "02",
    name: "Silver",
  },
];

const DealBy = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-scree w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <h2 className="Inter-font font-semibold text-[20px] mb-4">Deal By</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Weight */}
        <div className="bg-white rounded-2xl  shadow">
          <div className="p-4">
            <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[20px] mb-2">
              By Weight
            </p>
            <div className="flex flex-col text-[15px] Poppins-font font-medium mt-3">
              <label className="text-sm font-medium">Material</label>
              <Input placeholder="eg: Gold" className="mt-1 mb-4 w-full" />
            </div>
            <div className="flex justify-end gap-2 mb-4 mt-2 Poppins-font font-medium">
              <Button text="Back" className="bg-[#F4F4F5] border-none px-6" />
              <Button
                text="Save"
                className="text-white bg-[#056BB7] border-none px-6"
              />
            </div>
            <hr className="mb-4 border-gray-300" />
          </div>

          <GenericTable
            tableDataAlignment="zone"
            columns={columns}
            data={byWeightData}
            // tableTitle="Zones"
            dealBy={true}
            enableRowModal={false} // ✅ disables the default modal
            // onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
            onDelete={(row) => {
              // setSelectedUser(row); // ✅ Use the selected user
              setShowDeleteModal(true); // ✅ Open the delete modal
            }}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        </div>

        {/* By Piece */}
        <div className="bg-white rounded-2xl shadow">
          <div className="p-4">
            <h3 className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[20px] mb-2">
              By Piece
            </h3>
            <div className="flex flex-col text-[15px] Poppins-font font-medium mt-3">
              <label className="text-sm font-medium">Material</label>
              <Input placeholder="eg: Diamond" className="mt-1 mb-4 w-full" />
            </div>
            <div className="flex justify-end mb-4 gap-2 mt-2 Poppins-font font-medium">
              <Button text="Back" className="bg-[#F4F4F5] border-none px-6" />
              <Button
                text="Save"
                className="text-white bg-[#056BB7] border-none px-6"
              />
            </div>
            <hr className="mb-4 border-gray-300" />
          </div>

          <GenericTable
            tableDataAlignment="zone"
            columns={columns}
            data={byPieceData}
            dealBy={true}
            enableRowModal={false} // ✅ disables the default modal
            // tableTitle="Zones"
            // onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
            onDelete={(row) => {
              // setSelectedUser(row); // ✅ Use the selected user
              setShowDeleteModal(true); // ✅ Open the delete modal
            }}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        </div>
      </div>
    </div>
  );
};

export default DealBy;
