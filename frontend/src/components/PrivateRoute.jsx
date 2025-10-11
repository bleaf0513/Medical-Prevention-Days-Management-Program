import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, admin } = useContext(AuthContext);
  
  if (adminOnly) {
    if (!admin) return <Navigate to="/admin/login" replace />;
    return children;
  }
  
  if (!user && !admin) return <Navigate to="/login" replace />;
  return children;
}
