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

  useEffect(() => {
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
    setIsEditing(true);
    setMonthlyBudget((prev) => ({
      ...prev,
      [month]: parseInt(value) || 0,
    }));
  };

  const homeMenuItems = [
    { label: "View Expenses", path: "/home" },
    { label: "Log Expense", path: "/home/log-expense" },
    { label: "View Budget", path: "/home/view-budget" },
    { label: "Analytics", path: "/home/analytics" },
  ];

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
      toast.error("Error updating monthly budget");
    }
  };

  
  const rows = Object.entries(monthlyBudget)
    .filter(([month]) => month !== "user" && month !== "total_amount")
    .map(([month, amount]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      amount,
    }));

  
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
        overflow: "hidden", 
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
          overflow: "hidden", 
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

       
        {monthlyBudget && (
          <Box
            sx={{
              marginTop: "20px",
              height: "calc(100vh - 350px)", 
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                flexGrow: 1, 
                overflowY: "auto", 
                marginBottom: hasChanges ? "80px" : "0px",
              }}
            >
              <Table stickyHeader>
               
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "#333",
                      }}
                    >
                      Month
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor: "#333",
                      }}
                    >
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
                  position: "absolute", 
                  bottom: "20px",
                  left: 0,
                  right: 0,
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
