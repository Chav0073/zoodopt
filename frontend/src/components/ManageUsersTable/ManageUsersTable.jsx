import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const ManageUsersTable = ({ users, onUserDeleted }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5217/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 204) {
        setSuccessMessage("User deleted successfully.");
        setErrorMessage("");
        if (onUserDeleted) onUserDeleted(id);
      } else {
        const errorText = await response.text();
        const parsed = JSON.parse(errorText);
        setErrorMessage(parsed.error || "Failed to delete user.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error deleting user: " + error.message);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    !isMobile && { field: "role", headerName: "Role", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(params.row.id)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
      width: 180,
    },
  ].filter(Boolean);

  const paginationModel = {
    page: 0,
    pageSize: 5,
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Paper sx={{ minWidth: 600, p: 2 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <div style={{ height: 400, minWidth: 600 }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default ManageUsersTable;
