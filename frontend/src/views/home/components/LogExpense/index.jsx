import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Sidebar from "../../../sidebar/Sidebar";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/users/expenses/create/",
        { amount, category, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Expense Logged");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (err) {
      setError("Failed to create expense");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (isEditing) {
        await axios.put(
          `http://127.0.0.1:8000/api/users/categories/${editingCategoryId}/`,
          { name: newCategory },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully");
        setIsEditing(false);
        setEditingCategoryId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/users/categories/",
          { name: newCategory },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category added successfully");
      }
      setNewCategory("");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users/categories/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data); // Refresh categories
    } catch (err) {
      setError("Failed to manage category");
    }
  };

  const handleEditCategory = (categoryId, categoryName) => {
    setIsEditing(true);
    setEditingCategoryId(categoryId);
    setNewCategory(categoryName);
  };

  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/users/categories/${categoryId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully");
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (err) {
      setError("Failed to delete category");
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
        <form onSubmit={handleSubmitExpense}>
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
            }}
          />
          <TextField
            label=""
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            SelectProps={{ native: true }}
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFormLabel-root": {
                color: "white",
              },
            }}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </TextField>
          <TextField
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

        {/* Category Management Section */}
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ marginTop: "20px" }}
        >
          Manage Categories
        </Typography>
        <form onSubmit={handleAddCategory}>
          <TextField
            label={isEditing ? "Edit Category" : "Add Category"}
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-input": {
                color: "white",
              },
              "& .MuiFormLabel-root": {
                color: "white",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: "10px", marginBottom: "10px" }}
          >
            {isEditing ? "Update Category" : "Add Category"}
          </Button>
        </form>

        {/* Scrollable Category List */}
        <Box
          sx={{
            maxHeight: "300px", // Adjust this height as needed
            overflowY: "auto",
            marginBottom: "20px",
            border: "1px solid #444", // Optional: border to differentiate scrollable area
            borderRadius: "4px",
          }}
        >
          {categories.map((cat) => (
            <Paper
              key={cat.id}
              sx={{
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#333",
                color: "white",
              }}
            >
              <Typography>{cat.name}</Typography>
              <div>
                <IconButton
                  onClick={() => handleEditCategory(cat.id, cat.name)}
                  sx={{ color: "white" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCategory(cat.id)}
                  sx={{ color: "white" }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ExpenseForm;
