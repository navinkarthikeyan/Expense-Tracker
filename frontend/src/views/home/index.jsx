import Sidebar from "../sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "axios";
const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

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
        setExpenses(response.data);
      } catch (err) {
        setError("Failed to fetch expenses ");
        console.log({ token });
        console.error(err);
      }
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
      }}
    >
      <Sidebar />
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
        }}
      >
        <div>
          <h2>Expense List</h2>
          {error && <p>{error}</p>}
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                {expense.category}: ₹{expense.amount} on {expense.date}
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Box>
  );
};

export default Home;
