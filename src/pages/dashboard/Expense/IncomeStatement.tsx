import { DatePicker } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface FinancialSummary {
  netSales: number;
  cogs: number;
  grossProfit: number;
  totalExpenses: number;
  totalExpenseTax: number;
  totalTaxExpensesAndTotalExpense: number;
  netProfit: number;
}

interface ExpenseData {
  _id: string;
  expenseCategory: {
    name: string;
  };
  expenseName: string;
  amount: number;
  date: string;
  tax: {
    taxAmount: number;
  };
}

export default function IncomeStatement() {
  const { RangePicker } = DatePicker;
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  const fetchFinancialSummary = async (
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      let url = `${API_URL}/api/abid-jewelry-ms/getFinancialSummary`;

      // Add date range query parameters if provided
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setFinancialSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      toast.error("Failed to fetch financial summary");
    }
  };

  const fetchExpenses = async (startDate?: string, endDate?: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      let url = `${API_URL}/api/abid-jewelry-ms/getAllExpenses`;

      // Add date range query parameters if provided
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFinancialSummary(), fetchExpenses()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length === 2) {
      setDateRange(dateStrings);
      // Fetch data with new date range
      const startDate = dateStrings[0];
      const endDate = dateStrings[1];

      setLoading(true);
      Promise.all([
        fetchFinancialSummary(startDate, endDate),
        fetchExpenses(startDate, endDate),
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      // Clear date range and fetch all data
      setDateRange(null);
      setLoading(true);
      Promise.all([fetchFinancialSummary(), fetchExpenses()]).finally(() => {
        setLoading(false);
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Filter expenses based on date range (frontend filtering)
  const getFilteredExpenses = () => {
    if (!dateRange) {
      return expenses;
    }

    const [startDate, endDate] = dateRange;
    const start = new Date(startDate);
    const end = new Date(endDate);

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  };

  const filteredExpenses = getFilteredExpenses();

  if (loading) {
    return (
      <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-8">
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="relative w-full sm:w-auto">
            <RangePicker
              className="h-10 !text-gray-400 !border-gray-300 !w-full sm:!w-[250px]"
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
            />
          </div>
          <button className="bg-slate-600 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto">
            Export
          </button>
        </div>

        <div className="text-center border-2 border-gray-200 rounded-lg py-4">
          <h2 className="text-[#056BB7] font-semibold">
            {dateRange
              ? `${dateRange[0]} - ${dateRange[1]}`
              : "Income Statement"}
          </h2>
        </div>

        <p className="text-[#056BB7] font-semibold text-[24px] py-3">
          Financial Summary
        </p>

        <div className="border border-gray-200 rounded-lg mb-4">
          <div className="space-y-2 px-3 py-3">
            <div className="flex justify-between items-center py-0.5 md:py-0.8 text-[15px]">
              <span className="text-gray-800">Net Sales</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {formatCurrency(financialSummary?.netSales || 0)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 md:py-0.8 text-[15px]">
              <span className="text-gray-800">Taxes</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {formatCurrency(financialSummary?.totalExpenseTax || 0)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 md:py-0.8 text-[15px]">
              <span className="text-gray-800">Cost Of Goods Sold</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {formatCurrency(financialSummary?.cogs || 0)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-0.5 md:py-0.8 text-[15px]">
              <span className="text-gray-800">Gross Profit</span>
              <div className="flex items-center">
                <span className="font-medium">
                  {formatCurrency(financialSummary?.grossProfit || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto w-full block">
            <table className="min-w-full w-full table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-800 w-[100px] sm:w-1/6 pl-3">
                    Date
                  </th>
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-800 w-[120px] sm:w-1/4">
                    Category
                  </th>
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-800 w-[150px] sm:w-1/3">
                    Name/Title
                  </th>
                  <th className="py-2 px-3 text-right text-sm font-semibold text-gray-800 w-[120px] sm:w-1/4 pr-3">
                    Amount ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="py-3 px-3 text-[13px] md:text-sm text-gray-800">
                      {formatDate(expense.date)}
                    </td>
                    <td className="py-3 px-3 text-[13px] md:text-sm text-gray-800">
                      {expense.expenseCategory.name}
                    </td>
                    <td className="py-3 px-3 text-[13px] md:text-sm text-gray-800">
                      {expense.expenseName}
                    </td>
                    <td className="py-3 px-3 text-[13px] md:text-sm text-gray-800 text-right">
                      {expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No expenses found for the selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-end flex-col space-y-2">
          <div className="border border-gray-200 rounded-xl py-2 px-4 bg-gray-100 w-full xl:border-none lg:w-md sm:w-md ">
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 mr-2 font-semibold text-sm">
                  💰 Total Expenses ($)
                </span>
                <div>
                  <span className="text-sm font-semibold">
                    -{formatCurrency(financialSummary?.totalExpenses || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 mr-2 font-semibold text-sm">
                  💰 Net Profit ($)
                </span>
                <div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(financialSummary?.netProfit || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 mr-2 font-semibold text-sm">
                  💰 Total Tax of Expenses and Total Expense ($)
                </span>
                <div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(
                      financialSummary?.totalTaxExpensesAndTotalExpense || 0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
