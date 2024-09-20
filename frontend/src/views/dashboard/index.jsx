import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import Footer from "../home/components/Footer";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import BASE_URL from "../../../config";

const AdminDash = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [open, setOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState(""); // State for role filter

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
          `${BASE_URL}/api/users/users/`,
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

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
    { label: "Reports", path: "/dashboard/reports" },
  ];

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
    setNewRole("");
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const updatedFields = {
        role: newRole,
        is_active: newRole === "admin" ? true : undefined,
        is_staff: newRole === "admin" ? true : false,
        is_superuser: newRole === "admin" ? true : false,
      };

      await axios.patch(
        `${BASE_URL}/api/users/users/${selectedUser.id}/`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, role: newRole, ...updatedFields }
            : user
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = roleFilter
    ? users.filter((user) => user.role === roleFilter)
    : users;

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Change Role",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleOpenDialog(params.row)}
          sx={{
            backgroundColor: "#1a1a1a",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Change Role
        </Button>
      ),
    },
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
      <Sidebar menuItems={adminMenuItems} />
      <Container
        component={Paper}
        elevation={3}
        sx={{
          margin: "auto",
          padding: "20px",
          maxWidth: "800px",
          color: "white",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Manage Role
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <label htmlFor="sortRole" style={{ color: "white" }}>
            Sort Role
          </label>
          <select
            id="sortRole"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              width: "10%",
              backgroundColor: "black",
              color: "white",
              border: "1px solid white",
              borderRadius: "4px",
              padding: "5px",
              outline: "none",
            }}
          >
            <option value="" style={{ color: "white" }}>
              All Roles
            </option>
            <option value="admin" style={{ color: "white" }}>
              Admin
            </option>
            <option value="member" style={{ color: "white" }}>
              Member
            </option>
            <option value="user" style={{ color: "white" }}>
              User
            </option>
          </select>
        </Box>

        {loading ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Loading users...
          </Typography>
        ) : (
          <Box
            sx={{
              height: "550px",
              width: "100%",
              backgroundColor: "#1a1a1a",
              borderRadius: "4px",
              "& .MuiDataGrid-cell": {
                color: "white",
                borderRight: "1px solid #444",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#333",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#333",
              },
              "& .MuiTablePagination-displayedRows": {
                color: "white",
              },
              "& .MuiTablePagination-selectLabel": {
                color: "white",
              },
              "& .MuiTablePagination-input": {
                color: "white",
              },
            }}
          >
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              disableSelectionOnClick
              checkboxSelection={false}
              hideFooterSelectedRowCount
            />
          </Box>
        )}
      </Container>

      <Footer />

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Change Role</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Change role for {selectedUser?.username}
          </Typography>
          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
            sx={{
              marginTop: "10px",
              color: "black",
            }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="member">Member</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRoleChange}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDash;
