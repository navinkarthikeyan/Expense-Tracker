import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCookies } from "react-cookie";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["token"]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({
    id: "",
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          return;
        }

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
        setError("Failed to fetch expenses.");
        console.error(err);
      }
    };

    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      await axios.delete(
        `http://127.0.0.1:8000/api/users/expenses/delete/${expenseId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (err) {
      setError("Failed to delete expense.");
      console.error(err);
    }
  };

  const handleOpenUpdateDialog = (expense) => {
    setSelectedExpense(expense);
    setUpdatedExpense(expense);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedExpense(null);
  };

  const handleUpdateExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/expenses/update/${selectedExpense.id}/`,
        updatedExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === response.data.id ? response.data : expense
        )
      );

      handleCloseUpdateDialog();
    } catch (err) {
      setError("Failed to update expense.");
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
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
          padding: "20px",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Expense List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              sx={{ backgroundColor: "#1a1a1a", mb: 1, borderRadius: "4px" }}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenUpdateDialog(expense)}
                    sx={{ marginLeft: "10px" }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${expense.category}: ₹${expense.amount}`}
                secondary={`Date: ${expense.date}`}
                primaryTypographyProps={{ color: "white" }}
                secondaryTypographyProps={{ color: "gray" }}
              />
            </ListItem>
          ))}
        </List>

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Expense</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Category"
              type="text"
              fullWidth
              value={updatedExpense.category}
              onChange={(e) =>
                setUpdatedExpense({
                  ...updatedExpense,
                  category: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={updatedExpense.amount}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, amount: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              value={updatedExpense.date}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, date: e.target.value })
              }
              // InputLabelProps={{
              //   shrink: true,
              // }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateExpense} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Home;
