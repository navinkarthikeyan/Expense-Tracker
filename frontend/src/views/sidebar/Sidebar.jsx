import React from "react";
import { Box, Button } from "@mui/material";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { toast } from "sonner";

const Sidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("logout");
    removeCookie("token");
    dispatch(clearUserData());
    toast.success("logout successful");
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
          flexDirection: "column",
          alignItems: "center",
        }}
        className="profile"
      >
        <Box>Hello, User</Box>
        <Box sx={{}}>helo</Box>
      </Box>
      <Box className="menu-items">box2</Box>
      <Box
        sx={{ display: "flex", justifyContent: "center" }}
        className="logout"
      >
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
