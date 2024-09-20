import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../config";

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/users/expenses/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setExpenses(response.data);
    } catch (err) {
      toast.error("Failed to fetch expenses.");
      console.error(err);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      await axios.delete(
        `${BASE_URL}/api/users/expenses/delete/${expenseId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
      toast.success("Expense deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete expense.");
      console.error(err);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/users/expenses/update/${updatedExpense.id}/`,
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
      toast.success("Expense updated successfully.");
    } catch (err) {
      toast.error("Failed to update expense.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, handleDeleteExpense, handleUpdateExpense };
};

export default useExpenses;
