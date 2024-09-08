import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Footer from "../home/components/Footer";

const AdminDash = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("logout");
    Cookies.remove("token");
    dispatch(clearUserData());
  };

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
    // Add more admin-specific menu items here
  ];

  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
          padding: "20px",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar menuItems={adminMenuItems} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Admin Dashboard
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminDash;
