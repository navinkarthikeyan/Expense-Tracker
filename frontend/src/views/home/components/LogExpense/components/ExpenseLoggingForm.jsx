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
      variant="filled"
      type="text"
      inputMode="numeric"
      fullWidth
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      required
      sx={{
        backgroundColor: "white",
        borderRadius: "4px",
        marginBottom: "20px",
      }} 
    />
    <FormControl
      variant="filled"
      fullWidth
      required
      sx={{ marginBottom: "20px" }}
    >
      <InputLabel>Select Category</InputLabel>
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        variant="filled"
        sx={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "4px",
          "& .MuiSelect-select": {
            backgroundColor: "white", 
          },
          "&:focus": {
            backgroundColor: "white", 
          },
        }}
      >
        <MenuItem value="" disabled>
          Select Category
        </MenuItem>
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
        backgroundColor: "white", 
        borderRadius: "4px", 
        marginBottom: "20px", 
        "& .MuiInputBase-input": {
          color: "black", 
        },
        "& .MuiFormLabel-root": {
          color: "black",
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
