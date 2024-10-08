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
import SetBudget from "./views/dashboard/components/SetBudget";
import Analytics from "./views/home/components/Analytics";
import Reports from "./views/dashboard/components/Reports";

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
            <ProtectedRoute requiredRole={["user", "member"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/log-expense"
          element={
            <ProtectedRoute requiredRole={["user", "member"]}>
              <LogExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/view-budget"
          element={
            <ProtectedRoute requiredRole={["user", "member"]}>
              <ViewBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/analytics"
          element={
            <ProtectedRoute requiredRole="member">
              <Analytics />
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
        <Route
          path="/dashboard/set-budget"
          element={
            <ProtectedRoute requiredRole="admin">
              <SetBudget></SetBudget>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
