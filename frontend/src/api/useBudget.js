import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner"; 
import BASE_URL from "../../config";

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
          `${BASE_URL}/api/users/budgets/view/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          const { amount } = response.data[0]; 
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
