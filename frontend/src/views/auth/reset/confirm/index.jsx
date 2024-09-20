import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Container from "../../components/Container";
import ActionButton from "../../components/ActionButton";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Link, Typography } from "@mui/material";
import { toast } from "sonner";
import BASE_URL from "../../../../../config";


const PasswordResetConfirm = () => {
  const [newPassword, setNewPassword] = useState("");
  const { uidb64, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = axios.post(
      `${BASE_URL}/api/users/password-reset-confirm/`,
      {
        uidb64: uidb64,
        token: token,
        new_password: newPassword,
      }
    );
    toast.promise(promise, {
      loading: "Loading...",
      success: "Password reset successfully",
      error: "An error occurred. Please try again.",
    });
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ textAlign: "center", mb: "16px" }}>
        Password Reset
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
        as="form"
        onSubmit={handleSubmit}
      >
        <TextField
          size="medium"
          variant="standard"
          label="Enter New Password"
          type="password"
          required
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
        />
        <ActionButton sx={{ mt: "16px" }} type="submit">
          Change Password
        </ActionButton>
      </Box>
    </Container>
  );
};

export default PasswordResetConfirm;
