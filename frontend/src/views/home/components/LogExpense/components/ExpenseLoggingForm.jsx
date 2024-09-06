import React from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ExpenseLoggingForm = ({
  amount,
  setAmount,
  category,
  setCategory,
  date,
  setDate,
  categories,
  handleSubmitExpense,
}) => (
  <form onSubmit={handleSubmitExpense}>
    <TextField
      label="Amount"
      type="text"
      inputMode="numeric"
      fullWidth
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      required
      sx={{
        marginBottom: "20px",
        "& .MuiInputBase-input": {
          color: "white",
        },
        "& .MuiFormLabel-root": {
          color: "white",
        },
      }}
    />
    <FormControl fullWidth required sx={{ marginBottom: "20px" }}>
      <InputLabel sx={{ color: "white" }}>Select Category</InputLabel>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{
          color: "white",
          "& .MuiSelect-icon": {
            color: "white",
          },
          "& .MuiSelect-select": {
            color: "white",
          },
          "& .MuiMenuItem-root": {
            color: "black",
          },
        }}
      >
        <MenuItem value="" disabled>Select Category</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      type="date"
      fullWidth
      value={date}
      onChange={(e) => setDate(e.target.value)}
      required
      sx={{
        marginBottom: "20px",
        "& .MuiInputBase-input": {
          color: "white",
        },
        "& .MuiFormLabel-root": {
          color: "white",
        },
      }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      sx={{ padding: "10px", marginTop: "10px" }}
    >
      Submit
    </Button>
  </form>
);

export default ExpenseLoggingForm;
