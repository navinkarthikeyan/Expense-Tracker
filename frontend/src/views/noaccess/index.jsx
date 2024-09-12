import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NoAccess = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black", 
        color: "white", 
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Typography variant="h2" gutterBottom>
        No Access
      </Typography>
      <Typography variant="h5" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary" 
        onClick={navigateHome}
        sx={{ marginTop: "20px", backgroundColor: "#1976d2", color: "white" }} 
      >
        Go back
      </Button>
    </Box>
  );
};

export default NoAccess;
