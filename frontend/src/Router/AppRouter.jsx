import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../components/register";
import { Login } from "../components/login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
