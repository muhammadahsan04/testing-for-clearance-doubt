import type React from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import galleryIcon from "../../../assets/galleryIcon.svg";

const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000";

interface DropImageProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  className?: string;
  existingImageUrl?: string;
}

export const DropImage: React.FC<DropImageProps> = ({
  uploadedFile,
  setUploadedFile,
  className,
  existingImageUrl = "",
}) => {
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB limit");
      return;
    }
    setUploadedFile(file);
  };

  // Create a reference to the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file input click
  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`border-3 border-dashed border-[#1A8CE0] rounded-lg p-2 text-center select-none ${className}`}
    >
      {/* Show preview of uploaded file */}
      {uploadedFile && (
        <div className="">
          <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
          <img
            src={URL.createObjectURL(uploadedFile) || "/placeholder.svg"}
            alt="New image preview"
            className="max-h-32 mx-auto rounded"
          />
          <p className="text-xs text-green-600 mt-2">
            Selected: {uploadedFile.name}
          </p>
          <p className="text-xs text-gray-500">
            Size: {(uploadedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Show existing image if available and no new upload */}
      {!uploadedFile && existingImageUrl && existingImageUrl.length > 0 && (
        <div className="">
          <p className="text-sm text-gray-600 mb-2">Current Image:</p>
          <img
            src={existingImageUrl || "/placeholder.svg"}
            alt="Current role image"
            className="max-h-32 mx-auto rounded"
          />
          <button
            type="button"
            onClick={openFileExplorer}
            className="text-blue-500 cursor-pointer underline bg-transparent border-none mt-3"
          >
            browse for update image
          </button>
        </div>
      )}

      {/* Show drag & drop interface when no image is selected */}
      {!uploadedFile &&
        (!existingImageUrl || existingImageUrl.length === 0) && (
          <div className="flex flex-col items-center justify-center gap-2 py-3">
            <img src={galleryIcon} alt="Upload Icon" className="w-12 h-12" />
            <p className="text-gray-700 text-sm mb-1">
              Drag & drop a File here
            </p>
            <p
              className="text-blue-500 text-sm cursor-pointer"
              onClick={openFileExplorer}
            ></p>
            <button
              type="button"
              onClick={openFileExplorer}
              className="bg-[#1A8CE0] text-white py-1 px-6 rounded-md text-sm"
            >
              or browse
            </button>
          </div>
        )}

      {/* Always have the hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export default function SystemSettingRenderPage() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [currency, setCurrency] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingLogoUrl, setExistingLogoUrl] = useState("");
  const [systemSettingData, setSystemSettingData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Authentication token helper
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Fetch existing system settings on component mount
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        setIsDataLoading(true);
        const token = getAuthToken();
        if (!token) {
          toast.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/abid-jewelry-ms/getSystemSetting`,
          {
            headers: {
              "x-access-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success && response.data.data.length > 0) {
          const data = response.data.data[0];
          setSystemSettingData(response.data);

          // Populate form fields with existing data
          setCompanyName(data.companyName || "");
          setPhoneNumber(data.phoneNumber || "");
          setAddress(data.address || "");
          setEmail(data.email || "");
          setCurrency(data.companyCurrency || "");

          // Handle social media links array
          const socialLinks = data.socialMediaLinks || [];
          setFacebook(socialLinks[0] || "");
          setInstagram(socialLinks[1] || "");
          setTwitter(socialLinks[2] || "");
          setLinkedin(socialLinks[3] || "");
          setWhatsapp(socialLinks[4] || "");

          // Set existing logo URL
          if (data.companyLogo) {
            setExistingLogoUrl(`${API_URL}${data.companyLogo}`);
          }
        } else {
          setSystemSettingData({ data: [] });
        }
      } catch (error: any) {
        console.error("Error fetching system settings:", error);
        setSystemSettingData({ data: [] });
        if (error.response?.status !== 404) {
          toast.error("Failed to fetch system settings");
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchSystemSettings();
  }, []);


  if (isDataLoading) {
    return (
      <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
        <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-sm">
        <h1 className="text-[#056BB7] text-xl font-semibold mb-8">
          System Setting
        </h1>

        <div className="border border-gray-300 rounded-md">
          <div className="">
            <div className="flex sm:gap-0 gap-2 flex-col xl:gap-0 lg:gap-8 sm:flex-row justify-between items-start sm:items-center p-4">
              <div className="mb-4 md:mb-0">
                <h2 className="font-semibold Source-Sans-Pro-font xl:text-lg">
                  Company Logo
                </h2>
                <p className="text-sm Source-Sans-Pro-font">
                  Upload your company logo and then choose where you want to
                  display.
                </p>
              </div>
              <div className="w-full sm:w-1/2 flex justify-center items-center">
                <DropImage
                  uploadedFile={companyLogo}
                  setUploadedFile={setCompanyLogo}
                  existingImageUrl={existingLogoUrl}
                  className="w-full md:w-sm"
                />
              </div>
            </div>

            <div className="flex sm:gap-0 gap-4 sm:flex-row flex-col justify-between items-start sm:items-center border-t border-b py-6 px-4 border-gray-300">
              <h2 className="font-semibold Source-Sans-Pro-font xl:text-lg">
                Company Name
              </h2>
              <div className="w-full sm:w-1/2">
                <Input
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>

            <div className="flex sm:gap-0 gap-4 sm:flex-row flex-col justify-between items-start sm:items-center border-b py-6 px-4 border-gray-300 ">
              <h2 className="font-semibold Source-Sans-Pro-font xl:text-lg">
                Company Contact Information
              </h2>

              <div className="w-full sm:w-1/2">
                <div className="mb-2">
                  <h2 className="font-medium mb-1 Poppins-font text-sm">
                    Phone Number
                  </h2>
                  <Input
                    placeholder="+1 (123) 456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
                <div className="mb-2">
                  <h2 className="font-medium mb-1 Poppins-font text-sm">
                    Address
                  </h2>
                  <Input
                    placeholder="123 5th Avenue, New York, NY 10003"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
                <div className="">
                  <h2 className="font-medium mb-1 Poppins-font text-sm">
                    Email
                  </h2>
                  <Input
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:gap-0 gap-4 sm:flex-row flex-col justify-between items-start sm:items-center border-b py-6 px-4 border-gray-300">
            <h2 className="font-semibold Source-Sans-Pro-font xl:text-lg">
              Company Social Media Links
            </h2>
            <div className="w-full sm:w-1/2">
              <div className="mb-2">
                <h3 className="font-medium mb-1 Poppins-font text-sm">
                  Facebook
                </h3>
                <Input
                  placeholder="https://facebook.com/yourcompanyname"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="mb-2">
                <h3 className="font-medium mb-1 Poppins-font text-sm">
                  Instagram
                </h3>
                <Input
                  placeholder="https://instagram.com/yourcompanyname"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="mb-2">
                <h3 className="font-medium mb-1 Poppins-font text-sm">
                  Twitter / X handle
                </h3>
                <Input
                  placeholder="@yourhandle"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="mb-2">
                <h3 className="font-medium mb-1 Poppins-font text-sm">
                  LinkedIn URL
                </h3>
                <Input
                  placeholder="https://linkedin.com/company/yourcompanyname"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div>
                <h3 className="font-medium mb-1 Poppins-font text-sm">
                  WhatsApp Number
                </h3>
                <Input
                  placeholder="+1 (123) 456-7890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>
          </div>

          <div className="py-6 px-4 flex sm:gap-0 gap-4 sm:flex-row flex-col justify-between items-start sm:items-center">
            <h2 className="font-semibold Source-Sans-Pro-font xl:text-lg">
              Company Deals in
            </h2>
            <div className="w-full sm:w-1/2">
              <label htmlFor="" className="font-medium Poppins-font text-sm">
                Currency
              </label>
              <Input
                placeholder="Enter currency (e.g., USD, EUR, GBP)"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mt-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            text="Cancel"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-5 py-1 rounded-md hover:bg-gray-100 border-none shadow-[inset_0_0_4px_#00000026]"
          />
          <Button
            text={
              isLoading
                ? "Saving..."
                : systemSettingData?.data?.length > 0
                ? "Save Changes"
                : "Create"
            }
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 !bg-[#056BB7] text-white !border-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
