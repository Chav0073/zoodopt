import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ManageSheltersTable = ({ shelters }) => {
  const [sortConfig, setSortConfig] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  const handleEdit = (id) => {
    alert(`Edit shelter with ID: ${id}`);
    // Or navigate to edit page, open modal, etc.
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
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </Button>
      ),
      width: 100
    }
  ].filter(Boolean); // Remove falsey values (e.g., conditionally excluded columns)

  const paginationModel = {
    page: 0,
    pageSize: 5
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
