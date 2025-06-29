import { Column } from "../../../components/CommunicationTable"; // Import the Column type
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Dropdown from "../../../components/Dropdown";
import { useState } from "react";
import braclet from "../../../assets/bracelet.png";
import CommunicationTable from "../../../components/CommunicationTable";
interface CommunicationInterface {
  no: number;
  date: string;
  group: string;
  subject: string;
  msg: string;
  send: string;
  userImage: any;
}

const CommunicationRenderPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const charLimit = 165;
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const CommunicationData: CommunicationInterface[] = [
    {
      no: 1,
      date: "10-Mar-2025",
      group: "Customer",
      subject: "New Arrivals",
      msg: "1100",
      send: "3100",
      userImage: braclet,
    },
    {
      no: 2,
      date: "05-Mar-2025",
      group: "Manager",
      subject: "Sales & Promotions",
      msg: "100",
      send: "500",
      userImage: braclet,
    },
    {
      no: 3,
      date: "15-Mar-2025",
      group: "Shop Person",
      subject: "Order & Delivery Updates",
      msg: "700",
      send: "800",
      userImage: braclet,
    },
    // Aur bhi rows add kar sakte ho agar chaho
  ];

  // In the columns array, modify the "Subject" column to include image rendering

  // Then define your columns with the proper type
  const columns: Column[] = [
    { header: "No", accessor: "no" },
    { header: "Date", accessor: "date" },
    { header: "Group", accessor: "group" },
    { header: "Subject", accessor: "subject", type: "subject-with-image" },
    { header: "Message", accessor: "msg" },
    { header: "Send", accessor: "send" },
    { header: "Actions", accessor: "actions" },
  ];

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= charLimit) {
      setMessage(e.target.value);
    }
  };
  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="bg-white rounded-lg shadow-md px-4 md:px-10 py-6">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[24px] m-0">
          Communication
        </p>

        <form
          className="mt-6 text-[15px] Poppins-font font-medium"
          onSubmit={(e) => {
            e.preventDefault(); // ✅ Prevents reload
            console.log("Form submitted"); // Add your save logic here
          }}
        >
          {/* Left Side */}
          <div className="space-y-4 w-full">
            <div className="flex gap-2 flex-col">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm border px-3 py-2 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    className="accent-blue-600"
                  />
                  Send Email
                </label>
                <label className="flex items-center gap-2 text-sm border px-2 py-2 pr-8 border-gray-200 rounded-md">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    className="accent-blue-600"
                  />
                  Message
                </label>
              </div>
            </div>

            {/* Second */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-8 xl:gap-12">
              <div className="flex flex-col">
                <label htmlFor="" className="mb-1">
                  Group
                </label>
                <Input
                  placeholder="First Name"
                  className="outline-none focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="" className="mb-1">
                  Subject
                </label>
                <Dropdown
                  defaultValue="Subject"
                  options={["Men", "Women", "Child"]}
                  className="w-full"
                />
              </div>
            </div>
            {/* Message Box with Character Counter */}
            <div className="flex flex-col mb-5">
              <label htmlFor="" className="mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Message"
                rows={3}
                className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
              ></textarea>
              <div className="flex justify-end text-[#2C8CD4] mt-0.5">
                {message.length}/{charLimit}
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-4 Poppins-font font-medium">
          <Button
            text="Send"
            className="px-6 !bg-[#056BB7] border-none text-white"
          />
        </div>
      </div>

      <CommunicationTable
        columns={columns}
        data={CommunicationData}
        tableTitle="January"
        onEdit={(row) => setSelectedUser(row)} // ✅ This opens the modal
        onDelete={(row) => {
          setSelectedUser(row); // ✅ Use the selected user
          setShowDeleteModal(true); // ✅ Open the delete modal
        }}
      />
    </div>
  );
};

export default CommunicationRenderPage;
