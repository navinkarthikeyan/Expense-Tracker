import React from "react";
import Sidebar from "../../sidebar/Sidebar";
import { Box, Typography } from "@mui/material";

const SetBudget = () => {
  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
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
          Set Budget
        </Typography>
      </Box>
    </Box>
  );
};

export default SetBudget;
