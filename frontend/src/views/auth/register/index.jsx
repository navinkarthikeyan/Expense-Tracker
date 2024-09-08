// src/views/auth/register/Register.jsx
import React, { useState } from "react";
import { registerUser, loginUser } from "../../../api";
import { toast } from "sonner";
import zxcvbn from "zxcvbn";
import Container from "../components/Container";
import ActionButton from "../components/ActionButton";
import Header from "../components/Header";
import {
  Box,
  Input,
  Link,
  Typography,
  LinearProgress,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/user/slice";
import { useCookies } from "react-cookie";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role] = useState("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setCookie] = useCookies(["token"]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const strength = zxcvbn(newPassword).score;
    setPassword(newPassword);
    setPasswordStrength((strength * 100) / 4);
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordStrength < 4) {
      toast.error("Password is too weak");
      return;
    }

    try {
      await registerUser({
        username,
        password,
        password2,
        email,
        role,
      });

      // Automatically log in after registration
      const loginResponse = await loginUser({ username, password });
      dispatch(setUserData(loginResponse));
      setCookie("token", loginResponse?.token, { path: "/" });
      localStorage.setItem("token", loginResponse?.token);
      toast.success("Registration and login successful");
      navigate("/home"); // Redirect to the home page or any other page
    } catch (error) {
      toast.error(
        Object.values(error)
          .map((e) => e)
          .join(", ")
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container>
      <Header title="Welcome Aboard!" subtitle="Register to continue..." />
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          size="medium"
          variant="standard"
          label="Username"
          type="username"
          onChange={(e) => setUsername(e.target.value)}
          required
          value={username}
        />
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            size="medium"
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            required
            value={password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-password2">Password again</InputLabel>
          <Input
            size="medium"
            type={showConfirmPassword ? "text" : "password"}
            onChange={handlePassword2Change}
            required
            value={password2}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <LinearProgress variant="determinate" value={passwordStrength} />
        <TextField
          size="medium"
          variant="standard"
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          value={email}
        />
        <ActionButton sx={{ mt: "16px" }} type="submit">
          Register
        </ActionButton>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          Already have an account?
          <Link href="/" sx={{ cursor: "pointer" }}>
            Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
