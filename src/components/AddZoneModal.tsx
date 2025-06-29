import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Dropdown from "./Dropdown";
import UserDropDown from "./UserDropDown";
import StoreDropDown from "./StoreDropDown";
import axios from "axios";
import { toast } from "react-toastify";

interface ZoneData {
  id: string;
  name: string;
  status: string;
  _id: string;
  zoneId?: string;
}

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

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);


  // Selected names for display purposes
  const [selectedRepNames, setSelectedRepNames] = useState<string[]>([]);
  const [selectedStoreNames, setSelectedStoreNames] = useState<string[]>([]);


  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    phoneNumber: "",
    zoneRepresentative: [] as string[],
    stores: [] as string[],
    status: "active",
  });

  if (!showModal) return null;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Zone name is required");
      return;
    }

    if (!formData.location) {
      toast.error("Location is required");
      return;
    }

    if (formData.zoneRepresentative.length === 0) {
      toast.error("At least one zone representative is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/createZone`,
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowModal(false)
        toast.success("Zone created successfully!");
        // Refresh the zones list
        const newZone = {
          id: response.data.data._id.substring(0, 5),
          _id: response.data.data._id,
          zoneId: response.data.data.zoneId,
          name: response.data.data.name,
          status:
            response.data.data.status.charAt(0).toUpperCase() +
            response.data.data.status.slice(1),
        };
        setZoneData([...zoneData, newZone]);

        // Reset form
        setFormData({
          name: "",
          location: "",
          address: "",
          phoneNumber: "",
          zoneRepresentative: [],
          stores: [],
          status: "active",
        });
        setSelectedRepNames([]);
        setSelectedStoreNames([]);
      } else {
        toast.error(response.data.message || "Failed to create zone");
      }
    } catch (error) {
      console.error("Error creating zone:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to create zone");
        }
      } else {
        toast.error("An unexpected error occurred while creating zone");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle user selection for zone representative
  const handleUserSelect = (userId: string, userName: string) => {
    // Check if the user is already selected
    if (!formData.zoneRepresentative.includes(userId)) {
      setFormData((prev) => ({
        ...prev,
        zoneRepresentative: [...prev.zoneRepresentative, userId],
      }));
      setSelectedRepNames((prev) => [...prev, userName]);
    } else {
      toast.info("This representative is already selected");
    }
  };

  // Remove a selected representative
  const removeRepresentative = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      zoneRepresentative: prev.zoneRepresentative.filter((_, i) => i !== index),
    }));
    setSelectedRepNames((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle store selection
  const handleStoreSelect = (storeId: string, storeName: string) => {
    // Check if the store is already selected
    if (!formData.stores.includes(storeId)) {
      setFormData((prev) => ({
        ...prev,
        stores: [...prev.stores, storeId],
      }));
      setSelectedStoreNames((prev) => [...prev, storeName]);
    } else {
      toast.info("This store is already selected");
    }
  };

  // Remove a selected store
  const removeStore = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stores: prev.stores.filter((_, i) => i !== index),
    }));
    setSelectedStoreNames((prev) => prev.filter((_, i) => i !== index));
  };

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

        <form className="" onSubmit={handleSubmit}>
          <div className="">
            {/* Top Side */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 lg:gap-16 xl:gap-32 text-[15px] Poppins-font font-medium">
              {/* Left Side */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1">
                    Zone Name
                  </label>
                  <Input
                    name="name"
                    placeholder="Zone Name"
                    className="outline-none focus:outline-none w-full"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>


                <div className="flex flex-col">
                  <label htmlFor="address" className="mb-1">
                    Address
                  </label>
                  <Input
                    name="address"
                    placeholder="Address"
                    className="outline-none focus:outline-none w-full"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>


                <div className="flex flex-col">
                  <label htmlFor="zoneRepresentative" className="mb-1">
                    Zone Representative
                  </label>
                  <UserDropDown onSelect={handleUserSelect} />

                  {/* Display selected representatives */}
                  {selectedRepNames.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">
                        Selected Representatives:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRepNames.map((name, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              onClick={() => removeRepresentative(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


                <div className="flex flex-col">
                  <label className="mb-1">Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                </div>


              </div>

              {/* Right Side */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="location" className="mb-1">
                    Location
                  </label>
                  <Input
                    name="location"
                    placeholder="Location"
                    className="outline-none focus:outline-none w-full"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="mb-1">
                    Phone Number
                  </label>
                  <Input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className="outline-none focus:outline-none w-full"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="stores" className="mb-1">
                    Stores
                  </label>
                  <StoreDropDown onSelect={handleStoreSelect} />

                  {/* Display selected stores */}
                  {selectedStoreNames.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">
                        Selected Stores:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStoreNames.map((name, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              className="ml-2 text-green-600 hover:text-green-800"
                              onClick={() => removeStore(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 Poppins-font font-medium mt-8">
                  {/* Conditionally render Save button based on permissions */}
                  <Button
                    text={isSubmitting ? "Saving..." : "Save"}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 !bg-[#056BB7] border-none text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddZoneModal;
