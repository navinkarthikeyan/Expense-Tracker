import React, { useState } from "react";
import Sidebar from "../../sidebar/Sidebar";
import { Box, Typography, Button, FormControl, InputLabel, Input } from "@mui/material";
import axios from "axios";
import { toast } from "sonner";

const SetBudget = () => {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [budget] = useState(null);

  const token = localStorage.getItem("token");

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
  ];

  const handleSetBudget = async () => {
    try {
      if (!token) {
        toast.error("User not authenticated.");
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/budgets/update/${username}/`,
        { amount: parseFloat(amount) }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Budget updated successfully!");
        toast.success("Budget updated successfully!");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      setMessage("Failed to update budget. Please try again.");
      toast.error("Failed to update budget.");
    }
  };

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
        <Sidebar menuItems={adminMenuItems} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Set Budget
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSetBudget();
          }}
        >
          <FormControl variant="outlined" sx={{ marginBottom: "20px", width: "300px" }}>
            <InputLabel htmlFor="username" sx={{ color: "white" }}>Username</InputLabel>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ color: "white", '& .MuiInputBase-input': { color: 'white' }, '& .MuiFormLabel-root': { color: 'white' }}}
            />
          </FormControl>
          
          <FormControl variant="outlined" sx={{ marginBottom: "20px", width: "300px" }}>
            <InputLabel htmlFor="amount" sx={{ color: "white" }}>Amount</InputLabel>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ color: "white", '& .MuiInputBase-input': { color: 'white' }, '& .MuiFormLabel-root': { color: 'white' }}}
            />
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginBottom: "20px" }}
          >
            Set Budget
          </Button>
          {message && (
            <Typography variant="body1" sx={{ color: "white" }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography variant="body1" sx={{ color: "red" }}>
              {error}
            </Typography>
          )}
        </Box>

        {budget && (
          <Typography
            variant="body1"
            sx={{ color: "white", textAlign: "center", marginTop: "20px" }}
          >
            Current Budget: ${budget}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SetBudget;
