// src/components/BudgetTable.js
import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const BudgetTable = ({
  monthlyBudget,
  monthlySpending,
  handleEditChange,
  isMember,
}) => {
  const columns = [
    { field: "month", headerName: "Month", flex: 1, editable: false },
    {
      field: "amount",
      headerName: "Amount ₹",
      flex: 1,
      renderCell: (params) => {
        const amount =
          monthlyBudget[params.row.month.toLowerCase()] || params.value;

        return isMember ? (
          <TextField
            type="text"
            value={amount}
            onChange={(e) =>
              handleEditChange(params.row.month.toLowerCase(), e.target.value)
            }
            disabled={!isMember}
            InputProps={{
              sx: {
                color: "white",
                backgroundColor: "#333",
                borderRadius: "4px",
              },
            }}
            sx={{ width: "100%" }}
          />
        ) : (
          <Typography
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingTop: "15px",
            }}
          >
            {amount}
          </Typography>
        );
      },
    },
    {
      field: "spending",
      headerName: "Current Monthly Spending ₹ ",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            paddingTop: "15px",
          }}
        >
          {monthlySpending[params.row.month.toLowerCase()] || 0}
        </Typography>
      ),
    },
  ];

  const rows = Object.entries(monthlyBudget)
    .filter(([month]) => month !== "user" && month !== "total_amount")
    .map(([month, amount]) => ({
      id: month,
      month: month.charAt(0).toUpperCase() + month.slice(1),
      amount,
    }));

  return (
    <Box
      sx={{
        marginTop: "20px",
        height: "auto",
        width: "100%",
        maxWidth: { xs: "100%", md: "80%" },
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
        "& .MuiTablePagination-displayedRows": {
          color: "white",
        },
        "& .MuiTablePagination-selectLabel": {
          color: "white",
        },
        "& .MuiTablePagination-input": {
          color: "white",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        hideFooterSelectedRowCount
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

export default BudgetTable;
