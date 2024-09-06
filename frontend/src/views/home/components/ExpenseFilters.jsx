import React from "react";
import { Box, TextField } from "@mui/material";

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
        variant="outlined"
        fullWidth
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: "4px" }}
      />
      <TextField
        variant="outlined"
        type="date"
        fullWidth
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: "4px" }}
      />
    </Box>
  );
};

export default ExpenseFilters;
