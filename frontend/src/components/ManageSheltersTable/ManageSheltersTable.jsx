import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const ManageSheltersTable = ({ shelters, onShelterDeleted }) => {
  const [sortConfig, setSortConfig] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/shelters/edit/${id}`);
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this shelter?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5217/shelters/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 204) {
        alert("Shelter deleted successfully.");
        if (onShelterDeleted) onShelterDeleted(id);
      } else if (response.status === 400 || response.status === 409) {
        const error = await response.text();
        alert(`Could not delete shelter: ${error}`);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      alert("Error deleting shelter: " + error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Shelter Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    !isMobile && { field: "phone", headerName: "Phone Number", flex: 1 },
    !isMobile && { field: "email", headerName: "Email", flex: 1 },
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
      <Paper sx={{ minWidth: 600 }}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={shelters}
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

export default ManageSheltersTable;
