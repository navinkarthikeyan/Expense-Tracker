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
} from "@mui/material";
import Footer from "../home/components/Footer";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const AdminDash = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [newRole, setNewRole] = useState(""); 
  const [open, setOpen] = useState(false); 

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

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Set Budget", path: "/dashboard/set-budget" },
    { label: "Reports", path: "/dashboard/reports" },
  ];

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
        `http://127.0.0.1:8000/api/users/users/${selectedUser.id}/`,
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
              rows={users}
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
