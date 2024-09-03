import React from "react";
import { Box, Button } from "@mui/material";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    console.log("logout");
    removeCookie("token");
    dispatch(clearUserData());
    toast.success("logout successful");
  };

  const handleLogExpenseClick = () => {
    console.log("hello");
    navigate("/home/log-expense"); // Navigate to LogExpense route
  };

  return (
    <Box
      className="sidebar"
      sx={{
        display: "flex",
        p: "40px 16px",
        m: "15px",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: "300px",
        backgroundColor: "#151516",
        borderRadius: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            m: "20px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "darkgray",
              cursor: "pointer",
            },
          }}
        >
          View Expenses
        </Box>
        <Box
          sx={{
            display: "flex",
            m: "20px",
            cursor: "pointer",
            color: "white",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "darkgray",
            },
          }}
          onClick={handleLogExpenseClick} // Handle click event
        >
          Log Expense
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "30px",
            fontWeight: "700",
            width: "170px",
            height: "60px",
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
