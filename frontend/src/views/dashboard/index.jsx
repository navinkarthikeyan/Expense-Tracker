import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import Footer from "../home/components/Footer";
import axios from "axios";

const AdminDash = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    dispatch(clearUserData());
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/users/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Expected an array of users but got:", response.data);
          setUsers([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
        const token = localStorage.getItem("token");
        const updatedFields = { 
            role: newRole,
            is_active: newRole === 'admin' ? true : undefined,
            is_staff: newRole === 'admin' ? true : false,
            is_superuser: newRole === 'admin' ? true : false,
        };
        
        await axios.patch(
            `http://127.0.0.1:8000/api/users/users/${userId}/`,
            updatedFields,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, role: newRole, ...updatedFields } : user
            )
        );
    } catch (error) {
        console.error("Error updating user role:", error);
    }
  };

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
          Admin Dashboard
        </Typography>

        {loading ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Loading users...
          </Typography>
        ) : (
          <Box>
            <Typography variant="h6">Registered Users</Typography>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        sx={{
                          color: "white", // Set text color to white
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: "white", // Set border color to white
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white", // White border when focused
                          },
                          ".MuiSvgIcon-root": {
                            color: "white", // White arrow icon color
                          },
                        }}
                      >
                        <MenuItem value="user" sx={{ color: "black" }}> {/* Set text color */}
                          User
                        </MenuItem>
                        <MenuItem value="admin" sx={{ color: "black" }}>
                          Admin
                        </MenuItem>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminDash;
