import React, { useState } from "react";
import Sidebar from "../../sidebar/Sidebar";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../../../config";

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
    { label: "Reports", path: "/dashboard/reports" },
  ];

  const handleSetBudget = async () => {
    try {
      if (!token) {
        toast.error("User not authenticated.");
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/users/budgets/update/${username}/`,
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Budget updated successfully!");
        setError("");
      }
    } catch (error) {
      console.error("Error updating budget:", error);

      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.amount || "Failed to update budget.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update budget.");
      }

      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        <Sidebar menuItems={adminMenuItems} />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "white", fontWeight: 500, marginBottom: "30px" }} // Change text color to black
          >
            Set Budget
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSetBudget();
            }}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#fff", // Change to white
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#000" }, // Change label color to black
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#000" }, // Change border color to black
                  "&:hover fieldset": { borderColor: "#000" },
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                  "& input": { color: "#000" }, // Change input text color to black
                },
              }}
            />

            <TextField
              id="amount"
              label="Amount"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#000" }, // Change label color to black
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#000" }, // Change border color to black
                  "&:hover fieldset": { borderColor: "#000" },
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                  "& input": { color: "#000" }, // Change input text color to black
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 0",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Set Budget
            </Button>
          </Box>

          {message && (
            <Typography
              variant="body1"
              sx={{ color: "#4caf50", marginTop: "20px" }}
            >
              {message}
            </Typography>
          )}

          {error && (
            <Typography
              variant="body1"
              sx={{ color: "#f44336", marginTop: "20px" }}
            >
              {error}
            </Typography>
          )}

          {budget && (
            <Typography
              variant="body1"
              sx={{ color: "#000", marginTop: "20px" }} // Change text color to black
            >
              Current Budget: ${budget}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SetBudget;
