import React, { useState, useEffect } from "react";
import { Box, Container, Paper, Alert, Typography } from "@mui/material";
import Sidebar from "../../../sidebar/Sidebar";
import useApi from "../../../../api/logExpenses";
import ExpenseLoggingForm from "./components/ExpenseLoggingForm";
import CategoryManagementForm from "./components/CategoryManagementForm";
import CategoryList from "./components/CategoryList";

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

  const homeMenuItems = [
    { label: 'View Expenses', path: '/home' },
    { label: 'Log Expense', path: '/home/log-expense' },
    { label: 'View Budget', path: '/home/view-budget' },
  ];

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
     <Sidebar menuItems={homeMenuItems} />
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
        <ExpenseLoggingForm
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          date={date}
          setDate={setDate}
          categories={categories}
          handleSubmitExpense={handleSubmitExpense}
        />
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ marginTop: "20px" }}
        >
          Manage Categories
        </Typography>
        <CategoryManagementForm
          isEditing={isEditing}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
        />
        <CategoryList
          categories={categories}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      </Container>
    </Box>
  );
};

export default ExpenseForm;
