import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const ManagePetsTable = ({ pets }) => {
  const [sortConfig, setSortConfig] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/pets/edit/${id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "ageGroup", headerName: "Age Group", flex: 1 },
    !isMobile && { field: "description", headerName: "Description", flex: 2 },
    !isMobile && {
      field: "shelterId",
      headerName: "Shelter ID",
      type: "number",
      width: 100,
    },
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
      width: 100,
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
            rows={pets}
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

export default ManagePetsTable;
