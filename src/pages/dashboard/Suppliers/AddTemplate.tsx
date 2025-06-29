import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import TemplateTable from "../../../components/TemplateTable";
import axios from "axios";
import { toast } from "react-toastify";

// Helper function to check permissions
const hasPermission = (module: string, action: string) => {
  try {
    let permissionsStr = localStorage.getItem("permissions");
    if (!permissionsStr) {
      permissionsStr = sessionStorage.getItem("permissions");
    }

    if (!permissionsStr) return false;

    const permissions = JSON.parse(permissionsStr);

    // Check if user has all permissions
    if (permissions.allPermissions || permissions.allPagesAccess) return true;

    const page = permissions.pages?.find((p: any) => p.name === module);
    if (!page) return false;

    switch (action.toLowerCase()) {
      case "create":
        return page.create;
      case "read":
        return page.read;
      case "update":
        return page.update;
      case "delete":
        return page.delete;
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
};

// Helper function to get user role
const getUserRole = () => {
  let role = localStorage.getItem("role");
  if (!role) {
    role = sessionStorage.getItem("role");
  }
  return role;
};

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
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "read")) {
      toast.error("You don't have permission to view templates");
      navigate("/dashboard");
      return;
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

  // Function to add a new template
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check permission before submitting
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "create")) {
      toast.error("You don't have permission to create templates");
      return;
    }

    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!templateContent.trim()) {
      toast.error("Template content is required");
      return;
    }

    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await axios({
        method: "POST",
        url: `${API_URL}/api/abid-jewelry-ms/createTemplate`,
        data: {
          name: templateName,
          content: templateContent,
          status: "Active",
        },
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success) {
        toast.success("Template added successfully");
        setTemplateName("");
        setTemplateContent("");
        fetchTemplates();
      } else {
        toast.error(data.message || "Failed to add template");
      }
    } catch (error) {
      console.error("Error adding template:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to add template");
        }
      } else {
        toast.error("An unexpected error occurred while adding the template");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle edit action from TemplateTable
  const handleEditTemplate = async (row: any) => {
    // Check permission before editing
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "update")) {
      toast.error("You don't have permission to edit templates");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
      const token = getAuthToken();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/abid-jewelry-ms/getOneTemplate/${row.id}`,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success && data.data) {
        const updateResponse = await axios({
          method: "PUT",
          url: `${API_URL}/api/abid-jewelry-ms/updateTemplate/${row.id}`,
          data: {
            name: row.name,
            content: row.content,
            status: row.status,
          },
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        });

        if (updateResponse.data.success) {
          toast.success("Template updated successfully");
          fetchTemplates();
        } else {
          toast.error(
            updateResponse.data.message || "Failed to update template"
          );
        }
      } else {
        toast.warning("Failed to fetch template details");
      }
    } catch (error) {
      console.error("Error editing template:", error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error(error.response.data.message || "Failed to edit template");
        }
      } else {
        toast.error("An unexpected error occurred while editing the template");
      }
    }
  };

  // Function to handle delete action from TemplateTable
  const handleDeleteTemplate = async (row: any) => {
    // Check permission before deleting
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";

    if (!isAdmin && !hasPermission("Suppliers", "delete")) {
      toast.error("You don't have permission to delete templates");
      return;
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
    const userRole = getUserRole();
    const isAdmin = userRole === "Admin" || userRole === "SuperAdmin";
    return isAdmin || hasPermission("Suppliers", "create");
  };

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

          <form
            onSubmit={handleSubmit}
            className="md:mt-6 mt-4 grid gap-3 lg:gap-4 xl:gap-6 text-[15px] Poppins-font font-medium w-full"
          >
            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">
                Template Name <span className="text-red-500"> *</span>
              </label>
              <Input
                placeholder="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="outline-none focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 text-black">Template Content</label>
              <textarea
                placeholder="Template Content"
                rows={5}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="Poppins-font font-medium w-full px-4 py-2 border border-gray-300 rounded-md text-sm !focus:outline-none outline-none resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end font-medium gap-4">
              <Button
                text="Back"
                className="px-6 !bg-[#F4F4F5] !border-none"
                onClick={() => navigate(-1)}
              />
              <Button
                text={isLoading ? "Saving..." : "Save"}
                className={`px-6 !bg-[#056BB7] border-none text-white ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      )}

      {isLoadingData ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
