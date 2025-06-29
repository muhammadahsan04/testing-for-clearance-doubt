import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditLine } from "react-icons/ri";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { LuEye } from "react-icons/lu";



const InvoiceDetailModal: React.FC<InvoiceDetailProps> = ({
  isOpen,
  onClose,
  eye,
  enableRowModal = true,
  onRowClick,
  className,
  columns,
  data,
  tableTitle,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 5,
  searchable = true,
  filterByStatus = true,
  onEdit,
  onDelete,
  tableDataAlignment = "start", // default
  dealBy,
  invoiceData,
  loading = false,
  loader,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null); // for modal
  const [deleteZone, setDeleteZone] = useState<any>(null); // for modal
  // const [showZoneDetail, setShowZoneDetail] = useState(null); // for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState(""); // ✅ Local search state
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Status filter state

  // To these two state variables edit user
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  // Update the calculateTotals function to use real data from invoiceData
 // Update the calculateTotals function to properly calculate from items
const calculateTotals = () => {
  // Calculate subtotal from the sum of all item total costs
  const subtotal = data.reduce((sum, item) => sum + (item.totalPriceOfCostItems || 0), 0);
  
  // Calculate 10% tax on subtotal
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  
  // Total is subtotal + tax
  const total = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
};


  const { subtotal, tax, total } = calculateTotals();

  

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  // console.log("DATA", data);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
        onClick={onClose}
      >
        <div
          className="animate-scaleIn bg-white rounded-2xl shadow-xl p-6 w-4xl Inter-font"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            loader || <div>Loading...</div>
          ) : (
            // Your existing modal content with data
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-[#056BB7]">
                  Invoice
                </h2>
                <Button
                  text="Print"
                  className="bg-[#056BB7] text-white font-medium h-8 px-6 border-none"
                />
              </div>
              <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
              

                <div className="border-b border-gray-400 py-3 gap-4 flex flex-col">
                  <div className="flex justify-between px-4 text-[15px]">
                    <p className="text-gray-600 font-semibold">Subtotal</p>
                    <p>${subtotal}</p>
                  </div>
                  <div className="flex justify-between px-4 ">
                    <p className="text-[12px] text-gray-600">Tax(10%)</p>
                    <p className="text-[15px]">${tax}</p>
                  </div>
                </div>
                <div className={``}>
                  <div className="flex justify-between px-4 text-[13px] py-4 ">
                    <p className="font-bold">
                      Total{" "}
                      <span className="font-medium text-gray-600">(USD)</span>
                    </p>
                    <p className="text-[#ED1B99]">${total}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailModal;
