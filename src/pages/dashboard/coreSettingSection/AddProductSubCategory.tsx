import React, { useState, useEffect } from "react";
import AddProductSubCategoryTable from "../../../components/AddProductSubCategoryTable";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Dropdown from "../../../components/Dropdown";
import axios from "axios";
import { toast } from "react-toastify";
import { hasPermission } from "../sections/CoreSettings";

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface SubCategoryData {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  sno?: string;
  subCategory?: string;
}

interface CategoryData {
  _id: string;
  name: string;
  description?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// getUserRole function
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};
const AddProductSubCategory: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<SubCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryDetails, setSelectedCategoryDetails] =
    useState<CategoryData | null>(null);

  const navigate = useNavigate();

  // Permission variables add
  const userRole = getUserRole();
  const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
  const canCreate = isAdmin || hasPermission("Core Setting", "create");
  const canUpdate = isAdmin || hasPermission("Core Setting", "update");
  const canDelete = isAdmin || hasPermission("Core Setting", "delete");

  const columns: Column[] = [
    { header: "S.no", accessor: "sno" },
    { header: "Category", accessor: "category" },
    { header: "Sub Category", accessor: "subCategory" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (!canCreate) {
      toast.error("You don't have permission to create product sub-category");
    }
  }, [canCreate]);

  // Fetch all categories
  const fetchCategories = async () => {
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
        const categories = response.data.data;
        setCategoryData(categories);

        // Extract category names for dropdown
        const categoryNames = categories.map((cat: CategoryData) => cat.name);
        setCategoryOptions(categoryNames);

        // Set default selected category if available
        // if (categoryNames.length > 0) {
        //   setSelectedCategory(categoryNames[0]);

        //   // Fetch details for the first category
        //   const firstCategoryId = categories[0]._id;
        //   fetchCategoryDetails(firstCategoryId);
        // }
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
    }
  };

  // Fetch category details when a category is selected
  const fetchCategoryDetails = async (categoryId: string) => {
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneCategory/${categoryId}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSelectedCategoryDetails(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch category details"
        );
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch category details"
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred while fetching category details"
        );
      }
    }
  };

  // Fetch all subcategories
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getAllSubCategory`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // console.log('response' , response);
        // console.log('response.data' , response.data);
        // console.log('response.data.data' , response.data.data);

        // Transform the data to match the expected format
        const formattedData = response.data.data.map(
          (subCat: any, index: number) => ({
            _id: subCat._id,
            sno: (index + 1).toString().padStart(2, "0"),
            category: subCat.category?.name || "N/A",
            subCategory: subCat.name,
            name: subCat.name,
            categoryId: subCat.category?._id || "",
          })
        );

        setSubCategoryData(formattedData);
      } else {
        toast.error(response.data.message || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch subcategories"
          );
        }
      } else {
        toast.error(
          "An unexpected error occurred while fetching subcategories"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);

    // Find the category ID based on the selected category name
    const selectedCategoryObj = categoryData.find(
      (cat) => cat.name === categoryName
    );

    if (selectedCategoryObj) {
      fetchCategoryDetails(selectedCategoryObj._id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreate) {
      toast.error("You don't have permission to create product sub-category");
      setIsLoading(false);
      return;
    }

    if (!subCategoryName.trim()) {
      toast.error("Sub-category name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
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

      // Find the category ID based on the selected category name
      const selectedCategoryObj = categoryData.find(
        (cat) => cat.name === selectedCategory
      );

      if (!selectedCategoryObj) {
        toast.error("Selected category not found");
        return;
      }

      const payload = {
        name: subCategoryName,
        category: selectedCategoryObj._id,
      };

      const response = await axios.post(
        `${API_URL}/api/abid-jewelry-ms/addSubCategory`,
        payload,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Sub-category added successfully!");

        // Reset form fields
        // Reset form fields
        setSubCategoryName("");
        setSelectedCategory("");

        // Refresh subcategories list
        fetchSubCategories();
      } else {
        toast.error(response.data.message || "Failed to add sub-category");
      }
    } catch (error) {
      console.error("Error adding sub-category:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to add sub-category"
          );
        }
      } else {
        toast.error("An unexpected error occurred while adding sub-category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subcategory update
  const handleUpdateSubCategory = async (
    updatedSubCategory: SubCategoryData
  ) => {
    // e.stopPropagation();
    if (!canUpdate) {
      toast.error("You don't have permission to edit product sub-category");
      return;
    }
    // Update the subCategoryData state with the updated subcategory
    setSubCategoryData((prevData) =>
      prevData.map((subCat) =>
        subCat._id === updatedSubCategory._id ? updatedSubCategory : subCat
      )
    );
  };

  // Handle subcategory deletion
  const handleDeleteSubCategory = async (subCategory: SubCategoryData) => {
    try {
      if (!canDelete) {
        toast.error("You don't have permission to delete product sub-category");
        return;
      }

      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteSubCategory/${subCategory._id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Sub-category deleted successfully!");

        // Remove the deleted subcategory from the list
        setSubCategoryData(
          subCategoryData.filter((subCat) => subCat._id !== subCategory._id)
        );
      } else {
        toast.error(response.data.message || "Failed to delete sub-category");
      }
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to delete sub-category"
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting sub-category");
      }
    }
  };

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-10 py-6 mb-10">
        <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
          Add Product Sub-Category
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 text-[15px] Poppins-font font-medium w-full grid-cols-1 md:grid-cols-3"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-black">
              Sub Category <span className="text-red-500"> *</span>
            </label>
            <Input
              placeholder="Product Sub-Category Name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="outline-none focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-black">
              Category <span className="text-red-500"> *</span>
            </label>
            <Dropdown
              key={selectedCategory}
              // DropDownName="Select category"
              options={categoryOptions}
              defaultValue={selectedCategory || "Select Category"} // Use selectedCategory state
              onSelect={handleCategorySelect}
              noResultsMessage="No category found"
              searchable={true} // Add this prop
            />

            {/* <Dropdown
                options={roles.map((role) => role.name)}
                className="w-full"
                onSelect={handleRoleSelect}
                noResultsMessage="No roles found"
                defaultValue={selectedRoleName || "Select Role"}
                searchable={true} // Add this prop
              /> */}
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
        <AddProductSubCategoryTable
          columns={columns}
          data={subCategoryData}
          tableTitle="Product Sub-Category"
          onEdit={handleUpdateSubCategory}
          onDelete={handleDeleteSubCategory}
          categoryOptions={categoryOptions}
          categoryData={categoryData}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      )}
    </div>
  );
};

export default AddProductSubCategory;
