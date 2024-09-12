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
      variant="filled"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      required
      sx={{
        backgroundColor: "white",
        borderRadius: "4px",
        marginBottom: "20px",
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
