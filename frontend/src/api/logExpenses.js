import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../config";



const useApi = () => {
  const [categories, setCategories] = useState([]);

  
  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/categories/`,
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
  }, []); 
  const addOrUpdateCategory = async (category, id = null) => {
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(
          `${BASE_URL}/api/users/categories/${id}/`,
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
          `${BASE_URL}/api/users/categories/`,
          { name: category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category added successfully");
      }
      await fetchCategories(); 
    } catch (err) {
      toast.error("Failed to manage category");
    }
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${BASE_URL}/api/users/categories/${id}/`,
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
        `${BASE_URL}/api/users/expenses/create/`,
        { amount, category, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Expense Logged");
    } catch (err) {
     
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error); 
      } else {
        toast.error("Failed to create expense");
      }
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
