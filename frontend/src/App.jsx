import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/auth/register";
import Login from "./views/auth/login";
import PasswordResetRequest from "./views/auth/reset/request";
import PasswordResetConfirm from "./views/auth/reset/confirm";
import Home from "./views/home";
import Dashboard from "./views/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LogExpense from "./views/home/components/LogExpense";
import ViewBudget from "./views/home/components/ViewBudget";

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
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="user">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/log-expense"
          element={
            <ProtectedRoute requiredRole="user">
              <LogExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/view-budget"
          element={
            <ProtectedRoute requiredRole="user">
              <ViewBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
