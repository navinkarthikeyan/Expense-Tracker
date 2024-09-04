import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../../../sidebar/Sidebar";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/expenses/create/",
        { amount, category, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setAmount("");
      setCategory("");
      setDate("");
      setError("");
    } catch (err) {
      setError("Failed to create expense");
      console.error(err);
    }
  };

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
      <Container
        component={Paper}
        elevation={3}
        sx={{
          margin: "auto",
          padding: "20px",
          maxWidth: "400px",
          color: "white",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Log Expense
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Amount"
            type="text"
            inputMode="numeric"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFormLabel-root": {
                color: "white",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "white",
              },
            }}
          />

          <TextField
            label="Category"
            type="text"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFormLabel-root": {
                color: "white",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "white",
              },
            }}
          />
          <TextField
            label=""
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFormLabel-root": {
                color: "white",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "white",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "white",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: "10px", marginTop: "10px" }}
          >
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default ExpenseForm;
