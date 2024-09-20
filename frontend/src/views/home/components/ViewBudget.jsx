import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Sidebar from "../../sidebar/Sidebar";
import useExpenses from "../../../api/useExpenses";
import useBudget from "../../../api/useBudget";
import axios from "axios";
import { toast } from "sonner"; 
import BudgetTable from "./BudgetTable";
import BASE_URL from "../../../../config";

const ViewBudget = () => {
  const { expenses } = useExpenses();
  const { budget } = useBudget();
  const [monthlyBudget, setMonthlyBudget] = useState({});
  const [originalBudget, setOriginalBudget] = useState({});
  const [monthlySpending, setMonthlySpending] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const fetchMonthlySpending = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/users/expenses/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const spendingByMonth = response.data.reduce((acc, expense) => {
        const month = new Date(expense.date)
          .toLocaleString("default", {
            month: "long",
          })
          .toLowerCase();
        acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

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
          `${BASE_URL}/api/users/budget-monthly/view/`,
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
    fetchMonthlySpending();
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

        setMonthlyBudget(originalBudget);
        setIsEditing(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      await axios.put(
        `${BASE_URL}/api/users/budget-monthly/update/${username}/`,
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

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        flexDirection: { xs: "column", md: "row" },
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
          justifyContent: "center",
          alignItems: "center",
          maxWidth: { xs: "100%", md: "80%" },
          marginLeft: { xs: "5%", md: "10%" },
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            fontSize: { xs: "16px", md: "20px" },
          }}
        >
          Total Expense Amount: ₹ {totalAmount.toFixed(0)}
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            fontSize: { xs: "16px", md: "20px" },
          }}
        >
          Total Budget Limit: ₹ {budget ? budget : "N/A"}
        </Typography>

        {monthlyBudget && (
          <BudgetTable
            monthlyBudget={monthlyBudget}
            monthlySpending={monthlySpending}
            handleEditChange={handleEditChange}
            isMember={isMember}
          />
        )}

        <Box sx={{ height: "60px" }} />

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          {isEditing && isMember && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewBudget;
