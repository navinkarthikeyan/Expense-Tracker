import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#333",
        color: "white",
        padding: "10px",
        textAlign: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">Navin</Typography>
      <Typography variant="body2">Mobile: +91 9176987732</Typography>
      <Typography variant="body2">
        Contact: NavinKarthikeyan12@gmail.com
      </Typography>
    </Box>
  );
};

export default Footer;
