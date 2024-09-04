import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Sidebar from "../sidebar/Sidebar";
import useExpenses from "../../api/useExpenses";

const Home = () => {
  const { expenses, error, handleDeleteExpense, handleUpdateExpense } = useExpenses();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({
    id: "",
    category: "",
    amount: "",
    date: "",
  });

  const handleOpenUpdateDialog = (expense) => {
    setSelectedExpense(expense);
    setUpdatedExpense(expense);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedExpense(null);
  };

  const handleUpdateClick = () => {
    handleUpdateExpense(updatedExpense);
    handleCloseUpdateDialog();
  };

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
          padding: "20px",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Expense List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {expenses.map((expense) => (
            <ListItem
              key={expense.id}
              sx={{ backgroundColor: "#1a1a1a", mb: 1, borderRadius: "4px" }}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenUpdateDialog(expense)}
                    sx={{
                      marginLeft: "10px",
                      background: "white",
                      padding: "4px",
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: "black" }} />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${expense.category}: ₹${expense.amount}`}
                secondary={`Date: ${expense.date}`}
                primaryTypographyProps={{ color: "white" }}
                secondaryTypographyProps={{ color: "gray" }}
              />
            </ListItem>
          ))}
        </List>

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Expense</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Category"
              type="text"
              fullWidth
              value={updatedExpense.category}
              onChange={(e) =>
                setUpdatedExpense({
                  ...updatedExpense,
                  category: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={updatedExpense.amount}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, amount: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              value={updatedExpense.date}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, date: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateClick} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Home;
