// src/components/ExpenseForm.js
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
import Sidebar from "../../../sidebar/Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useApi from "../../../../api/logExpenses";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const {
    categories,
    error,
    fetchCategories,
    addOrUpdateCategory,
    deleteCategory,
    logExpense,
  } = useApi();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    await logExpense(amount, category, date);
    setAmount("");
    setCategory("");
    setDate("");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    await addOrUpdateCategory(
      newCategory,
      isEditing ? editingCategoryId : null
    );
    setNewCategory("");
    setIsEditing(false);
    setEditingCategoryId(null);
  };

  const handleEditCategory = (categoryId, categoryName) => {
    setIsEditing(true);
    setEditingCategoryId(categoryId);
    setNewCategory(categoryName);
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
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

        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            marginBottom: "20px",
            border: "2px solid #444",
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
