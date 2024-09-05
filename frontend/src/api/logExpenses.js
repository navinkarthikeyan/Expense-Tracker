// src/hooks/useApi.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const useApi = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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

  const addOrUpdateCategory = async (category, id = null) => {
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(
          `http://127.0.0.1:8000/api/users/categories/${id}/`,
          { name: category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated successfully");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/users/categories/",
          { name: category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category added successfully");
      }
      await fetchCategories(); // Refresh the category list
    } catch (err) {
      setError("Failed to manage category");
    }
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/users/categories/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully");
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  const logExpense = async (amount, category, date) => {
    const token = localStorage.getItem("token");
    try {
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
    } catch (err) {
      setError("Failed to create expense");
    }
  };

  return {
    categories,
    error,
    fetchCategories,
    addOrUpdateCategory,
    deleteCategory,
    logExpense,
  };
};

export default useApi;
