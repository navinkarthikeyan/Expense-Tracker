import React from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ExpenseTable = ({
  expenses,
  handleDeleteExpense,
  handleOpenUpdateDialog,
}) => {
  const columns = [
    { field: "category", headerName: "Category", flex: 1, editable: false },
    { field: "amount", headerName: "Amount ₹", flex: 1, editable: false },
    { field: "date", headerName: "Date", flex: 1, editable: false },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDeleteExpense(params.row.id)}
            sx={{ color: "red" }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => handleOpenUpdateDialog(params.row)}
            sx={{
              marginLeft: "10px",
              backgroundColor: "transparent",
              padding: "4px",
              color: "white",
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "550px",
        width: "100%",
        backgroundColor: "#1a1a1a",
        borderRadius: "4px",
        "& .MuiDataGrid-cell": {
          color: "white",
          borderRight: "1px solid #444",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#333",
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "#333",
        },
      }}
    >
      <DataGrid
        rows={expenses}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#333",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          },
        }}
      />
    </Box>
  );
};

export default ExpenseTable;
