import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { admin } = useContext(AuthContext);
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
