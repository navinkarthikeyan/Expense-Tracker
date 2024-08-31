import React from "react";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  };
  return (
    <div>
      <h1>No Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={navigateHome}>Go back</button>
    </div>
  );
};

export default NoAccess;
