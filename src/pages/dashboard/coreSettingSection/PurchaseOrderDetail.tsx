import React from "react";
import { FaDownload } from "react-icons/fa";
import { IoIosPrint } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import HorizontalLinearAlternativeLabelStepper from "../../../components/HorizontalLinearAlternativeLabelStepper";
import Button from "../../../components/Button";

const PurchaseOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6 bg-[#F5F6FA]">
      <h2 className="Source-Sans-Pro-font font-semibold text-[#5D6679] text-[20px] mb-2">
        <span
          onClick={() =>
            navigate("/dashboard/core-settings/add-item", {
              replace: true,
            })
          }
          className="cursor-pointer"
        >
          Inventory
        </span>{" "}
        / <span className="text-black">Category</span>
      </h2>
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0873CD] Source-Sans-Pro-font">
            Purchase Order Detail
          </h2>
          {/* <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-sm px-3 py-3 h-fit leading-none rounded-md Inter-font text-white">
            
            <IoIosPrint className="ml-1" color="white" />
          </button> */}

          <Button
            className="select-none bg-gray-700 hover:bg-gray-600"
            variant="border"
            fontFamily="Inter-font"
            text="Print Info"
            icon={<IoIosPrint color="white"/>}
            onClick={() => alert("Logout Button Clicked")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-28 lg:gap-16 text-[14px] gap-8 md:gap-20 Poppins-font xl:text-[15px] lg:text-[14px]">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium">Supplier Company Name:</p>
              <p className="text-[#5D6679] text-right">Royal Gems</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Catagory:</p>
              <p className="text-[#5D6679]">Chain</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Sub Category:</p>
              <p className="text-[#5D6679]">Man</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Style:</p>
              <p className="text-[#5D6679]">Cuban</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Gold Category</p>
              <p className="text-[#5D6679]">10K</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Diamond Weight</p>
              <p className="text-[#5D6679]">4.5 CWT</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Gold Weight</p>
              <p className="text-[#5D6679]">150 gm</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Length</p>
              <p className="text-[#5D6679]">18"</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">MM</p>
              <p className="text-[#5D6679]">8mm</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Size</p>
              <p className="text-[#5D6679]">7</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium">DateDate of Purchase</p>
              <p className="text-right">23-Mar-2025</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Expected Delivery Date</p>
              <p className="text-right">25-Mar-2025</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Quantity:</p>
              <p>3</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Price Per Unit</p>
              <p>$800</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Cost</p>
              <p>$2,400</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Invoice or Reference File</p>
              <FaDownload className="text-gray-700 cursor-pointer" />
            </div>

            <HorizontalLinearAlternativeLabelStepper />

            <div className="mt-6 flex justify-end items-center">
              <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-md">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
