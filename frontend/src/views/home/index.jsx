import Sidebar from "../sidebar/Sidebar";

import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        background: "black",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
    >
      <Sidebar />
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
        }}
      >
        Hello
      </Box>
    </Box>
  );
};

export default Home;
