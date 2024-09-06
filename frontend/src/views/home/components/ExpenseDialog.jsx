import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ExpenseDialog = ({
  open,
  handleClose,
  updatedExpense,
  setUpdatedExpense,
  handleUpdateClick,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Expense</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Category"
          type="text"
          fullWidth
          value={updatedExpense.category}
          onChange={(e) =>
            setUpdatedExpense({ ...updatedExpense, category: e.target.value })
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
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdateClick} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseDialog;
