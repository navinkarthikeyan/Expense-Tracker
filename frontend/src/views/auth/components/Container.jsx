import { Box } from "@mui/material";

const Container = ({ children }) => {
  return (
    <Box
    className='pattern'
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box 
        sx={{
          minWidth: "500px",
          borderRadius: "20px",
          p: "40px 30px",
          backgroundColor: "#e3e3e3",
          color: "black",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
