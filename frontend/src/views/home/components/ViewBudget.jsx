import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
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
  const [monthlySpending, setMonthlySpending] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Fetch expenses from the API and calculate total monthly spending
  const fetchMonthlySpending = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users/expenses/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Group expenses by month and sum amounts for each month
      const spendingByMonth = response.data.reduce((acc, expense) => {
        const month = new Date(expense.date)
          .toLocaleString("default", {
            month: "long",
          })
          .toLowerCase();
        acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      // Fill in months with 0 if no expenses exist for that month
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
      const completeSpending = months.reduce((acc, month) => {
        acc[month] = spendingByMonth[month] || 0;
        return acc;
      }, {});

      setMonthlySpending(completeSpending);
    } catch (error) {
      toast.error("Error fetching expenses.");
    }
  };

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
    fetchMonthlySpending(); // Fetch monthly spending
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
      setMonthlyBudget(originalBudget);
      setIsEditing(false);
      return;
    }

    for (const month of months) {
      const budgetAmount = parseInt(monthlyBudget[month]) || 0;
      const spendingAmount = monthlySpending[month] || 0;

      if (budgetAmount < spendingAmount) {
        toast.error(
          `The budget for ${
            month.charAt(0).toUpperCase() + month.slice(1)
          } must be greater than the current spending of ₹ ${spendingAmount}.`
        );

        // Reset to original budget values
        setMonthlyBudget(originalBudget);
        setIsEditing(false);
        return;
      }
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

      setTimeout(async () => {
        await fetchMonthlyBudget();
      }, 500);
    } catch (error) {
      toast.error("Failed to update the budget.");
    }
  };

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
          ...(isMember
            ? [{ label: "Analytics", path: "/home/analytics" }]
            : []),
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
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewBudget;
