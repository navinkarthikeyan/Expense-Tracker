import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const ExpenseFilters = ({
  searchCategory,
  setSearchCategory,
  searchDate,
  setSearchDate,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label="Search by Category"
        variant="filled"
        fullWidth
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: "4px" }}
      />
      <TextField
        variant="outlined"
        type="date"
      
        sx={{ width: 250, backgroundColor: "white", borderRadius: "4px" }}
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
      />
    </Box>
  );
};

export default ExpenseFilters;
