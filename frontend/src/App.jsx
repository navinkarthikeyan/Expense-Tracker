import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/auth/register";
import Login from "./views/auth/login";
import PasswordResetRequest from "./views/auth/reset/request";
import PasswordResetConfirm from "./views/auth/reset/confirm";
import Home from "./views/home";
import Dashboard from "./views/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset/request" element={<PasswordResetRequest />} />
        <Route
          path="/reset/confirm/:uidb64/:token"
          element={<PasswordResetConfirm />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
