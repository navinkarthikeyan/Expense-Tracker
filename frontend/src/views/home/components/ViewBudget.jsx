import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import Sidebar from "../../sidebar/Sidebar";
import useExpenses from "../../../api/useExpenses"; // Import the useExpenses hook
import useBudget from "../../../api/useBudget"; // Import the useBudget hook
import axios from "axios";
import { toast } from "sonner"; // Import toast from sonner

const ViewBudget = () => {
  const { expenses, error: expensesError } = useExpenses(); // Fetch expenses
  const { budget, error: budgetError } = useBudget(); // Fetch budget limit
  const [monthlyBudget, setMonthlyBudget] = useState({});
  const [originalBudget, setOriginalBudget] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMonthlyBudget = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from local storage
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/budget-monthly/view/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const budgetData = response.data[0]; // Assuming the response is an array with one object
        setMonthlyBudget(budgetData);
        setOriginalBudget(budgetData); // Store the original budget for comparison
      } catch (error) {
        toast.error("Error fetching monthly budget");
      }
    };

    fetchMonthlyBudget();
  }, []);

  // Calculate total sum of all expenses
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount) || 0,
    0
  );

  const handleEditChange = (month, value) => {
    setIsEditing(true);
    setMonthlyBudget((prev) => ({
      ...prev,
      [month]: parseInt(value) || 0, // Ensure float value
    }));
  };

  const homeMenuItems = [
    { label: "View Expenses", path: "/home" },
    { label: "Log Expense", path: "/home/log-expense" },
    { label: "View Budget", path: "/home/view-budget" },
  ];

  const handleSubmit = async () => {
    // Filter out keys corresponding to months (January to December) and sum their values
    const months = [
      "january", "february", "march", "april", "may", "june", 
      "july", "august", "september", "october", "november", "december"
    ];
  
    const totalBudget = months.reduce((sum, month) => {
      return sum + (parseInt(monthlyBudget[month]) || 0);
    }, 0);
  
    console.log(totalBudget);
    console.log(budget);
  
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
      // Re-fetch the budget to get updated data
      await fetchMonthlyBudget();
    } catch (error) {
      toast.error("Error updating monthly budget");
    }
  };
  

  // Check for changes and ensure no duplicate months
  const rows = Object.entries(monthlyBudget)
    .filter(([month]) => month !== "user" && month !== "total_amount")
    .map(([month, amount]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      amount,
    }));

  // Determine if there are changes to show the submit button
  const hasChanges = Object.entries(monthlyBudget).some(
    ([month, amount]) => amount !== originalBudget[month]
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
      <Sidebar menuItems={homeMenuItems} />
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

        {expensesError && (
          <Typography color="error">{expensesError}</Typography>
        )}
        {budgetError && <Typography color="error">{budgetError}</Typography>}

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

        {/* Display Monthly Budget */}
        {monthlyBudget && (
          <Box sx={{ marginTop: "20px", height: "550px", width: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Monthly Budget
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "#1a1a1a",
                color: "white",
                borderRadius: "4px",
                boxShadow: "none",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Month
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Amount ₹
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell sx={{ color: "white" }}>{row.month}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        <TextField
                          type="text"
                          value={monthlyBudget[row.month] || row.amount}
                          onChange={(e) => {
                            const month = row.month.toLowerCase();
                            handleEditChange(month, e.target.value);
                          }}
                          InputProps={{
                            sx: {
                              color: "white",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                            },
                          }}
                          sx={{ width: "100%" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {hasChanges && (
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
        )}
      </Box>
    </Box>
  );
};

export default ViewBudget;
