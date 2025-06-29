import { BankTransferTable } from "../../../components/BankTransferTable";
import moneyIn from "../../../assets/moneyIn.svg";
import moneyOut from "../../../assets/moneyOut.svg";

// Define types for our data
export type Transaction = {
  id: number;
  date: string;
  description: string;
  type: string;
  paymentMode: string;
  moneyIn: number | null;
  moneyOut: number | null;
  balance: number;
};

export default function Cash() {
  // Sample data for the summary cards
  const summaryData = {
    totalBalance: 25369,
    moneyIn: 23500,
    moneyOut: 35150,
  };

  // Sample data for the table - moved from CashTable to here
  const transactions: Transaction[] = [
    {
      id: 1,
      date: "15-Mar-2025",
      description: "Electricity Bill - Main Branch",
      type: "Office Expense",
      paymentMode: "Bank Transfer",
      moneyIn: null,
      moneyOut: 220,
      balance: 25369,
    },
    {
      id: 2,
      date: "12-Mar-2025",
      description: "Gold Purchase from K&K Traders",
      type: "Vendor Purchase",
      paymentMode: "Wire Transfer",
      moneyIn: null,
      moneyOut: 12500,
      balance: 25589,
    },
    {
      id: 3,
      date: "10-Mar-2025",
      description: "Customer Sale - Invoice #5482",
      type: "Customer Sale",
      paymentMode: "Cash",
      moneyIn: 18000,
      moneyOut: null,
      balance: 38089,
    },
    {
      id: 4,
      date: "08-Mar-2025",
      description: "Internet Bill - HO",
      type: "Office Expense",
      paymentMode: "Bank",
      moneyIn: null,
      moneyOut: 80,
      balance: 20089,
    },
    {
      id: 5,
      date: "07-Mar-2025",
      description: "Salary - March",
      type: "Salary",
      paymentMode: "Bank Transfer",
      moneyIn: null,
      moneyOut: 7200,
      balance: 20169,
    },
    {
      id: 6,
      date: "06-Mar-2025",
      description: "Jewelry Sold - Walk-in Client",
      type: "Customer Sale",
      paymentMode: "Apple Pay",
      moneyIn: 2500,
      moneyOut: null,
      balance: 27369,
    },
    {
      id: 7,
      date: "05-Mar-2025",
      description: "Vendor Payment - Silver Co.",
      type: "Vendor Purchase",
      paymentMode: "Cash",
      moneyIn: null,
      moneyOut: 5000,
      balance: 24869,
    },
    {
      id: 8,
      date: "04-Mar-2025",
      description: "Bank Deposit",
      type: "Bank Deposit",
      paymentMode: "Wire Transfer",
      moneyIn: 3000,
      moneyOut: null,
      balance: 29869,
    },
    {
      id: 9,
      date: "03-Mar-2025",
      description: "Water Bill - Workshop",
      type: "Office Expense",
      paymentMode: "Bank",
      moneyIn: null,
      moneyOut: 150,
      balance: 26869,
    },
    {
      id: 10,
      date: "02-Mar-2025",
      description: "Internal Transfer to Store #2",
      type: "Store Transfer",
      paymentMode: "Bank Transfer",
      moneyIn: null,
      moneyOut: 10000,
      balance: 27019,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Cash Flow</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Total Balance Card */}
        <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <div className="h-1 w-4 bg-gradient-to-r from-[#36D9FF] to-[#4A00C5] mb-2"></div>
          <h2 className="text-3xl font-bold">
            ${summaryData.totalBalance.toLocaleString()}
          </h2>
        </div>

        {/* Money In Card */}
        <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1 flex items-center">
            <img src={moneyIn} alt="moneyIn" className="mr-2" />
            Money In
          </p>
          <div className="h-1 w-4 bg-gradient-to-r from-[#36D9FF] to-[#4A00C5] mb-2"></div>
          <h2 className="text-3xl font-bold">
            ${summaryData.moneyIn.toLocaleString()}
          </h2>
        </div>

        {/* Money Out Card */}
        <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1 flex items-center">
           <img src={moneyOut} alt="moneyOut" className="mr-2" />
            Money Out
          </p>
          <div className="h-1 w-4 bg-gradient-to-r from-[#36D9FF] to-[#4A00C5] mb-2"></div>
          <h2 className="text-3xl font-bold">
            ${summaryData.moneyOut.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Cash Table Component */}
      <BankTransferTable transactions={transactions} />
    </div>
  );
}
