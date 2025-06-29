import React, { useState } from "react";
import UploadPicture from "../../../components/UploadPicture";
import user from "../../../assets/tableuser.png";
import second from "../../../assets/seconduser.png";
import third from "../../../assets/thirduser.png";
import fourth from "../../../assets/fourthuser.png";
import fifth from "../../../assets/fifth.png";
import GenericTable from "../../../components/UserTable";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

const CardGenerator: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false); // To track if it's Edit mode
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  // const [search, setSearch] = useState("");

  const columns: Column[] = [
    { header: "User ID", accessor: "id" },
    { header: "Name", accessor: "name", type: "image" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Last Login", accessor: "date" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  const userData = [
    {
      id: "Manag-23",
      name: "Matthew Wilson",
      userImage: user,
      role: "Manager",
      status: "Active",
      date: "11-06-2025",
    },
    {
      id: "Admin-43",
      name: "Emily Thompson",
      userImage: second,
      role: "Admin",
      status: "Inactive",
      date: "19-03-2025",
    },
    {
      id: "Saleper-27",
      name: "Nicholas Young",
      userImage: third,
      role: "Sale Person",
      status: "Active",
      date: "01-01-2025",
    },
    {
      id: "Deliv-38",
      name: "Sarah Martinez",
      userImage: fourth,
      role: "Delivery Person",
      status: "Inactive",
      date: "12-04-2025",
    },
    {
      id: "Entry-12",
      name: "Olivia Bennett",
      userImage: fifth,
      role: "Entry Person",
      status: "Active",
      date: "08-02-2025",
    },
    {
      id: "Entry-13",
      name: "Jason Brown",
      userImage: fifth,
      role: "Entry Person",
      status: "Inactive",
      date: "07-02-2025",
    },
    {
      id: "Entry-14",
      name: "Lily Adams",
      userImage: fifth,
      role: "Entry Person",
      status: "Active",
      date: "06-02-2025",
    },
    {
      id: "Deliv-39",
      name: "Michael Johnson",
      userImage: fourth,
      role: "Delivery Person",
      status: "Inactive",
      date: "05-02-2025",
    },
    {
      id: "Saleper-28",
      name: "Amanda Clark",
      userImage: third,
      role: "Sale Person",
      status: "Active",
      date: "04-02-2025",
    },
    {
      id: "Admin-44",
      name: "Tom Hanks",
      userImage: second,
      role: "Admin",
      status: "Active",
      date: "03-02-2025",
    },
    {
      id: "Manag-24",
      name: "Diana Prince",
      userImage: user,
      role: "Manager",
      status: "Inactive",
      date: "02-02-2025",
    },
    {
      id: "Entry-15",
      name: "Chloe Grace",
      userImage: fifth,
      role: "Entry Person",
      status: "Inactive",
      date: "01-02-2025",
    },
  ];
  return (
    <div className="mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 space-y-6 lg:w-[100%] xl:w-full w-full overflow-x-hidden">
      <h2 className="Inter-font font-semibold text-[20px] mb-2">
        Card Generator
      </h2>

      <GenericTable
        columns={columns}
        data={userData}
        // tableTitle="Users"
        onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
        onDelete={(row) => {
          setSelectedUser(row); // ✅ Use the selected user
          setShowDeleteModal(true); // ✅ Open the delete modal
        }}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />
      {/* <Outlet /> */}

      {/* Modal */}
      {showModal && (
        <UploadPicture
          showModal={showModal}
          setShowModal={setShowModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          roleName={roleName}
          setRoleName={setRoleName}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      )}
    </div>
  );
};

export default CardGenerator;
