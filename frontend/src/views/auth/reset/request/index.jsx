import { useState } from "react";
import axios from "axios";
import Container from "../../components/Container";
import ActionButton from "../../components/ActionButton";
// import "../../../../styles/passwordreset.css";
import { toast } from "sonner";
import { Box, Button, Input, Link, Typography } from "@mui/material";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promise = axios.post(
        `${BASE_URL}/api/users/password-reset/`,
        { email }
      );
      toast.promise(promise, {
        loading: "Loading...",
        success: "Password reset email sent (if the email is registered).",
        error: "An error occurred. Please try again.",
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ textAlign: "center", mb: "16px" }}>
        Password Reset Request Form
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
        as="form"
        onSubmit={handleSubmit}
      >
        <Input
          size="medium"
          variant="standard"
          label="Enter Email"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <ActionButton sx={{ mt: "16px" }} type="submit">
          <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            Send Request
          </Box>
        </ActionButton>
      </Box>
    </Container>
  );
};

export default PasswordResetRequest;
