import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../../sidebar/Sidebar";
import useExpenses from "../../../api/useExpenses";
import useBudget from "../../../api/useBudget";
import axios from "axios";
import { toast } from "sonner";

const ViewBudget = () => {
  const { expenses, error: expensesError } = useExpenses();
  const { budget, error: budgetError } = useBudget();
  const [monthlyBudget, setMonthlyBudget] = useState({});
  const [originalBudget, setOriginalBudget] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const isMemberHex = localStorage.getItem("ismember");
    setIsMember(isMemberHex === "0x1");

    const fetchMonthlyBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/budget-monthly/view/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const budgetData = response.data[0];
        setMonthlyBudget(budgetData);
        setOriginalBudget(budgetData);
      } catch (error) {
        toast.error("Error fetching monthly budget");
      }
    };

    fetchMonthlyBudget();
  }, []);

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount) || 0,
    0
  );

  const handleEditChange = (month, value) => {
    if (!isMember) return;
    setIsEditing(true);
    setMonthlyBudget((prev) => ({
      ...prev,
      [month]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async () => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const totalBudget = months.reduce((sum, month) => {
      return sum + (parseInt(monthlyBudget[month]) || 0);
    }, 0);

    if (totalBudget !== budget) {
      toast.error(
        "The total of all monthly amounts does not match the budget limit."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      await axios.put(
        `http://127.0.0.1:8000/api/users/budget-monthly/update/${username}/`,
        monthlyBudget,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Monthly budget updated successfully.");
      setIsEditing(false);

      await fetchMonthlyBudget();
    } catch (error) {
      // toast.error("Failed to update the budget.");
    }
  };

  const columns = [
    { field: "month", headerName: "Month", flex: 1, editable: false },
    {
      field: "amount",
      headerName: "Amount ₹",
      flex: 1,
      renderCell: (params) => (
        <TextField
          type="text"
          value={monthlyBudget[params.row.month.toLowerCase()] || params.value}
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
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Sidebar
        menuItems={[
          { label: "View Expenses", path: "/home" },
          { label: "Log Expense", path: "/home/log-expense" },
          { label: "View Budget", path: "/home/view-budget" },
          { label: "Analytics", path: "/home/analytics" },
        ]}
      />
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
          padding: "20px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", // To handle overflow on small screens
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          View Budget
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
        >
          Total Expense Amount: ₹ {totalAmount.toFixed(0)}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
        >
          Total Budget Limit: ₹ {budget ? budget : "N/A"}
        </Typography>

        {monthlyBudget && (
          <Box
            sx={{
              marginTop: "20px",
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
        )}
        {isEditing && isMember && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewBudget;
