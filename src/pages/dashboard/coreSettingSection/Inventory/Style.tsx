import React, { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import ZoneTable from "../../../../components/ZoneTable";
import { useNavigate } from "react-router-dom";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

const Style: React.FC = () => {
  const [zone, setZone] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [consumerPerson, setConsumerPerson] = useState("");
  const [store, setStore] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Your logic here
    console.log({ zone, location, address, phone, consumerPerson, store });
  };

  const columns: Column[] = [
    { header: "S.no", accessor: "id" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const zoneData = [
    {
      id: "01",
      name: "Chain",
      status: "Active",
    },
    {
      id: "02",
      name: "Bangles",
      status: "Active",
    },
    {
      id: "03",
      name: "Rings",
      status: "Active",
    },
    {
      id: "04",
      name: "Locket",
      status: "Active",
    },
  ];
  return (
    <div className="w-full mx-auto px-8 py-6 bg-[#F5F6FA]">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/core-settings/product-category", {
              replace: true,
            })
          }
          className="cursor-pointer"
        >
          Inventory
        </span>{" "}
        / <span className="text-black">Style</span>
      </h2>
      <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-10 py-6 mb-10">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
          Style
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-8 text-[15px] Poppins-font font-medium w-full grid-cols-1 md:grid-cols-2"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-black">Fields</label>
            <Input
              placeholder="Style Field Name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="outline-none focus:outline-none"
            />
          </div>

          {/* Make sure this div doesn't force height */}
          <div className="flex justify-end items-end font-medium gap-4">
            <Button
              text="Save"
              className="px-6 !bg-[#056BB7] border-none text-white"
            />
          </div>
        </form>
      </div>
      {/* <GenericTable
        tableDataAlignment="zone"
        columns={columns}
        data={zoneData}
        tableTitle="Category"
        onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
        onDelete={(row) => {
          setSelectedUser(row); // ✅ Use the selected user
          setShowDeleteModal(true); // ✅ Open the delete modal
        }}
      /> */}
      <ZoneTable
        tableDataAlignment="zone"
        columns={columns}
        data={zoneData}
        enableRowModal={false}
        tableTitle="Style"
        onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
        onDelete={(row) => {
          setSelectedUser(row); // ✅ Use the selected user
          setShowDeleteModal(true); // ✅ Open the delete modal
        }}
      />
    </div>
  );
};

export default Style;
