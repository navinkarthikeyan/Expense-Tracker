import React, { useState } from "react";
import { Box, Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuItems = [] }) => { // Set default value to an empty array
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    console.log("logout");
    removeCookie("token");
    dispatch(clearUserData());
    toast.success("Logout successful");
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ position: "absolute", top: 16, left: 16 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            p: 2,
            backgroundColor: "#151516",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {menuItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  color: "white",
                  my: 2,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "#2e2e2e",
                  transition: "background-color 0.3s ease",
                  width: "100%",
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "#424242",
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Box>
            ))}
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
      </Drawer>
    </>
  );
};

export default Sidebar;
