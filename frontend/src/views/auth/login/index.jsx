import React, { useState, useEffect } from "react";
import { loginUser } from "../../../api";
import { setUserData } from "../../../redux/user/slice";
import Container from "../components/Container";
import ActionButton from "../components/ActionButton";

import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import {
  Box,
  Button,
  TextField,
  Link,
  Typography,
  IconButton,
  Input,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRedirect = (role) => {
    switch (role) {
      case "admin": {
        return navigate("/dashboard");
      }
      case "user": {
        return navigate("/home");
      }
      default: {
        return;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = loginUser({ username, password });
    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        dispatch(setUserData(data));
        setCookie("token", data?.token, { path: "/" });
        localStorage.setItem("token", data?.token);
        handleRedirect(data?.role);
        return `Login successful! Role: ${data.role}`;
      },
      error: (err) => {
        console.log(err);
        return "Login failed";
      },
    });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      handleRedirect(userData?.role);
    }
  }, [location?.pathname, userData?.role]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <Typography variant="h5">Welcome Back!</Typography>
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        Login to continue...
      </Typography>
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
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <FormControl variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            size="medium"
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            onChange={(e) => setPassword(e.target.value)}
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
        <Link
          href="/reset/request"
          underline="hover"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: "8px",
          }}
        >
          Forgot Password?
        </Link>
        <ActionButton sx={{ mt: "16px" }} type="submit">
          Login
        </ActionButton>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          Don't have an account?
          <Link href="/register" sx={{ cursor: "pointer" }} underline="hover">
            Signup
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
