import React, { useState, useEffect } from "react";
import ProductCategoryTable from "../../../components/ProductCategoryTable";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface CategoryData {
  _id: string;
  name: string;
  description: string;
  sno?: string;
  category?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

const ProductCategory: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const charLimit = 165;

  const navigate = useNavigate();

  // Check permissions
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Core Setting", "create");
  const canUpdate = isAdmin || hasPermission("Core Setting", "update");
  const canDelete = isAdmin || hasPermission("Core Setting", "delete");

  const columns: Column[] = [
    { header: "S.no", accessor: "sno" },
    { header: "Category", accessor: "category" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  // Existing useEffect
  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to create product category");
    }
  }, [canCreate]);
  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Transform the data to match the expected format
        const formattedData = response.data.data.map(
          (cat: any, index: number) => ({
            _id: cat._id,
            sno: (index + 1).toString().padStart(2, "0"),
            category: cat.name,
            name: cat.name,
            description: cat.description || "",
          })
        );

        setCategoryData(formattedData);
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch categories"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching categories");
      }
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreate) {
      toast.error("You don't have permission to create product category");
      setIsLoading(false);
      return;
    }

    if (!category.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        name: category,
        description: categoryDescription,
      };

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addCategory`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Category added successfully!");

        // Reset form fields
        setCategory("");
        setCategoryDescription("");

        // Refresh categories list
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to add category");
        }
      } else {
        toast.error("An unexpected error occurred while adding category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= charLimit) {
      setCategoryDescription(e.target.value);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (updatedCategory: CategoryData) => {
    // Update the categoryData state with the updated category
    setCategoryData((prevData) =>
      prevData.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    );
  };

  // Handle category deletion
  const handleDeleteCategory = async (category: CategoryData) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteCategory/${category._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Category deleted successfully!");

        // Remove the deleted category from the list
        setCategoryData(categoryData.filter((cat) => cat._id !== category._id));
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to delete category"
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting category");
      }
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-10 py-6 mb-10">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
          Add Product Category
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 text-[15px] Poppins-font font-medium w-full"
        >
          <div className="flex flex-col mb-2">
            <label className="mb-1 text-black">
              Category <span className="text-red-500"> *</span>
            </label>
            <Input
              placeholder="Product Category Name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none focus:outline-none w-full"
              // required
            />
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="" className="mb-1">
              Category Description
            </label>
            <textarea
              value={categoryDescription}
              onChange={handleCategoryDescriptionChange}
              placeholder="Description"
              rows={4}
              className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
            ></textarea>
            <div className="flex justify-end text-[#2C8CD4] mt-0.5">
              {categoryDescription.length}/{charLimit}
            </div>
          </div>
          <div className="flex justify-end items-end font-medium gap-4">
            {canCreate && (
              <Button
                text={isLoading ? "Saving..." : "Save"}
                className={`px-6 !bg-[#056BB7] border-none text-white ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              />
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductCategoryTable
          columns={columns}
          data={categoryData}
          tableTitle="Product Category"
          onEdit={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      )}
    </div>
  );
};

export default ProductCategory;
