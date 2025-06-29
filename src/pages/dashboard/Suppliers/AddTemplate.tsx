import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import TemplateTable from "../../../components/TemplateTable";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role")
  if (!role) {
    role = sessionStorage.getItem("role")
  }
  return role
}

interface Column {
  header: string;
  accessor: string;
  type?: "text" | "image" | "status" | "actions";
}

interface TemplateData {
  id: string;
  name: string;
  content: string;
  status: string;
  _id?: string;
}

const AddTemplates: React.FC = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateData, setTemplateData] = useState<TemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check permissions on component mount
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

    if (!isAdmin && !hasPermission("Suppliers", "read")) {
      toast.error("You don't have permission to view templates")
      navigate("/dashboard")
      return
    }

    fetchTemplates();
  }, [navigate]);

  // Helper function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }
    return token;
  };

  // Function to fetch all templates
  const fetchTemplates = async () => {
    setIsLoadingData(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/allTemplates`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success && Array.isArray(data.data)) {
        const mappedData = data.data.map((template: any, index: number) => ({
          templateId: template.templateId,
          id: template._id,
          name: template.name,
          content: template.content,
          status: template.status || "Active",
          _id: template._id,
        }));

        setTemplateData(mappedData);
        toast.success("Templates loaded successfully");
      } else {
        toast.warning("No templates found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to fetch templates"
          );
        }
      } else {
        toast.error("An unexpected error occurred while fetching templates");
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // Function to handle delete action from TemplateTable
  const handleDeleteTemplate = async (row: any) => {
    // Check permission before deleting
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"

    if (!isAdmin && !hasPermission("Suppliers", "delete")) {
      toast.error("You don't have permission to delete templates")
      return
    }

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/abid-jewelry-ms/deleteTemplate/${row.id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Template deleted successfully");
        fetchTemplates();
      } else {
        toast.error(data.message || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(
            error.response.data.message || "Failed to delete template"
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting the template");
      }
    }
  };

  // Check if user can create templates
  const canCreateTemplate = () => {
    const userRole = getUserRole()
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin"
    return isAdmin || hasPermission("Suppliers", "create")
  }

  const columns: Column[] = [
    { header: "Template ID", accessor: "templateId" },
    { header: "Template Name", accessor: "name", type: "text" },
    { header: "Status", accessor: "status", type: "status" },
    { header: "Actions", accessor: "actions", type: "actions" },
  ];

  return (
    <div className="w-full mx-auto px-3 py-6 sm:px-4 md:px-6 xl:px-8 xl:py-6">
      {canCreateTemplate() && (
        <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 md:px-8 py-6 mb-10">
          <p className="Source-Sans-Pro-font text-[#056BB7] font-semibold text-[22px] m-0">
            Add Template
          </p>

        </div>
      )}

      {isLoadingData ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      ) : (
        <TemplateTable
          tableDataAlignment="zone"
          columns={columns}
          data={templateData}
          enableRowModal={false}
          tableTitle="Template"
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
        />
      )}
    </div>
  );
};

export default AddTemplates;
