"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { ShoppingCart, TrendingUp, Package, DollarSign, Archive, Users, Grid3X3, AlertTriangle } from "lucide-react"

// Sample data for charts
const salesPurchaseData = [
  { month: "Jan", purchase: 45000, sales: 65000 },
  { month: "Feb", purchase: 52000, sales: 78000 },
  { month: "Mar", purchase: 48000, sales: 85000 },
  { month: "Apr", purchase: 61000, sales: 90000 },
  { month: "May", purchase: 55000, sales: 95000 },
  { month: "Jun", purchase: 67000, sales: 88000 },
  { month: "Jul", purchase: 71000, sales: 92000 },
  { month: "Aug", purchase: 58000, sales: 87000 },
  { month: "Sep", purchase: 63000, sales: 94000 },
  { month: "Oct", purchase: 69000, sales: 98000 },
  { month: "Nov", purchase: 74000, sales: 102000 },
  { month: "Dec", purchase: 78000, sales: 108000 },
]

const orderSummaryData = [
  { month: "Jan", sales: 4200, profit: 2400 },
  { month: "Feb", sales: 3800, profit: 2200 },
  { month: "Mar", sales: 4500, profit: 2800 },
  { month: "Apr", sales: 4100, profit: 2600 },
  { month: "May", sales: 4800, profit: 3200 },
  { month: "Jun", sales: 4300, profit: 2900 },
]

const topSellingStock = [
  { name: "Celestial Spark Sand", soldQuantity: 30, remainingQuantity: 12, price: 100 },
  { name: "Golden Aura Pendant", soldQuantity: 21, remainingQuantity: 18, price: 207 },
  { name: "Royal Gold Cuff", soldQuantity: 19, remainingQuantity: 17, price: 105 },
]

const lowQuantityStock = [
  { name: "Enchanted Locket", remainingQuantity: 9, status: "Low" },
  { name: "Infinity Balance Ring", remainingQuantity: 15, status: "Low" },
  { name: "Infinity Link Bracelet", remainingQuantity: 13, status: "Low" },
]

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Sales Overview</h3>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">Recent</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Sales</p>
                <p className="text-lg font-semibold">$ 632</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-lg font-semibold">$ 18,300</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Profit</p>
                <p className="text-lg font-semibold">$ 868</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Inventory Summary</h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-md">Latest</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-lg font-semibold">$ 17,432</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Quantity in Hand</p>
                <p className="text-lg font-semibold">868</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Archive className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">To be received</p>
                <p className="text-lg font-semibold">200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Purchase Overview</h3>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">Recent</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Purchase</p>
                <p className="text-lg font-semibold">82</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-lg font-semibold">$ 13,573</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Return</p>
                <p className="text-lg font-semibold">$ 17,432</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Product Summary</h3>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">Recent</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Number of Suppliers</p>
                <p className="text-lg font-semibold">31</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Number of Categories</p>
                <p className="text-lg font-semibold">21</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Purchase Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales & Purchase</h3>
            <span className="px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded-md">
              Weekly
            </span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPurchaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchase" fill="#8b5cf6" name="Purchase" />
                <Bar dataKey="sales" fill="#10b981" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Summary Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderSummaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Stock */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Stock</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">See All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Sold Quantity</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Remaining Quantity</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Price</th>
                </tr>
              </thead>
              <tbody>
                {topSellingStock.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{item.soldQuantity}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{item.remainingQuantity}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Quantity Stock */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Low Quantity Stock</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">See All</button>
          </div>
          <div className="space-y-4">
            {lowQuantityStock.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Remaining Quantity: {item.remainingQuantity} Packet</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
