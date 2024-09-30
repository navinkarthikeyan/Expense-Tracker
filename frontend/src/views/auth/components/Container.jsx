import { Box, Typography } from "@mui/material";

const Container = ({ children }) => {
  return (
    <Box
      className="pattern"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        color: "white",
        padding: { xs: "20px", sm: "40px" }, 
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", sm: "4rem" }, 
          fontWeight: "bold",
          mb: 4,
        }}
      >
        Expensify
      </Typography>
      <Box
        sx={{
          width: { xs: "90%", sm: "500px" },
          borderRadius: "20px",
          p: { xs: "20px", sm: "40px 30px" }, 
          backgroundColor: "#e3e3e3",
          color: "black",
          boxShadow: 3, 
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
