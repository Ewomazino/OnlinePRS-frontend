import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedTypes }) => {
  const token = localStorage.getItem("authToken");
  const accountType = localStorage.getItem("accountType");

  if (!token || !allowedTypes.includes(accountType)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;