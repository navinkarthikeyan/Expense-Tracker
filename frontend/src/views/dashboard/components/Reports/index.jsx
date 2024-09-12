import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../sidebar/Sidebar";
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Reports = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // Ref to capture the chart component

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

  const handleDownloadReport = async () => {
    const chartCanvas = chartRef.current;
  
    if (chartCanvas) {
      const canvas = await html2canvas(chartCanvas, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF();
      
     
      pdf.setFontSize(22);
      pdf.setTextColor(40, 44, 52); 
      pdf.text("Expense Report", 105, 20, null, null, "center"); 
  
     
      pdf.setFontSize(14);
      pdf.setTextColor(100);
      pdf.text("Overview of spending by category", 105, 28, null, null, "center");
  
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(150); 
      pdf.line(15, 35, 195, 35);
  
     
      pdf.addImage(imgData, "PNG", 25, 40, 160, 90); 
      
      
      pdf.setFontSize(12);
      pdf.setTextColor(40, 44, 52);
      pdf.text("Spending by Category", 15, 140);
  
      
      pdf.line(15, 142, 195, 142);
  
      
      pdf.setFontSize(11);
      pdf.setFillColor(230, 230, 230); 
      pdf.rect(15, 145, 40, 10, "F"); 
      pdf.rect(55, 145, 30, 10, "F");
      pdf.text("Category", 17, 152);  
      pdf.text("Amount", 57, 152);   
  
      
      let yPos = 160;
      
      categories.forEach((category, index) => {
        const color = colors[index];
  
        
        pdf.setFillColor(color);
        pdf.rect(15, yPos - 5, 5, 5, "F");
  
       
        pdf.setTextColor(40, 44, 52);
        pdf.text(category, 22, yPos);
  
 
        pdf.text(`${categoryTotals[category].toFixed(2)} INR`, 57, yPos);
  
        yPos += 10; 
      });
  
    
      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Report generated on: ${currentDate}`, 15, 285); 
      pdf.text(`Page 1 of 1`, 195, 285, null, null, "right"); 
  
      
      pdf.save("expense-report.pdf");
    }
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
            <Box ref={chartRef} sx={{ width: "100%", height: "100%" }}>
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

         
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadReport}
            sx={{ marginTop: "20px" }}
          >
            Download Report
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Reports;
