import React from "react";
import { TextField, Button } from "@mui/material";

const CategoryManagementForm = ({
  isEditing,
  newCategory,
  setNewCategory,
  handleAddCategory,
}) => (
  <form onSubmit={handleAddCategory}>
    <TextField
      label={isEditing ? "Edit Category" : "Add Category"}
      type="text"
      fullWidth
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
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
      sx={{ padding: "10px", marginBottom: "10px" }}
    >
      {isEditing ? "Update Category" : "Add Category"}
    </Button>
  </form>
);

export default CategoryManagementForm;
