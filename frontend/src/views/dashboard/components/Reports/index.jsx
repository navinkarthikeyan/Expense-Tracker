import React, { useState, useEffect } from "react";
import Sidebar from "../../../sidebar/Sidebar";
import { Box, Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Reports = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
    { label: "Reports", path: "/dashboard/reports" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/users/expenses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExpenseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const aggregateExpensesByCategory = (expenses) => {
    const categoryTotals = {};

    expenses.forEach(expense => {
      const { category, amount } = expense;
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    return categoryTotals;
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const categoryTotals = aggregateExpensesByCategory(expenseData);
  const categories = Object.keys(categoryTotals);
  const colors = categories.map(() => generateRandomColor());

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryTotals),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Overall Spending Trends by Category",
      },
    },
  };

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Sidebar menuItems={adminMenuItems} />
      <Container
        component={Paper}
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "auto",
          padding: "20px",
          width: "90%",
          height: "80%",
          color: "white",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: "100%",
            maxWidth: "50%",
            marginLeft: "30px",
          }}
        >
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Pie data={chartData} options={chartOptions} />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            padding: "20px",
            height: "100%",
            maxWidth: "40%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Category Legend
          </Typography>
          <List sx={{ color: "white" }}>
            {categories.map((category, index) => (
              <ListItem key={category}>
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: colors[index],
                    marginRight: "10px",
                  }}
                />
                <ListItemText primary={`${category}: ${categoryTotals[category]}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default Reports;
