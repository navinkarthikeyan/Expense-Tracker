import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const ExpenseFilters = ({
  searchCategory,
  setSearchCategory,
  searchDate,
  setSearchDate,
  amountSort,
  setAmountSort
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
      <TextField
        select
        label="Sort Amount"
        value={amountSort}
        onChange={(e) => setAmountSort(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: "4px", minWidth: "200px" }}
      >
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="asc">Ascending</MenuItem>
        <MenuItem value="desc">Descending</MenuItem>
      </TextField>
    </Box>
  );
};

export default ExpenseFilters;
