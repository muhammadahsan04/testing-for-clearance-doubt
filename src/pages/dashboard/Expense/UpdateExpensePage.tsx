import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import AddExpense from "./AddExpense"

// Helper function to get auth token
const getAuthToken = () => {
    let token = localStorage.getItem("token")
    if (!token) {
        token = sessionStorage.getItem("token")
    }
    return token
}

const UpdateExpensePage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [expenseData, setExpenseData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_BASE_URL || "http://192.168.100.18:9000"

    // Fetch single expense by ID
    const fetchExpenseById = async (expenseId: string) => {
        try {
            console.log("Fetching expense with ID:", expenseId)
            setLoading(true)
            const token = getAuthToken()

            if (!token) {
                console.log("No token found")
                toast.error("Authentication token not found. Please login again.")
                navigate("/dashboard/expense/all-expenses")
                return
            }

            console.log("Making API call to:", `${API_URL}/api/abid-jewelry-ms/getExpenseById/${expenseId}`)

            const response = await axios.get(`${API_URL}/api/abid-jewelry-ms/getExpenseById/${expenseId}`, {
                headers: {
                    "x-access-token": token,
                },
            })

            console.log("API Response:", response.data)

            if (response.data.success) {
                console.log("Expense data received:", response.data.data)
                setExpenseData(response.data.data)
            } else {
                console.log("API returned success: false")
                toast.error("Failed to fetch expense details")
                navigate("/dashboard/expense/all-expenses")
            }
        } catch (error) {
            console.error("Error fetching expense:", error)
            toast.error("Failed to fetch expense details")
            navigate("/dashboard/expense/all-expenses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("UpdateExpensePage useEffect triggered")
        console.log("ID from params:", id)

        if (id) {
            console.log("ID exists, fetching expense:", id)
            fetchExpenseById(id)
        } else {
            console.log("No ID found in params")
            toast.error("Expense ID not found")
            navigate("/dashboard/expense/all-expenses")
        }
    }, [id, navigate])

    // Add this to debug the current URL
    useEffect(() => {
        console.log("Current URL:", window.location.href)
        console.log("Current pathname:", window.location.pathname)
    }, [])

    if (loading) {
        return (
            <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
                <h2 className="Inter-font font-semibold text-[20px] mb-2">Update Expense</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

    if (!expenseData) {
        return (
            <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
                <h2 className="Inter-font font-semibold text-[20px] mb-2">Update Expense</h2>
                <div className="text-center">
                    <p>Expense not found</p>
                </div>
            </div>
        )
    }
}

export default UpdateExpensePage
