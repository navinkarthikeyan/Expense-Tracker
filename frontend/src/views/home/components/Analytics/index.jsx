import React, { useState, useEffect } from "react";
import Sidebar from "../../../sidebar/Sidebar";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Index = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
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
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/expenses/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const expenses = response.data;
        processBarChartData(expenses);
        processPieChartData(expenses);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expense data");
        setLoading(false);
      }
    };

    const processBarChartData = (expenses) => {
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

      setBarChartData({
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

    const processPieChartData = (expenses) => {
      const months = {};
      expenses.forEach((expense) => {
        const { amount, date } = expense;
        const month = new Date(date).toLocaleString("default", {
          month: "long",
        });
        months[month] = (months[month] || 0) + amount;
      });

      setPieChartData({
        labels: Object.keys(months),
        datasets: [
          {
            label: "Total Expenses by Month",
            data: Object.values(months),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: "rgba(255, 255, 255, 1)",
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
        flexDirection: "row",
      }}
    >
      <Sidebar menuItems={homeMenuItems} />
      <Box
        sx={{
          flexGrow: 1,
          padding: "20px",
          height: "100vh",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#fff",
            fontWeight: 600,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Analysis
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: "20px", 
            }}
          >
            {barChartData && (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "800px", 
                  height: "400px", 
                  backgroundColor: "#1E1E1E",
                  padding: "15px", 
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333", 
                }}
              >
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          color: "white",
                        },
                      },
                      title: {
                        display: true,
                        text: "Expenses Breakdown by Category",
                        color: "white",
                        font: {
                          size: 16,
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "white" },
                        grid: { color: "#444" },
                      },
                      y: {
                        ticks: { color: "white" },
                        grid: { color: "#444" },
                      },
                    },
                  }}
                />
              </Box>
            )}

            {pieChartData && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  maxWidth: "800px", 
                  height: "400px", 
                  backgroundColor: "#1E1E1E",
                  padding: "15px", 
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333", 
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: "Total Expenses by Month",
                          color: "white",
                          font: {
                            size: 16,
                          },
                        },
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingLeft: "20px",
                    color: "white",
                  }}
                >
                  {pieChartData.labels.map((label, index) => (
                    <Box key={label} sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      <Box
                        sx={{
                          width: "25px", 
                          height: "25px", 
                          backgroundColor: pieChartData.datasets[0].backgroundColor[index],
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      <Typography variant="body2">{label}: {pieChartData.datasets[0].data[index]}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Index;
