import React from "react";
import Button from "./Button";
import Input from "./Input";
import Dropdown from "./Dropdown";

interface AddZoneProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  roleName: string;
  setRoleName: (val: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  // children?: React.ReactNode; // Drag and Drop area (DropImage)
}

const AddZoneModal: React.FC<AddZoneProps> = ({
  showModal,
  setShowModal,
  isEditing,
  setIsEditing,
  roleName,
  setRoleName,
  uploadedFile,
  setUploadedFile,
  // children,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={() => {
        setShowModal(false);
        if (isEditing) setIsEditing(false);
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scaleIn bg-white w-full max-w-[90vw] overflow-hidden md:h-auto sm:max-w-md md:max-w-3xl lg:max-w-4xl h-[70vh] overflow-y-auto rounded-[7px] p-4 sm:p-6 shadow-lg relative"
        // onClick={(e) => e.stopPropagation()}
      >
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[20px] sm:text-[24px] m-0">
          Add Zone
        </p>

        <form
          // onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 text-[15px] Poppins-font font-medium w-full"
        >
          {/* Left Side */}
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Zone</label>
              <Input
                placeholder="Zone name"
                // value={zone}
                // onChange={(e) => setZone(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Address</label>
              <Input
                placeholder="Street, City, State, Zip Code, Country"
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Zone Representative</label>
              <Input
                placeholder="John"
                // value={consumerPerson}
                // onChange={(e) => setConsumerPerson(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Location</label>
              <Input
                placeholder="New York Office"
                // value={location}
                // onChange={(e) => setLocation(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Phone No</label>
              <Input
                placeholder="+56 362738233"
                // value={phone}
                // onChange={(e) => setPhone(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Store</label>
              <Dropdown
                options={["Store A", "Store B", "Store C"]}
                className="outline-none focus:outline-none"
                // DropDownName="Store name"
                defaultValue="Store name"
                // onChange={(e) => setZone(e.target.value)}
              />
            </div>

            <div className="flex justify-end font-medium pt-2">
              <Button
                text="Save"
                className="px-6 !bg-[#056BB7] text-white !border-none"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddZoneModal;
