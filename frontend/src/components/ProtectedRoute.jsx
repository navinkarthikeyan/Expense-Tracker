import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NoAccess from "../views/noaccess";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const userData = useSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData !== null) {
      setIsLoading(false);
    }
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData?.user_id) {
    console.log("not logged in");
    return <Navigate to="/" />;
  }

  const hasAccess = Array.isArray(requiredRole)
  ? requiredRole.includes(userData.role)
  : requiredRole === userData.role;

  if (!hasAccess) {
  console.log("no access");
  return <NoAccess />;
  }

  return children;
};

export default ProtectedRoute;
