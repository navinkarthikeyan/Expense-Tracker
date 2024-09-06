import React from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CategoryList = ({ categories, handleEditCategory, handleDeleteCategory }) => (
  <Box
    sx={{
      maxHeight: "300px",
      overflowY: "auto",
      marginBottom: "20px",
      border: "2px solid #444",
      borderRadius: "4px",
    }}
  >
    {categories.map((cat) => (
      <Paper
        key={cat.id}
        sx={{
          padding: "10px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#333",
          color: "white",
        }}
      >
        <Typography>{cat.name}</Typography>
        <div>
          <IconButton
            onClick={() => handleEditCategory(cat.id, cat.name)}
            sx={{ color: "white" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteCategory(cat.id)}
            sx={{ color: "white" }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </Paper>
    ))}
  </Box>
);

export default CategoryList;
