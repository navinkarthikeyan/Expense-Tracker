import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; // assuming you are using sonner for toast notifications

const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        if (!token) {
          toast.error("User not authenticated.");
          setError("User not authenticated.");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/budgets/view/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          const { amount } = response.data[0]; // Extract the amount from the first budget object
          console.log(amount);
          setBudget(amount);

          console.log(budget);
        } else {
          setError("No budget found.");
          toast.error("No budget found.");
        }
      } catch (err) {
        setError("Failed to fetch budget limit.");
        toast.error("Failed to fetch budget limit.");
        console.error(err);
      }
    };

    fetchBudget();
  }, [token]);

  return { budget, error };
};

export default useBudget;
