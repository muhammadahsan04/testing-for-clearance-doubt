"use client";

import React, { useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import type { Transaction } from "../../src/pages/dashboard/CashFlow/Cash";
import Input from "./Input";
import Dropdown from "./Dropdown";
import { DatePicker } from "antd";
import dayjs from "dayjs";

// Update the component to implement search functionality
export function ApplePayTransferTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { RangePicker } = DatePicker;

  // State for filters
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [paymentMode, setPaymentMode] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter transactions based on search query, payment mode, and date range
  const filteredData = transactions.filter((transaction) => {
    // Search in description or type fields
    const matchesSearch =
      transaction.description.toLowerCase().includes(search.toLowerCase()) ||
      transaction.type.toLowerCase().includes(search.toLowerCase());

    // Filter by payment mode if not "All"
    const matchesPaymentMode =
      paymentMode === "All" || transaction.paymentMode === paymentMode;

    // Filter by date range if set
    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const transactionDate = dayjs(transaction.date, "DD-MMM-YYYY");
      matchesDateRange =
        transactionDate.isAfter(dateRange[0], "day") ||
        (transactionDate.isSame(dateRange[0], "day") &&
          (transactionDate.isBefore(dateRange[1], "day") ||
            transactionDate.isSame(dateRange[1], "day")));
    }

    return matchesSearch && matchesPaymentMode && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dates);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#056BB7]">Apple Pay</h2>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded transition-colors">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <RangePicker
            className="h-10 !text-gray-400 !border-gray-300 w-full"
            onChange={handleDateRangeChange}
          />
        </div>

        {/* <div className="flex items-end border"> */}
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label> */}
        <Dropdown
          options={[
            "All",
            "Cash",
            "Bank Transfer",
            "Wire Transfer",
            "Apple Pay",
          ]}
          DropDownName="Payment Mode"
          defaultValue="All"
          onSelect={(val) => {
            setPaymentMode(val);
            setCurrentPage(1);
          }}
          className="!w-full"
        />
        {/* </div> */}

        {/* <div className="flex items-end w-full"> */}
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">Search</label> */}
        <Input
          placeholder="Search Description or Type"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          className="!rounded-3xl !w-full outline-none"
        />
        {/* </div> */}
      </div>

      {/* Table with overflow-x-auto */}
      <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 font-semibold text-[16px] whitespace-nowrap w-full">
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                Type
              </th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment Mode</th> */}
              <th className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                Money In ($)
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                Money Out ($)
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-700 text-center">
                Balance ($)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
              >
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {transaction.date}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {transaction.type}
                </td>
                {/* <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentMode}</td> */}
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {transaction.moneyIn
                    ? transaction.moneyIn.toLocaleString()
                    : "--"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {transaction.moneyOut
                    ? transaction.moneyOut.toLocaleString()
                    : "--"}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                  {transaction.balance.toLocaleString()}
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className={`flex flex-col md:flex-row items-center justify-between px-4 py-4`}
      >
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleChangePage(currentPage - 1)}
            className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
            disabled={currentPage === 1}
          >
            <GoChevronLeft size={18} />
          </button>

          {/* Always show page 1 */}
          <button
            onClick={() => handleChangePage(1)}
            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
              currentPage === 1
                ? "bg-[#407BFF] text-white"
                : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
            }`}
          >
            1
          </button>

          {/* Show dots if current page is far from start */}
          {currentPage > 3 && (
            <div>
              <span className="text-gray-500 px-0.5">•</span>
              <span className="text-gray-500 px-0.5">•</span>
              <span className="text-gray-500 px-0.5">•</span>
            </div>
          )}

          {/* Show current page and surrounding pages (but not 1 or last page) */}
          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((page) => page > 1 && page < totalPages && page >= 1)
            .map((num) => (
              <button
                key={num}
                onClick={() => handleChangePage(num)}
                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                  currentPage === num
                    ? "bg-[#407BFF] text-white"
                    : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
                }`}
              >
                {num}
              </button>
            ))}

          {/* Show dots if current page is far from end */}
          {currentPage < totalPages - 2 && totalPages > 1 && (
            <div>
              <span className="text-gray-500 px-0.5">•</span>
              <span className="text-gray-500 px-0.5">•</span>
              <span className="text-gray-500 px-0.5">•</span>
            </div>
          )}

          {/* Always show last page (if more than 1 page) */}
          {totalPages > 1 && (
            <button
              onClick={() => handleChangePage(totalPages)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                currentPage === totalPages
                  ? "bg-[#407BFF] text-white"
                  : "bg-[#E5E7EB] text-black hover:bg-[#407BFF] hover:text-white"
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => handleChangePage(currentPage + 1)}
            className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
            disabled={currentPage === totalPages}
          >
            <GoChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm">Show:</span>
          <Dropdown
            options={["10 Row", "15 Row", "20 Row", "25 Row", "All"]}
            defaultValue="10 Row"
            onSelect={(val) => {
              if (val === "All") {
                setRowsPerPage(filteredData.length || transactions?.length);
              } else {
                const selected = Number.parseInt(val.split(" ")[0]);
                setRowsPerPage(selected);
              }
              setCurrentPage(1);
            }}
            className="bg-black text-white rounded px-2 py-1 min-w-[90px]"
          />
        </div>
      </div>
    </div>
  );
}
