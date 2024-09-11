import React, { useState, useEffect } from "react";
import Sidebar from "../../../sidebar/Sidebar";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const index = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const homeMenuItems = [
    { label: "View Expenses", path: "/home" },
    { label: "Log Expense", path: "/home/log-expense" },
    { label: "View Budget", path: "/home/view-budget" },
    { label: "Analytics", path: "/home/analytics" },
  ];

  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://127.0.0.1:8000/api/users/expenses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const expenses = response.data;
        processChartData(expenses);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expense data");
        setLoading(false);
      }
    };

    const processChartData = (expenses) => {
      const categories = [];
      const amounts = [];

      expenses.forEach((expense) => {
        const { category, amount } = expense;
        if (categories.includes(category)) {
         
          amounts[categories.indexOf(category)] += amount;
        } else {
          categories.push(category);
          amounts.push(amount);
        }
      });

      setChartData({
        labels: categories,
        datasets: [
          {
            label: "Expenses by Category",
            data: amounts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchExpenses();
  }, []);

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "fixed", 
        overflow: "hidden", 
      }}
    >
      <Box
        sx={{
          width: "250px", 
          height: "100vh",
          position: "fixed", 
          overflowY: "auto", 
        }}
      >
        <Sidebar menuItems={homeMenuItems} />
      </Box>
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
          padding: "20px",
          marginLeft: "250px", 
          height: "100vh",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", 
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Analysis
        </Typography>

        {loading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Expenses Breakdown by Category",
                },
              },
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default index;
