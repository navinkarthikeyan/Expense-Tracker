import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

const useApi = () => {
  const [categories, setCategories] = useState([]);

  // Memoize the fetchCategories function to prevent unnecessary re-renders
  const fetchCategories = useCallback(async () => {
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
      toast.error("Failed to fetch categories");
    }
  }, []); // Empty dependency array ensures this function is not recreated

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
      await fetchCategories(); // Refresh the category list after adding/updating
    } catch (err) {
      toast.error("Failed to manage category");
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
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const logExpense = async (amount, category, date) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        toast.error("User not authenticated.");
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
      toast.error("Failed to create expense");
    }
  };

  return {
    categories,
    fetchCategories,
    addOrUpdateCategory,
    deleteCategory,
    logExpense,
  };
};

export default useApi;
