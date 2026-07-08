import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ token, children }) => {
  // Token ഇല്ലെങ്കിൽ Login Page-ലേക്ക് Redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token ഉണ്ടെങ്കിൽ Protected Page കാണിക്കുക
  return children;
};

export default ProtectedRoute;