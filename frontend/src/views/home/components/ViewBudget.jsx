import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../../sidebar/Sidebar";
import useExpenses from "../../../api/useExpenses"; // Import the useExpenses hook

const ViewBudget = () => {
  const { expenses, error } = useExpenses(); // Fetch the expenses using the hook

  // Calculate total sum of all expenses
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <Sidebar />
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

        {error && <Typography color="error">{error}</Typography>}

        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
        >
          Total Expense Amount: ₹ {totalAmount.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewBudget;
