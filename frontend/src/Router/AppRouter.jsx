import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../components/register";
import { Login } from "../components/login";
import PasswordResetRequest from "../components/PasswordResetRequest";
import PasswordResetConfirm from "../components/PasswordResetConfirm";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/password-reset-request"
          element={<PasswordResetRequest />}
        />
        <Route
          path="/password-reset-confirm/:uidb64/:token"
          element={<PasswordResetConfirm />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
