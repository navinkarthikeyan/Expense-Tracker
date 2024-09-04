import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
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

  const handleDeleteExpense = async (expenseId) => {
    try {
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

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/expenses/update/${updatedExpense.id}/`,
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
    } catch (err) {
      setError("Failed to update expense.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, error, handleDeleteExpense, handleUpdateExpense };
};

export default useExpenses;
